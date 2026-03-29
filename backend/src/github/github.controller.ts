import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class GithubController {
  private readonly prisma = new PrismaClient();

  constructor(private readonly githubService: GithubService) {}

  @Post(':id/export/github')
  @HttpCode(HttpStatus.OK)
  async exportToGithub(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { token: string; repoName: string; isPrivate?: boolean },
  ) {
    const { token, repoName, isPrivate = false } = body;

    if (!token?.trim()) throw new BadRequestException('GitHub token is required.');
    if (!repoName?.trim()) throw new BadRequestException('Repository name is required.');

    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== req.user.id) {
      throw new BadRequestException('Project not found.');
    }
    if (project.status !== 'COMPLETED') {
      throw new BadRequestException('Project must be completed before exporting.');
    }

    const files = project.generatedFiles as any[];
    if (!files?.length) throw new BadRequestException('No generated files found.');

    const result = await this.githubService.exportToGithub(
      token,
      repoName,
      isPrivate,
      files,
      project.description ?? undefined,
    );

    return { success: true, data: result };
  }
}
