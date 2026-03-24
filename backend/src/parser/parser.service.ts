import {
  Injectable,
  Logger,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ParsePromptDto, ParsedSchema, ParsedRelation } from './dto/parse-prompt.dto';

// ─── Prompt builders (inlined from ai-engine) ────────────────────────────────

function buildIntentParserPrompt(userPrompt: string): { system: string; user: string } {
  const system = `You are a strict JSON generator. Your only job is to convert a natural-language description of a software application into a valid JSON object.

Rules:
1. Output ONLY raw JSON. No markdown code fences, no explanations.
2. Root keys: "app_name", "description", "entities", "relations", "features", optionally "auth_entity".
3. "app_name": concise PascalCase string (e.g. "TaskManager").
4. "entities": array of objects with "name" (PascalCase) and "fields" (non-empty array).
5. Each field: "name" (camelCase), "type" (string|number|boolean|date), optional "required" and "unique".
6. Every entity must include: id (string, required, unique), createdAt (date), updatedAt (date).
7. Do NOT add foreign-key fields — use "relations" array instead.
8. "relations": array of { "type": "1:N"|"N:1"|"M:N", "from": EntityName, "to": EntityName, "fieldName": camelCase }.
9. "features": array from ["auth","dashboard","crud","api","deploy","payments","notifications"].
10. Always include "crud" and "api" when entities are present.
11. "auth_entity": PascalCase entity name representing authenticated user (only when "auth" is a feature).

Example output:
{
  "app_name": "TaskManager",
  "description": "A task management app with user authentication.",
  "entities": [
    { "name": "User", "fields": [{"name":"id","type":"string","required":true,"unique":true},{"name":"email","type":"string","required":true,"unique":true},{"name":"name","type":"string","required":true},{"name":"createdAt","type":"date","required":true},{"name":"updatedAt","type":"date","required":true}] },
    { "name": "Task", "fields": [{"name":"id","type":"string","required":true,"unique":true},{"name":"title","type":"string","required":true},{"name":"completed","type":"boolean","required":true},{"name":"createdAt","type":"date","required":true},{"name":"updatedAt","type":"date","required":true}] }
  ],
  "relations": [{ "type": "1:N", "from": "User", "to": "Task", "fieldName": "tasks" }],
  "features": ["auth","crud","api","dashboard"],
  "auth_entity": "User"
}

Respond with ONLY the JSON object.`;
  return { system, user: userPrompt.trim() };
}

function buildRelationExtractionPrompt(
  appName: string,
  entityNames: string[],
  originalPrompt: string,
): { system: string; user: string } {
  const system = `You are a database architect. Given entity names and an app description, infer relationships.
Output ONLY a raw JSON array. No markdown, no explanations.
Each item: { "type": "1:N"|"N:1"|"M:N", "from": EntityName, "to": EntityName, "fieldName": camelCase }
If no relationships can be inferred, return [].`;
  const user = `Application: ${appName}\nEntities: ${entityNames.join(', ')}\nDescription: ${originalPrompt}\n\nReturn the relationships as a JSON array.`;
  return { system, user };
}

// ─── Valid value sets ─────────────────────────────────────────────────────────

const VALID_FEATURES = new Set([
  'auth', 'dashboard', 'crud', 'api', 'payments', 'notifications', 'deploy',
]);

const VALID_FIELD_TYPES = new Set(['string', 'number', 'boolean', 'date']);

const VALID_RELATION_TYPES = new Set(['1:N', 'N:1', 'M:N']);

const FIELD_TYPE_ALIASES: Record<string, string> = {
  text: 'string', varchar: 'string', char: 'string', str: 'string',
  int: 'number', integer: 'number', float: 'number', double: 'number',
  decimal: 'number', num: 'number',
  bool: 'boolean', bit: 'boolean',
  datetime: 'date', timestamp: 'date', time: 'date',
  Date: 'date', String: 'string', Number: 'number', Boolean: 'boolean',
};

