import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  name: string;
  description?: string;
  generatedFiles: Record<string, string>;
}

export type StreamChunk =
  | { type: 'text'; delta: string }
  | { type: 'done'; updatedFiles: Record<string, string> | null };

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // ── Non-streaming (legacy) ──────────────────────────────────────────────────

  async chat(
    userMessage: string,
    history: ChatMessage[],
    context: ChatContext,
  ): Promise<{ reply: string; updatedFiles: Record<string, string> | null }> {
    const messages = this.buildMessages(history, userMessage);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: this.buildSystemBlocks(context),
        messages,
      });

      const fullReply = response.content[0]?.type === 'text' ? response.content[0].text : '';
      const { cleanReply, updatedFiles } = await this.extractFileChanges(
        fullReply,
        messages,
        context,
      );

      return { reply: cleanReply, updatedFiles };
    } catch (err: any) {
      this.logger.error('Chat AI error: ' + err.message, err.stack);
      throw new BadRequestException('AI service error: ' + (err.message ?? 'Unknown error'));
    }
  }

  // ── Streaming ───────────────────────────────────────────────────────────────

  async *chatStream(
    userMessage: string,
    history: ChatMessage[],
    context: ChatContext,
  ): AsyncGenerator<StreamChunk> {
    const messages = this.buildMessages(history, userMessage);

    try {
      const stream = await this.anthropic.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: this.buildSystemBlocks(context),
        messages,
      });

      let fullText = '';

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const delta = event.delta.text;
          fullText += delta;

          // Strip the file_changes block from what we stream to the user —
          // emit text up to the opening tag, then pause until the block closes.
          const tagStart = fullText.indexOf('<file_changes>');
          if (tagStart === -1) {
            // No tag seen yet — emit everything
            yield { type: 'text', delta };
          }
          // Once the opening tag is detected we stop yielding text deltas;
          // the full block is parsed after the stream ends.
        }
      }

      // Parse file changes from the accumulated response
      const { updatedFiles } = await this.extractFileChanges(fullText, messages, context);
      yield { type: 'done', updatedFiles };
    } catch (err: any) {
      this.logger.error('Chat stream error: ' + err.message, err.stack);
      yield { type: 'done', updatedFiles: null };
    }
  }

  // ── Shared helpers ──────────────────────────────────────────────────────────

  /**
   * Groups file paths into a directory tree summary.
   * Converts a flat list of 60-80 paths into a compact, structured overview
   * that saves tokens while still giving Claude enough context to reference any file.
   *
   * Example output:
   *   src/ (42 files)
   *     app.module.ts, main.ts
   *     auth/ — auth.module.ts, auth.controller.ts, auth.service.ts (+3)
   *     users/ — users.module.ts, users.controller.ts, users.service.ts
   *   prisma/ — schema.prisma, seed.ts
   *   docker-compose.yml, Dockerfile, .env.example, package.json
   */
  private buildFileTree(files: Record<string, string>): string {
    const paths = Object.keys(files).sort();

    // Group by top-level segment (e.g. "src", "prisma", root files)
    const groups = new Map<string, string[]>();
    for (const p of paths) {
      const slash = p.indexOf('/');
      const key = slash === -1 ? '' : p.slice(0, slash);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    }

    const lines: string[] = [];

    for (const [dir, dirPaths] of groups.entries()) {
      if (dir === '') {
        // Root-level files — list inline
        lines.push(dirPaths.join(', '));
        continue;
      }

      // Sub-group by second path segment
      const sub = new Map<string, string[]>();
      for (const p of dirPaths) {
        const rest = p.slice(dir.length + 1); // strip "src/"
        const slash2 = rest.indexOf('/');
        const key2 = slash2 === -1 ? '' : rest.slice(0, slash2);
        if (!sub.has(key2)) sub.set(key2, []);
        sub.get(key2)!.push(p);
      }

      lines.push(`${dir}/ (${dirPaths.length} files)`);

      for (const [sub2, sub2Paths] of sub.entries()) {
        const names = sub2Paths.map((p) => p.split('/').pop()!);
        const MAX = 5;
        const shown = names.slice(0, MAX).join(', ');
        const extra = names.length > MAX ? ` (+${names.length - MAX} more)` : '';
        if (sub2 === '') {
          lines.push(`  ${shown}${extra}`);
        } else {
          lines.push(`  ${sub2}/ — ${shown}${extra}`);
        }
      }
    }

    return lines.join('\n');
  }

  private buildSystemBlocks(context: ChatContext): any {
    const fileCount = Object.keys(context.generatedFiles).length;
    const fileTree = this.buildFileTree(context.generatedFiles);

    const systemText = `You are an expert software engineer assistant helping to modify a generated SaaS application called "${context.name}".

Project description: ${context.description ?? 'Not specified'}
Total files: ${fileCount}
Project structure:
${fileTree}

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

    // cache_control marks this large block as cacheable — reduces cost ~90% on repeated calls
    return [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }];
  }

  private buildMessages(history: ChatMessage[], userMessage: string): Anthropic.MessageParam[] {
    return [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];
  }

  /**
   * Extracts the <file_changes> block from the AI reply.
   * If JSON parsing fails, retries once with a targeted correction prompt.
   */
  private async extractFileChanges(
    fullReply: string,
    originalMessages: Anthropic.MessageParam[],
    context: ChatContext,
  ): Promise<{ cleanReply: string; updatedFiles: Record<string, string> | null }> {
    const fileChangesMatch = fullReply.match(/<file_changes>\s*([\s\S]*?)\s*<\/file_changes>/);

    const cleanReply = fullReply.replace(/<file_changes>[\s\S]*?<\/file_changes>/, '').trim();

    if (!fileChangesMatch) {
      return { cleanReply, updatedFiles: null };
    }

    try {
      const updatedFiles = JSON.parse(fileChangesMatch[1]);
      return { cleanReply, updatedFiles };
    } catch (firstErr) {
      this.logger.warn('file_changes JSON parse failed — retrying with correction prompt');

      try {
        const correctionMessages: Anthropic.MessageParam[] = [
          ...originalMessages,
          { role: 'assistant', content: fullReply },
          {
            role: 'user',
            content:
              'The <file_changes> block you returned contains invalid JSON. ' +
              'Please output ONLY the corrected JSON object (no markdown, no explanation, no <file_changes> tags):',
          },
        ];

        const retryResponse = await this.anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: this.buildSystemBlocks(context),
          messages: correctionMessages,
        });

        const retryText =
          retryResponse.content[0]?.type === 'text' ? retryResponse.content[0].text.trim() : '';

        // Strip any accidental code fences
        const jsonMatch = retryText.match(/\{[\s\S]*\}/);
        const updatedFiles = JSON.parse(jsonMatch ? jsonMatch[0] : retryText);
        this.logger.log('file_changes retry parse succeeded');
        return { cleanReply, updatedFiles };
      } catch (retryErr) {
        this.logger.error('file_changes retry parse also failed — returning null');
        return { cleanReply, updatedFiles: null };
      }
    }
  }
}
