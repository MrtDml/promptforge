import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { JwtRequest } from '../common/types/jwt-request.type';

class EnhancePromptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  prompt: string;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('enhance-prompt')
  async enhancePrompt(@Body() body: EnhancePromptDto) {
    if (!body.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }
    const enhanced = await this.aiService.enhancePrompt(body.prompt.trim());
    return { enhanced };
  }

  @Get('projects/:id/summary')
  async getProjectSummary(@Param('id') id: string, @Request() req: JwtRequest) {
    const summary = await this.aiService.getProjectSummary(id, req.user.id);
    return { summary };
  }

  @Get('projects/:id/suggest-tags')
  async suggestTags(@Param('id') id: string, @Request() req: JwtRequest) {
    const tags = await this.aiService.suggestTags(id, req.user.id);
    return { tags };
  }
}
