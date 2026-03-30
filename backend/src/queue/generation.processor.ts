import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService } from '../parser/parser.service';
import { GeneratorService } from '../generator/generator.service';
import { MailService } from '../mail/mail.service';

export interface GenerationJobData {
  projectId: string;
  prompt: string;
  userId?: string;
}

@Processor('generation')
export class GenerationProcessor {
  private readonly logger = new Logger(GenerationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly parserService: ParserService,
    private readonly generatorService: GeneratorService,
    private readonly mailService: MailService,
  ) {}

  @Process('generate')
  async handleGeneration(job: Job<GenerationJobData>): Promise<void> {
    const { projectId, prompt, userId } = job.data;
    this.logger.log(`Processing generation job ${job.id} for project ${projectId}`);

    try {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'GENERATING' },
      });

      await job.progress(10);

      const schema = await this.parserService.parsePrompt({ prompt });
      await job.progress(50);

      const generatedFiles = this.generatorService.generateProjectFiles(schema);
      await job.progress(80);

      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'COMPLETED',
          parsedSchema: schema as any,
          generatedFiles: generatedFiles as any,
          appName: schema.app_name,
          entityCount: schema.entities.length,
          fileCount: generatedFiles.length,
          features: schema.features,
        },
      });

      if (userId) {
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: { generationsUsed: { increment: 1 } },
        });

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

        const { generationsLimit: limit, generationsUsed: used } = updatedUser;
        if (limit > 0 && used / limit >= 0.8 && used < limit) {
          this.mailService
            .sendLimitWarningEmail(updatedUser.email, updatedUser.name, used, limit)
            .catch((err) =>
              this.logger.error(`Failed to send limit warning email: ${err.message}`),
            );
        }
      }

      await job.progress(100);
      this.logger.log(`Job ${job.id}: project ${projectId} generation completed`);
    } catch (error: any) {
      this.logger.error(
        `Job ${job.id}: project ${projectId} generation failed — ${error.message}`,
        error.stack,
      );
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED', errorMessage: error.message },
      });
      throw error; // re-throw so Bull marks job as failed and triggers retry
    }
  }
}
