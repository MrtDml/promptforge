import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
  NotFoundException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsObject, IsOptional } from 'class-validator';
import { Response } from 'express';
import * as archiver from 'archiver';
import { GeneratorService } from './generator.service';
import { ParsedSchema } from '../parser/dto/parse-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtRequest } from '../common/types/jwt-request.type';

class GenerateFromSchemaDto {
  @IsObject()
  schema: Record<string, any>;

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}

@Controller('generator')
@UseGuards(JwtAuthGuard)
export class GeneratorController {
  private readonly logger = new Logger(GeneratorController.name);

  constructor(
    private readonly generatorService: GeneratorService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * POST /generator/generate
   *
   * Accepts either an AppSchema (appName, entities…) or a ParsedSchema
   * (app_name, entities…), generates the project files, persists the project
   * to the database, and returns the projectId together with the generated
   * file list so the frontend can navigate straight to the detail page.
   */
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // max 5 generations per minute
  async generate(@Body() body: GenerateFromSchemaDto, @Request() req: JwtRequest) {
    // ── Quota check ──────────────────────────────────────────────────────────
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (user.generationsUsed >= user.generationsLimit) {
      throw new ForbiddenException(
        `Generation limit reached (${user.generationsUsed}/${user.generationsLimit}). Please upgrade your plan to continue.`,
      );
    }

    // Normalise to ParsedSchema so the generator service always receives a
    // consistent input (handle both camelCase and snake_case from the client).
    const raw = body.schema;
    const parsedSchema: ParsedSchema = {
      app_name: raw.appName ?? raw.app_name ?? 'app',
      description: raw.description,
      entities: (raw.entities ?? []).map((e: any) => ({
        name: e.name,
        fields: (e.fields ?? []).map((f: any) => ({
          name: f.name,
          type: f.type ?? 'string',
          required: f.required ?? false,
          unique: f.unique ?? false,
        })),
      })),
      features: raw.features ?? raw._parsed?.features ?? [],
      relations: raw._parsed?.relations ?? raw.relations,
      auth_entity: raw._parsed?.auth_entity ?? raw.auth_entity,
    };

    const result = this.generatorService.generateFromSchema(parsedSchema, body.options);

    // Persist to DB so the project detail page can retrieve it
    const project = await this.prisma.project.create({
      data: {
        name: parsedSchema.app_name,
        description: parsedSchema.description ?? null,
        prompt: raw.rawPrompt ?? JSON.stringify(parsedSchema),
        status: 'COMPLETED',
        userId: req.user.id,
        parsedSchema: parsedSchema as any,
        generatedFiles: result.files as any,
        appName: parsedSchema.app_name,
        entityCount: result.summary.entityCount,
        fileCount: result.summary.fileCount,
        features: parsedSchema.features as string[],
      },
    });

    this.logger.log(
      `Project ${project.id} created with ${result.files.length} files for user ${req.user.id}`,
    );

    // ── Increment quota + fire emails ────────────────────────────────────────
    const newUsed = await this.usersService.incrementGenerationsUsed(req.user.id);

    // Warn when 80 %+ of the limit is consumed
    if (newUsed >= Math.ceil(user.generationsLimit * 0.8)) {
      this.mailService
        .sendLimitWarningEmail(user.email, user.name, newUsed, user.generationsLimit)
        .catch((err) => this.logger.error(`Limit warning email failed: ${err.message}`));
    }

    // Notify the user that the project is ready
    this.mailService
      .sendProjectCompleteEmail(user.email, user.name, project.name, project.id)
      .catch((err) => this.logger.error(`Project complete email failed: ${err.message}`));

    return {
      projectId: project.id,
      output: {
        files: result.files,
      },
      status: 'completed',
    };
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  preview(@Body() body: GenerateFromSchemaDto) {
    const raw = body.schema;
    const parsedSchema: ParsedSchema = {
      app_name: raw.appName ?? raw.app_name ?? 'app',
      description: raw.description,
      entities: raw.entities ?? [],
      features: raw.features ?? [],
    };
    const project = this.generatorService.generateProject(parsedSchema);
    return {
      appName: project.appName,
      prismaSchema: project.prismaSchema,
      summary: project.summary,
      generatedAt: project.generatedAt,
    };
  }

  /**
   * GET /generator/download/:projectId
   *
   * Streams a zip archive of all generated files for the given project.
   * The project must belong to the authenticated user.
   */
  @Get('download/:projectId')
  async downloadZip(
    @Param('projectId') projectId: string,
    @Request() req: JwtRequest,
    @Res() res: Response,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (project.userId !== req.user.id) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    let files: Array<{ path: string; content: string }> = [];

    if (
      project.generatedFiles &&
      Array.isArray(project.generatedFiles) &&
      (project.generatedFiles as any[]).length > 0
    ) {
      files = project.generatedFiles as any[];
    } else if (project.parsedSchema) {
      const schema = project.parsedSchema as unknown as ParsedSchema;
      files = this.generatorService.generateProjectFiles(schema);
    }

    if (!files.length) {
      throw new NotFoundException(
        `No generated files found for project ${projectId}. ` +
          'The project may still be generating or generation may have failed.',
      );
    }

    const safeName = (project.appName ?? project.name)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const filename = `${safeName}.zip`;

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Transfer-Encoding': 'chunked',
    });

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      this.logger.error(`Archive error for project ${projectId}: ${err.message}`);
      res.destroy(err);
    });

    archive.on('finish', () => {
      this.logger.log(
        `ZIP download complete for project ${projectId} — ` +
          `${archive.pointer()} bytes, ${files.length} files`,
      );
    });

    archive.pipe(res);

    for (const file of files) {
      archive.append(file.content, { name: file.path });
    }

    await archive.finalize();
  }
}