const RELATION_TYPE_ALIASES: Record<string, string> = {
  'one-to-many': '1:N', 'onetomany': '1:N', 'hasMany': '1:N', 'has_many': '1:N',
  'many-to-one': 'N:1', 'manytoone': 'N:1', 'belongsTo': 'N:1', 'belongs_to': 'N:1',
  'many-to-many': 'M:N', 'manytomany': 'M:N',
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
        this.logger.log(`[Parse] Attempt ${attempt}/${maxAttempts} — starting primary parse`);
        const attemptStart = Date.now();

        // ── Step 1: Primary parse ───────────────────────────────────────────
        const schema = await this.runPrimaryParse(prompt, attempt);
        const primaryMs = Date.now() - attemptStart;
        this.logger.log(
          `[Parse] Primary parse succeeded in ${primaryMs}ms — ` +
          `app="${schema.app_name}", entities=${schema.entities.length}, ` +
          `relations=${schema.relations?.length ?? 0}, features=${schema.features.length}`,
        );

        // ── Step 2: Relation extraction (if entities > 1 and no relations) ──
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
          this.logger.warn(
            `[Parse] Attempt ${attempt} failed with validation error: ${error.message}`,
          );
          if (attempt === maxAttempts) {
            throw new BadRequestException(
              `Failed to parse prompt after ${maxAttempts} attempts. Last error: ${error.message}`,
            );
          }
          continue;
        }

        // Non-retryable errors (API auth, network, etc.)
        this.logger.error(`[Parse] Anthropic API error: ${error.message}`, error.stack);
        throw new ServiceUnavailableException(
          `AI service error: ${error.message}`,
        );
      }
    }

    throw new ServiceUnavailableException(
      `Failed to parse prompt after ${maxAttempts} attempts: ${lastError?.message}`,
    );
  }

  // ── Primary parse call ──────────────────────────────────────────────────────

  private async runPrimaryParse(prompt: string, attempt: number): Promise<ParsedSchema> {
    const { system, user } = buildIntentParserPrompt(prompt);

    const userContent =
      attempt === 1
        ? user
        : `The previous response was not valid JSON. Please try again and return ONLY valid JSON.\n\n${user}\n\nRemember: respond with ONLY the JSON object, no markdown, no code fences, no explanations.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: userContent }],
      temperature: attempt === 1 ? 0.2 : 0.1,
    } as any);

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }

    return this.extractAndValidateJson(content.text.trim());
  }

  // ── Relation enrichment (second Claude call) ────────────────────────────────

  private async maybeEnrichRelations(
    schema: ParsedSchema,
    originalPrompt: string,
  ): Promise<ParsedSchema> {
    // Skip if there is only one entity or if relations were already detected
    const hasRelations = Array.isArray(schema.relations) && schema.relations.length > 0;
    if (schema.entities.length <= 1 || hasRelations) {
      return schema;
    }

    this.logger.log(
      `[Relations] No relations detected in primary parse — running relation extraction for ${schema.entities.length} entities`,
    );

    const start = Date.now();

    try {
      const entityNames = schema.entities.map((e) => e.name);
      const { system, user } = buildRelationExtractionPrompt(
        schema.app_name,
        entityNames,
        originalPrompt,
      );

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: user }],
        temperature: 0.1,
      } as any);

      const content = response.content[0];
      if (content.type !== 'text') {
        this.logger.warn('[Relations] Unexpected response type — skipping relation enrichment');
        return schema;
      }

      const relations = this.extractAndValidateRelations(
        content.text.trim(),
        new Set(entityNames),
      );

      const elapsedMs = Date.now() - start;
      this.logger.log(
        `[Relations] Extracted ${relations.length} relation(s) in ${elapsedMs}ms`,
      );

      return { ...schema, relations };
    } catch (error: any) {
      // Relation extraction is best-effort — never fail the whole parse
      this.logger.warn(
        `[Relations] Relation extraction failed (non-fatal): ${error.message}`,
      );
      return schema;
    }
  }

  // ── JSON extraction & schema validation ─────────────────────────────────────

  private extractAndValidateJson(rawText: string): ParsedSchema {
    let jsonText = rawText;

    // Strip markdown code fences if present
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    // Find the outermost JSON object in case of surrounding prose
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      throw new BadRequestException(
        `Invalid JSON in AI response: ${(e as Error).message}`,
      );
    }

    return this.validateAndNormalizeSchema(parsed);
  }

  private extractAndValidateRelations(
    rawText: string,
    knownEntityNames: Set<string>,
  ): ParsedRelation[] {
    let jsonText = rawText;

    // Strip markdown code fences
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    // Find a JSON array
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonText = arrayMatch[0];
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      this.logger.warn('[Relations] Could not parse relation JSON — returning empty array');
      return [];
    }

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((r: any) => {
        if (!r || typeof r !== 'object') return false;
        const type = this.normalizeRelationType(r.type);
        if (!type) return false;
        if (!knownEntityNames.has(r.from) || !knownEntityNames.has(r.to)) return false;
        if (!r.fieldName || typeof r.fieldName !== 'string') return false;
        return true;
      })
      .map((r: any) => ({
        type: this.normalizeRelationType(r.type) as '1:N' | 'N:1' | 'M:N',
        from: r.from.trim(),
        to: r.to.trim(),
        fieldName: r.fieldName.trim(),
      }));
  }

  // ── Schema normalization & validation ────────────────────────────────────────

  private validateAndNormalizeSchema(parsed: any): ParsedSchema {
    // ── app_name ──────────────────────────────────────────────────────────
    if (!parsed.app_name || typeof parsed.app_name !== 'string') {
      throw new BadRequestException('Schema missing required field: app_name');
    }

    // ── entities ──────────────────────────────────────────────────────────
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
        throw new BadRequestException(
          `Entity "${entity.name}" must have at least one field`,
        );
      }

      for (const field of entity.fields) {
        if (!field.name || typeof field.name !== 'string') {
          throw new BadRequestException(
            `Each field in entity "${entity.name}" must have a name`,
          );
        }
        if (!VALID_FIELD_TYPES.has(field.type)) {
          field.type = this.normalizeFieldType(field.type);
        }
        field.required = field.required !== false;
        field.unique = field.unique === true;
      }
    }

    // ── features ──────────────────────────────────────────────────────────
    if (!Array.isArray(parsed.features)) {
      parsed.features = ['crud'];
    }
    parsed.features = parsed.features
      .map((f: string) => {
        const lower = typeof f === 'string' ? f.toLowerCase().trim() : f;
        return VALID_FEATURES.has(lower) ? lower : null;
      })
      .filter(Boolean);

    // ── relations (optional) ──────────────────────────────────────────────
    if (Array.isArray(parsed.relations)) {
      parsed.relations = parsed.relations
        .filter((r: any) => {
          if (!r || typeof r !== 'object') return false;
          const type = this.normalizeRelationType(r.type);
          if (!type) {
            this.logger.warn(`[Validate] Dropping relation with unknown type: ${r.type}`);
            return false;
          }
          r.type = type;
          if (!entityNames.has(r.from)) {
            this.logger.warn(`[Validate] Dropping relation — unknown entity "from": ${r.from}`);
            return false;
          }
          if (!entityNames.has(r.to)) {
            this.logger.warn(`[Validate] Dropping relation — unknown entity "to": ${r.to}`);
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
    } else {
      parsed.relations = undefined;
    }

    // ── description / auth_entity (optional, passthrough) ─────────────────
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
    if (parsed.relations !== undefined) result.relations = parsed.relations;
    if (auth_entity) result.auth_entity = auth_entity;

    return result;
  }

  // ── Field / relation type normalization ──────────────────────────────────────

  private normalizeFieldType(type: string): 'string' | 'number' | 'boolean' | 'date' {
    if (typeof type !== 'string') return 'string';
    return (FIELD_TYPE_ALIASES[type] ?? FIELD_TYPE_ALIASES[type.toLowerCase()] ?? 'string') as
      'string' | 'number' | 'boolean' | 'date';
  }

  private normalizeRelationType(type: unknown): string | null {
    if (typeof type !== 'string') return null;
    const trimmed = type.trim();
    if (VALID_RELATION_TYPES.has(trimmed)) return trimmed;
    return RELATION_TYPE_ALIASES[trimmed] ?? null;
  }
}
