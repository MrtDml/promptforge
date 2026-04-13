import {
  Injectable,
  Logger,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ParsePromptDto, ParsedSchema, ParsedRelation } from './dto/parse-prompt.dto';

// ─── Tool definitions ─────────────────────────────────────────────────────────

const APP_SCHEMA_TOOL: Anthropic.Tool = {
  name: 'create_app_schema',
  description:
    'Converts a natural-language application description into a structured schema for code generation.',
  input_schema: {
    type: 'object' as const,
    properties: {
      app_name: {
        type: 'string',
        description: 'Concise PascalCase application name, e.g. "TaskManager"',
      },
      description: {
        type: 'string',
        description: 'Brief one-sentence description of the application',
      },
      entities: {
        type: 'array',
        description: 'Data models for the application',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'PascalCase entity name' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'camelCase field name' },
                  type: { type: 'string', enum: ['string', 'number', 'boolean', 'date'] },
                  required: { type: 'boolean' },
                  unique: { type: 'boolean' },
                },
                required: ['name', 'type'],
              },
            },
          },
          required: ['name', 'fields'],
        },
      },
      relations: {
        type: 'array',
        description:
          'Relationships between entities. Do NOT add foreign-key fields to entities — express them here instead.',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['1:N', 'N:1', 'M:N'] },
            from: { type: 'string', description: 'Source entity name (PascalCase)' },
            to: { type: 'string', description: 'Target entity name (PascalCase)' },
            fieldName: {
              type: 'string',
              description: 'camelCase relation field name on the "from" entity, e.g. "posts"',
            },
          },
          required: ['type', 'from', 'to', 'fieldName'],
        },
      },
      features: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['auth', 'dashboard', 'crud', 'api', 'deploy', 'payments', 'notifications'],
        },
        description:
          'Always include "crud" and "api". Include "auth" only when user authentication is described.',
      },
      auth_entity: {
        type: 'string',
        description:
          'PascalCase entity that represents the authenticated user. Only set when "auth" is in features.',
      },
    },
    required: ['app_name', 'entities', 'features'],
  },
};

const RELATIONS_TOOL: Anthropic.Tool = {
  name: 'extract_relations',
  description: 'Infers relationships between entities based on the application description.',
  input_schema: {
    type: 'object' as const,
    properties: {
      relations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['1:N', 'N:1', 'M:N'] },
            from: { type: 'string', description: 'Source entity name (PascalCase)' },
            to: { type: 'string', description: 'Target entity name (PascalCase)' },
            fieldName: { type: 'string', description: 'camelCase field name' },
          },
          required: ['type', 'from', 'to', 'fieldName'],
        },
      },
    },
    required: ['relations'],
  },
};

// ─── System prompts ───────────────────────────────────────────────────────────

const INTENT_PARSER_SYSTEM = `You are an application schema architect. Your job is to convert a natural-language description of a software application into a structured schema.

Rules:
- Every entity MUST include: id (string, required, unique), createdAt (date, required), updatedAt (date, required)
- Do NOT add foreign-key fields to entities — use the relations array instead
- Always include "crud" and "api" in features when entities are present
- Only include "auth" in features when user authentication is explicitly described
- Set auth_entity only when "auth" is a feature`;

const RELATION_EXTRACTION_SYSTEM = `You are a database architect. Given entity names and an app description, infer the relationships between those entities. If no meaningful relationships can be inferred, return an empty relations array.`;

// ─── Valid value sets (used in normalization) ─────────────────────────────────

const VALID_FEATURES = new Set([
  'auth',
  'dashboard',
  'crud',
  'api',
  'payments',
  'notifications',
  'deploy',
]);

const VALID_FIELD_TYPES = new Set(['string', 'number', 'boolean', 'date']);

const VALID_RELATION_TYPES = new Set(['1:N', 'N:1', 'M:N']);

const FIELD_TYPE_ALIASES: Record<string, string> = {
  text: 'string',
  varchar: 'string',
  char: 'string',
  str: 'string',
  int: 'number',
  integer: 'number',
  float: 'number',
  double: 'number',
  decimal: 'number',
  num: 'number',
  bool: 'boolean',
  bit: 'boolean',
  datetime: 'date',
  timestamp: 'date',
  time: 'date',
  Date: 'date',
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
};

