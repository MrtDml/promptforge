import { randomBytes } from 'crypto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  Optional,
  Inject,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService } from '../parser/parser.service';
import { GeneratorService } from '../generator/generator.service';
import { CreateProjectDto, UpdateProjectDto, ProjectStatus } from './dto/create-project.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly parserService: ParserService,
    private readonly generatorService: GeneratorService,
    private readonly mailService: MailService,
    @Optional() @InjectQueue('generation') private readonly generationQueue: Queue | null,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const { name, description, prompt } = createProjectDto;

    // Create project record with PENDING status
    const project = await this.prisma.project.create({
      data: {
        name,
        description: description ?? null,
        prompt,
        status: ProjectStatus.PENDING,
        userId,
      },
    });

    this.logger.log(`Project created: ${project.id} by user ${userId}`);

    if (this.generationQueue) {
      // Persistent job — survives restarts, auto-retries on failure
      await this.generationQueue.add('generate', {
        projectId: project.id,
        prompt,
        userId,
      });
      this.logger.log(`Generation job queued for project ${project.id}`);
    } else {
      // Fallback: fire-and-forget (no Redis)
      this.parseAndGenerate(project.id, prompt, userId).catch((err) => {
        this.logger.error(
          `Background generation failed for project ${project.id}: ${err.message}`,
          err.stack,
        );
      });
    }

    return project;
  }

  private async parseAndGenerate(
    projectId: string,
    prompt: string,
    userId?: string,
  ): Promise<void> {
    try {
      // Mark as GENERATING
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.GENERATING },
      });

      // Parse the prompt
      const schema = await this.parserService.parsePrompt({ prompt });

      // Generate ALL project files (full NestJS scaffold including Docker, auth, etc.)
      const generatedFiles = this.generatorService.generateProjectFiles(schema);

      // Save results — generatedFiles is stored as JSON so the download endpoint
      // can retrieve it directly without re-running the generator.
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: ProjectStatus.COMPLETED,
          parsedSchema: schema as any,
          generatedFiles: generatedFiles as any,
          appName: schema.app_name,
          entityCount: schema.entities.length,
          fileCount: generatedFiles.length,
          features: schema.features,
        },
      });

      // Increment the user's generation counter (only for non-unlimited plans)
      if (userId) {
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: { generationsUsed: { increment: 1 } },
        });
        this.logger.log(`Incremented generationsUsed for user ${userId}`);

        // Send project complete email
        const project = await this.prisma.project.findUnique({
          where: { id: projectId },
          select: { name: true },
        });
        this.mailService
          .sendProjectCompleteEmail(
            updatedUser.email,
            updatedUser.name,
            project?.name ?? 'Your project',
            projectId,
          )
          .catch((err) =>
            this.logger.error(`Failed to send project complete email: ${err.message}`),
          );

        // Warn if approaching limit (80% used)
        const limit = updatedUser.generationsLimit;
        const used = updatedUser.generationsUsed;
        if (limit > 0 && used / limit >= 0.8 && used < limit) {
          this.mailService
            .sendLimitWarningEmail(updatedUser.email, updatedUser.name, used, limit)
            .catch((err) =>
              this.logger.error(`Failed to send limit warning email: ${err.message}`),
            );
        }
      }

      this.logger.log(`Project ${projectId} generation completed`);
    } catch (error: any) {
      this.logger.error(`Project ${projectId} generation failed: ${error.message}`);
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: ProjectStatus.FAILED,
          errorMessage: error.message,
        },
      });
    }
  }

  async findAllByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          appName: true,
          entityCount: true,
          fileCount: true,
          features: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.project.count({ where: { userId } }),
    ]);

    const normalizedItems = items.map((p: any) => ({
      ...p,
      status: (p.status as string).toLowerCase(),
    }));

    return {
      data: normalizedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Normalize for frontend compatibility
    const rawSchema = project.parsedSchema as any;
    const normalizedSchema = rawSchema
      ? {
          appName: rawSchema.appName ?? rawSchema.app_name ?? '',
          description: rawSchema.description ?? '',
          entities: Array.isArray(rawSchema.entities) ? rawSchema.entities : [],
          endpoints: Array.isArray(rawSchema.endpoints)
            ? rawSchema.endpoints
            : Array.isArray(rawSchema.relations)
              ? rawSchema.relations
              : [],
          features: Array.isArray(rawSchema.features) ? rawSchema.features : [],
          techStack: rawSchema.techStack ?? {
            backend: 'NestJS',
            database: 'PostgreSQL',
            auth: 'JWT',
          },
          rawPrompt: rawSchema.rawPrompt,
        }
      : null;

    return {
      ...project,
      status: (project.status as string).toLowerCase(),
      schema: normalizedSchema,
      generatedOutput: project.generatedFiles ? { files: project.generatedFiles as any[] } : null,
    };
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id, userId); // Ensure exists and owned

    const { schema, ...rest } = updateProjectDto;
    const data: Record<string, any> = { ...rest };
    if (schema !== undefined) {
      data.parsedSchema = schema;
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure exists and owned

    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }

  async regenerate(id: string, userId: string) {
    const project = await this.findOne(id, userId);

    this.logger.log(`Re-generating project ${id}`);

    if (this.generationQueue) {
      await this.generationQueue.add('generate', {
        projectId: id,
        prompt: project.prompt,
        userId,
      });
    } else {
      this.parseAndGenerate(id, project.prompt, userId).catch((err) => {
        this.logger.error(`Re-generation failed for project ${id}: ${err.message}`, err.stack);
      });
    }

    return { message: 'Regeneration started', projectId: id };
  }

  async toggleShare(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const newIsPublic = !project.isPublic;
    const shareToken = newIsPublic ? randomBytes(16).toString('hex') : null;

    const updated = await this.prisma.project.update({
      where: { id },
      data: { isPublic: newIsPublic, shareToken },
    });

    return { isPublic: updated.isPublic, shareToken: updated.shareToken };
  }

  async listPublicProjects() {
    const CACHE_KEY = 'projects:public';
    const cached = await this.cache.get(CACHE_KEY);
    if (cached) return cached;

    const result = await this.prisma.project.findMany({
      where: { isPublic: true },
      select: { shareToken: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });

    await this.cache.set(CACHE_KEY, result, 300_000); // 5 dakika
    return result;
  }

  async findByShareToken(shareToken: string) {
    const project = await this.prisma.project.findFirst({
      where: { shareToken, isPublic: true },
      select: {
        id: true,
        name: true,
        description: true,
        appName: true,
        entityCount: true,
        fileCount: true,
        features: true,
        parsedSchema: true,
        generatedFiles: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });
    if (!project) {
      throw new NotFoundException('Shared project not found');
    }
    return project;
  }
}
