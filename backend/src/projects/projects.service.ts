import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ParserService } from '../parser/parser.service';
import { GeneratorService } from '../generator/generator.service';
import { CreateProjectDto, UpdateProjectDto, ProjectStatus } from './dto/create-project.dto';


@Injectable()
export class ProjectsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly parserService: ParserService,
    private readonly generatorService: GeneratorService,
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

    // Asynchronously parse and generate — update project in background
    this.parseAndGenerate(project.id, prompt, userId).catch((err) => {
      this.logger.error(
        `Background generation failed for project ${project.id}: ${err.message}`,
        err.stack,
      );
    });

    return project;
  }

  private async parseAndGenerate(projectId: string, prompt: string, userId?: string): Promise<void> {
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
        await this.prisma.user.update({
          where: { id: userId },
          data: { generationsUsed: { increment: 1 } },
        });
        this.logger.log(`Incremented generationsUsed for user ${userId}`);
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
    return {
      ...project,
      status: (project.status as string).toLowerCase(),
      schema: project.parsedSchema ?? null,
      generatedOutput: project.generatedFiles
        ? { files: project.generatedFiles as any[] }
        : null,
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

    // Trigger regeneration in background
    this.parseAndGenerate(id, project.prompt, userId).catch((err) => {
      this.logger.error(
        `Re-generation failed for project ${id}: ${err.message}`,
        err.stack,
      );
    });

    return { message: 'Regeneration started', projectId: id };
  }
}