const RELATION_TYPE_ALIASES: Record<string, string> = {
  'one-to-many': '1:N',
  onetomany: '1:N',
  hasMany: '1:N',
  has_many: '1:N',
  'many-to-one': 'N:1',
  manytoone: 'N:1',
  belongsTo: 'N:1',
  belongs_to: 'N:1',
  'many-to-many': 'M:N',
  manytomany: 'M:N',
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  private readonly anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // ── Public: parse a user prompt ─────────────────────────────────────────────

  async parsePrompt(parsePromptDto: ParsePromptDto): Promise<ParsedSchema> {
    const { prompt, maxRetries = 3 } = parsePromptDto;
    const maxAttempts = Math.min(maxRetries, 3);

    const overallStart = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.log(`[Parse] Attempt ${attempt}/${maxAttempts} — primary parse`);
        const attemptStart = Date.now();

        const schema = await this.runPrimaryParse(prompt, attempt);
        const primaryMs = Date.now() - attemptStart;
        this.logger.log(
          `[Parse] Primary parse succeeded in ${primaryMs}ms — ` +
            `app="${schema.app_name}", entities=${schema.entities.length}, ` +
            `relations=${schema.relations?.length ?? 0}, features=${schema.features.length}`,
        );

        const enrichedSchema = await this.maybeEnrichRelations(schema, prompt);

        const totalMs = Date.now() - overallStart;
        this.logger.log(
          `[Parse] Completed in ${totalMs}ms total — ` +
            `final relations=${enrichedSchema.relations?.length ?? 0}`,
        );

        return enrichedSchema;
      } catch (error: any) {
        lastError = error;

        if (error instanceof BadRequestException) {
          this.logger.warn(`[Parse] Attempt ${attempt} validation error: ${error.message}`);
          if (attempt === maxAttempts) {
            throw new BadRequestException(
              `Failed to parse prompt after ${maxAttempts} attempts. Last error: ${error.message}`,
            );
          }
          continue;
        }

        this.logger.error(`[Parse] Anthropic API error: ${error.message}`, error.stack);
        throw new ServiceUnavailableException(`AI service error: ${error.message}`);
      }
    }

    throw new ServiceUnavailableException(
      `Failed to parse prompt after ${maxAttempts} attempts: ${lastError?.message}`,
    );
  }

  // ── Primary parse — uses tool use for guaranteed structured output ───────────

  private async runPrimaryParse(prompt: string, attempt: number): Promise<ParsedSchema> {
    const userContent =
      attempt === 1
        ? prompt.trim()
        : `Previous attempt failed validation. Please try again more carefully.\n\n${prompt.trim()}`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: INTENT_PARSER_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ] as any,
      tools: [APP_SCHEMA_TOOL],
      tool_choice: { type: 'tool', name: 'create_app_schema' },
      messages: [{ role: 'user', content: userContent }],
    });

    const toolUseBlock = response.content.find((c) => c.type === 'tool_use');
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      throw new BadRequestException('AI did not return structured tool output');
    }

    return this.validateAndNormalizeSchema(toolUseBlock.input);
  }

  // ── Relation enrichment — runs only when primary parse found no relations ────

  private async maybeEnrichRelations(
    schema: ParsedSchema,
    originalPrompt: string,
  ): Promise<ParsedSchema> {
    const hasRelations = Array.isArray(schema.relations) && schema.relations.length > 0;
    if (schema.entities.length <= 1 || hasRelations) return schema;

    this.logger.log(
      `[Relations] No relations in primary parse — running enrichment for ${schema.entities.length} entities`,
    );

    const start = Date.now();

    try {
      const entityNames = schema.entities.map((e) => e.name);
      const userContent = `Application: ${schema.app_name}\nEntities: ${entityNames.join(', ')}\nDescription: ${originalPrompt}`;

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: RELATION_EXTRACTION_SYSTEM,
            cache_control: { type: 'ephemeral' },
          },
        ] as any,
        tools: [RELATIONS_TOOL],
        tool_choice: { type: 'tool', name: 'extract_relations' },
        messages: [{ role: 'user', content: userContent }],
      });

      const toolUseBlock = response.content.find((c) => c.type === 'tool_use');
      if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
        this.logger.warn('[Relations] No tool use block returned — skipping');
        return schema;
      }

      const input = toolUseBlock.input as { relations?: any[] };
      const knownNames = new Set(entityNames);
      const relations = this.normalizeRelations(input.relations ?? [], knownNames);

      const elapsedMs = Date.now() - start;
      this.logger.log(`[Relations] Extracted ${relations.length} relation(s) in ${elapsedMs}ms`);

      return { ...schema, relations };
    } catch (error: any) {
      this.logger.warn(`[Relations] Enrichment failed (non-fatal): ${error.message}`);
      return schema;
    }
  }

  // ── Schema normalization & validation ────────────────────────────────────────

  private validateAndNormalizeSchema(parsed: any): ParsedSchema {
    if (!parsed.app_name || typeof parsed.app_name !== 'string') {
      throw new BadRequestException('Schema missing required field: app_name');
    }

    if (!Array.isArray(parsed.entities) || parsed.entities.length === 0) {
      throw new BadRequestException('Schema must contain at least one entity');
    }

    const entityNames = new Set<string>();

    for (const entity of parsed.entities) {
      if (!entity.name || typeof entity.name !== 'string') {
        throw new BadRequestException('Each entity must have a name');
      }
      entityNames.add(entity.name);

      if (!Array.isArray(entity.fields) || entity.fields.length === 0) {
        throw new BadRequestException(`Entity "${entity.name}" must have at least one field`);
      }

      for (const field of entity.fields) {
        if (!field.name || typeof field.name !== 'string') {
          throw new BadRequestException(`Each field in entity "${entity.name}" must have a name`);
        }
        if (!VALID_FIELD_TYPES.has(field.type)) {
          field.type = this.normalizeFieldType(field.type);
        }
        field.required = field.required !== false;
        field.unique = field.unique === true;
      }
    }

    if (!Array.isArray(parsed.features)) {
      parsed.features = ['crud'];
    }
    parsed.features = parsed.features
      .map((f: string) => {
        const lower = typeof f === 'string' ? f.toLowerCase().trim() : f;
        return VALID_FEATURES.has(lower) ? lower : null;
      })
      .filter(Boolean);

    const relations = Array.isArray(parsed.relations)
      ? this.normalizeRelations(parsed.relations, entityNames)
      : undefined;

    const description =
      typeof parsed.description === 'string' ? parsed.description.trim() : undefined;
    const auth_entity =
      typeof parsed.auth_entity === 'string' ? parsed.auth_entity.trim() : undefined;

    const result: ParsedSchema = {
      app_name: parsed.app_name.trim(),
      entities: parsed.entities,
      features: parsed.features,
    };

    if (description) result.description = description;
    if (relations !== undefined) result.relations = relations;
    if (auth_entity) result.auth_entity = auth_entity;

    return result;
  }

  private normalizeRelations(raw: any[], knownEntityNames: Set<string>): ParsedRelation[] {
    return raw
      .filter((r: any) => {
        if (!r || typeof r !== 'object') return false;
        const type = this.normalizeRelationType(r.type);
        if (!type) {
          this.logger.warn(`[Validate] Dropping relation with unknown type: ${r.type}`);
          return false;
        }
        r.type = type;
        if (!knownEntityNames.has(r.from)) {
          this.logger.warn(`[Validate] Dropping relation — unknown "from": ${r.from}`);
          return false;
        }
        if (!knownEntityNames.has(r.to)) {
          this.logger.warn(`[Validate] Dropping relation — unknown "to": ${r.to}`);
          return false;
        }
        if (!r.fieldName || typeof r.fieldName !== 'string') {
          this.logger.warn('[Validate] Dropping relation — missing fieldName');
          return false;
        }
        return true;
      })
      .map((r: any) => ({
        type: r.type as '1:N' | 'N:1' | 'M:N',
        from: r.from.trim(),
        to: r.to.trim(),
        fieldName: r.fieldName.trim(),
      }));
  }

  // ── Type normalization ────────────────────────────────────────────────────────

  private normalizeFieldType(type: string): 'string' | 'number' | 'boolean' | 'date' {
    if (typeof type !== 'string') return 'string';
    return (FIELD_TYPE_ALIASES[type] ?? FIELD_TYPE_ALIASES[type.toLowerCase()] ?? 'string') as
      | 'string'
      | 'number'
      | 'boolean'
      | 'date';
  }

  private normalizeRelationType(type: unknown): string | null {
    if (typeof type !== 'string') return null;
    const trimmed = type.trim();
    if (VALID_RELATION_TYPES.has(trimmed)) return trimmed;
    return RELATION_TYPE_ALIASES[trimmed] ?? null;
  }
}
