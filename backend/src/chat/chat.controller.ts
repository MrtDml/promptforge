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
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Throttle } from '@nestjs/throttler';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Controller('projects/:id/chat')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { message: string; history?: ChatMessage[] },
  ) {
    const { message, history = [] } = body;

    if (!message?.trim()) throw new BadRequestException('Message is required.');

    const project = await this.prisma.project.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!project) throw new NotFoundException('Project not found.');
    if (project.status !== 'COMPLETED') {
      throw new BadRequestException('Project must be completed to use AI chat.');
    }

    const generatedFiles = (project.generatedFiles as Record<string, string>) ?? {};

    const { reply, updatedFiles } = await this.chatService.chat(
      message,
      history,
      {
        name: project.name,
        description: project.description ?? undefined,
        generatedFiles,
      },
    );

    // If AI returned file changes, persist them
    if (updatedFiles && Object.keys(updatedFiles).length > 0) {
      const merged = { ...generatedFiles, ...updatedFiles };
      await this.prisma.project.update({
        where: { id },
        data: { generatedFiles: merged },
      });
    }

    return {
      reply,
      updatedFiles: updatedFiles ?? null,
    };
  }
}
