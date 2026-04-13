import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AssistantService, AssistantMessage } from './assistant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../common/types/jwt-request.type';

@Controller('assistant')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 20, ttl: 3_600_000 } }) // 20 mesaj / saat
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(
    @Request() req: JwtRequest,
    @Body() body: { message: string; history?: AssistantMessage[] },
  ) {
    const { message, history = [] } = body;
    if (!message?.trim()) throw new BadRequestException('Mesaj boş olamaz.');
    if (message.length > 1000) throw new BadRequestException('Mesaj çok uzun (max 1000 karakter).');
    if (history.length > 20) throw new BadRequestException('Geçmiş çok uzun.');

    const reply = await this.assistantService.chat(message.trim(), history);
    return { reply };
  }
}
