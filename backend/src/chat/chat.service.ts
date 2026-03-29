import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async chat(
    userMessage: string,
    history: ChatMessage[],
    projectContext: {
      name: string;
      description?: string;
      generatedFiles: Record<string, string>;
    },
  ): Promise<{ reply: string; updatedFiles: Record<string, string> | null }> {
    const fileList = Object.keys(projectContext.generatedFiles).join('\n');
    const fileCount = Object.keys(projectContext.generatedFiles).length;

    const systemPrompt = `You are an expert software engineer assistant helping to modify a generated SaaS application called "${projectContext.name}".

Project description: ${projectContext.description ?? 'Not specified'}
Total files: ${fileCount}
File paths:
${fileList}

When the user asks you to modify the project:
1. Understand what they want to change.
2. If the change requires modifying files, respond with a JSON block at the END of your reply in this exact format:
<file_changes>
{
  "path/to/file.ts": "full new file content here",
  "path/to/another.ts": "full new file content here"
}
</file_changes>
3. Only include files that actually need to change.
4. For explanations and answers that don't require code changes, just respond normally without a <file_changes> block.
5. Keep responses concise and focused.

IMPORTANT: When outputting file contents inside the JSON, escape all special characters properly so it is valid JSON.`;

    const messages: Anthropic.MessageParam[] = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      });

      const fullReply =
        response.content[0]?.type === 'text' ? response.content[0].text : '';

      // Extract file changes if present
      const fileChangesMatch = fullReply.match(
        /<file_changes>\s*([\s\S]*?)\s*<\/file_changes>/,
      );
      let updatedFiles: Record<string, string> | null = null;
      let cleanReply = fullReply;

      if (fileChangesMatch) {
        try {
          updatedFiles = JSON.parse(fileChangesMatch[1]);
          // Remove the file_changes block from the reply shown to user
          cleanReply = fullReply
            .replace(/<file_changes>[\s\S]*?<\/file_changes>/, '')
            .trim();
        } catch (e) {
          this.logger.warn('Failed to parse file_changes JSON: ' + e);
        }
      }

      return { reply: cleanReply, updatedFiles };
    } catch (err: any) {
      this.logger.error('Chat AI error: ' + err.message, err.stack);
      throw new BadRequestException('AI service error: ' + (err.message ?? 'Unknown error'));
    }
  }
}
