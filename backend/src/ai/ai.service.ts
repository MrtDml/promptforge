import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  constructor(private readonly prisma: PrismaService) {}

  // ── Prompt Enhancement ──────────────────────────────────────────────────────

  async enhancePrompt(prompt: string): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are an expert SaaS architect helping a developer write a detailed prompt for an AI code generator that produces NestJS backends.

Expand the user's rough idea into a detailed, structured prompt that explicitly mentions:
- Entity names and their key fields
- User roles and access levels (admin, user, etc.)
- Core features (auth, CRUD, API endpoints)
- Relationships between entities (one-to-many, many-to-many)
- Any integrations (payments, email, notifications)

Rules:
- Keep the result under 280 words
- Write in the same language as the input
- Return ONLY the enhanced prompt — no explanation, no intro sentence
- Do not add markdown formatting`,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');
    return content.text.trim();
  }

  // ── Tag Suggestions ─────────────────────────────────────────────────────────

  async suggestTags(projectId: string, userId: string): Promise<string[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { name: true, description: true, prompt: true, features: true, parsedSchema: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    const schema = project.parsedSchema as any;
    const entityNames = schema?.entities?.map((e: any) => e.name).join(', ') ?? '';

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: `Return only a JSON array of 5-8 lowercase kebab-case tags relevant to a software project. No explanation, no markdown, just the JSON array.`,
      messages: [
        {
          role: 'user',
          content: `Project: ${project.name}\nDescription: ${project.description ?? project.prompt}\nFeatures: ${(project.features ?? []).join(', ')}\nEntities: ${entityNames}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') return [];

    try {
      const raw = content.text.trim().replace(/```json\n?|```/g, '');
      const tags: string[] = JSON.parse(raw);
      return tags
        .filter((t) => typeof t === 'string')
        .map((t) => t.toLowerCase().replace(/\s+/g, '-').slice(0, 30))
        .slice(0, 8);
    } catch {
      return [];
    }
  }

  // ── Project AI Summary ──────────────────────────────────────────────────────

  async getProjectSummary(projectId: string, userId: string): Promise<string> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const schema = project.parsedSchema as any;
    const files = (project.generatedFiles as any[]) ?? [];

    const entitySummary =
      schema?.entities
        ?.map((e: any) => {
          const fieldNames = e.fields?.map((f: any) => f.name).join(', ') ?? '';
          return `${e.name} (${fieldNames})`;
        })
        .join('; ') ?? 'N/A';

    const relations =
      schema?.relations
        ?.map((r: any) => `${r.from} → ${r.to} (${r.type})`)
        .join(', ') ?? 'none detected';

    const features = (project.features ?? []).join(', ') || 'none';
    const fileCount = files.length;

    const systemPrompt = `You are a senior software architect writing a clear, technical summary of a generated SaaS project.
Write for the developer who will be working with this codebase.
Use markdown with headers. Be specific and useful. Do not pad with filler phrases.`;

    const userMessage = `Summarize this generated project:

**Project name:** ${project.name}
**Description:** ${project.description ?? project.prompt}
**Original prompt:** ${project.prompt}
**Entities:** ${entitySummary}
**Relations:** ${relations}
**Features:** ${features}
**Files generated:** ${fileCount}

Write 3-4 paragraphs covering:
1. Purpose and target user of the app
2. Data architecture (entities, relations, key design decisions)
3. API overview (patterns, authentication, key endpoints)
4. Getting started (how to run, key environment variables to set)`;

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');
    return content.text.trim();
  }
}
