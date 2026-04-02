import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService, ChatMessage } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Throttle } from '@nestjs/throttler';
import { JwtRequest } from '../common/types/jwt-request.type';

@Controller('projects/:id/chat')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  // ── Non-streaming (kept for backwards compatibility) ────────────────────────

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(
    @Param('id') id: string,
    @Request() req: JwtRequest,
    @Body() body: { message: string; history?: ChatMessage[] },
  ) {
    const { message, history = [] } = body;
    if (!message?.trim()) throw new BadRequestException('Message is required.');

    const { project, generatedFiles } = await this.loadProject(id, req.user.id);

    const { reply, updatedFiles } = await this.chatService.chat(
      message,
      history,
      { name: project.name, description: project.description ?? undefined, generatedFiles },
    );

    if (updatedFiles && Object.keys(updatedFiles).length > 0) {
      await this.prisma.project.update({
        where: { id },
        data: { generatedFiles: { ...generatedFiles, ...updatedFiles } },
      });
    }

    return { reply, updatedFiles: updatedFiles ?? null };
  }

  // ── Streaming (Server-Sent Events) ──────────────────────────────────────────

  @Post('stream')
  async chatStream(
    @Param('id') id: string,
    @Request() req: JwtRequest,
    @Body() body: { message: string; history?: ChatMessage[] },
    @Res() res: Response,
  ) {
    const { message, history = [] } = body;
    if (!message?.trim()) {
      res.status(400).json({ message: 'Message is required.' });
      return;
    }

    const { project, generatedFiles } = await this.loadProject(id, req.user.id);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering
    res.flushHeaders();

    const context = {
      name: project.name,
      description: project.description ?? undefined,
      generatedFiles,
    };

    try {
      const stream = this.chatService.chatStream(message, history, context);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);

        if (chunk.type === 'done') {
          if (chunk.updatedFiles && Object.keys(chunk.updatedFiles).length > 0) {
            await this.prisma.project.update({
              where: { id },
              data: { generatedFiles: { ...generatedFiles, ...chunk.updatedFiles } },
            });
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Stream error';
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    } finally {
      res.end();
    }
  }

  // ── Shared helpers ──────────────────────────────────────────────────────────

  private async loadProject(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found.');
    if (project.status !== 'COMPLETED') {
      throw new BadRequestException('Project must be completed to use AI chat.');
    }
    const generatedFiles = (project.generatedFiles as Record<string, string>) ?? {};
    return { project, generatedFiles };
  }
}
