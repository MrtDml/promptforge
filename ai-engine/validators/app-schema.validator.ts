import { AppSchema, Entity, EntityField, Feature, FieldType, Relation, RelationType } from './types';

// ─── Validation Result ───────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: AppSchema;
}

// ─── Allowed value sets ──────────────────────────────────────────────────────

const VALID_FIELD_TYPES = new Set<string>(Object.values(FieldType));
const VALID_FEATURES = new Set<string>(Object.values(Feature));
const VALID_RELATION_TYPES = new Set<string>(['1:N', 'N:1', 'M:N']);

// ─── Type aliases the LLM sometimes emits ────────────────────────────────────

const FIELD_TYPE_ALIASES: Record<string, FieldType> = {
  // String variants
  str: FieldType.String,
  text: FieldType.String,
  varchar: FieldType.String,
  char: FieldType.String,
  // Number variants
  int: FieldType.Number,
  integer: FieldType.Number,
  float: FieldType.Number,
  double: FieldType.Number,
  decimal: FieldType.Number,
  num: FieldType.Number,
  // Boolean variants
  bool: FieldType.Boolean,
  bit: FieldType.Boolean,
  // Date variants
  datetime: FieldType.Date,
  timestamp: FieldType.Date,
  time: FieldType.Date,
};

// ─── Feature aliases ─────────────────────────────────────────────────────────

const FEATURE_ALIASES: Record<string, Feature> = {
  authentication: Feature.Auth,
  login: Feature.Auth,
  register: Feature.Auth,
  admin: Feature.Dashboard,
  rest: Feature.Api,
  restapi: Feature.Api,
  'rest-api': Feature.Api,
  deployment: Feature.Deploy,
  docker: Feature.Deploy,
  payment: Feature.Payments,
  stripe: Feature.Payments,
  billing: Feature.Payments,
  notification: Feature.Notifications,
  email: Feature.Notifications,
  alerts: Feature.Notifications,
};

// ─── Relation type aliases ────────────────────────────────────────────────────

const RELATION_TYPE_ALIASES: Record<string, string> = {
  'one-to-many': '1:N',
  'onetomany': '1:N',
  'hasMany': '1:N',
  'has_many': '1:N',
  'many-to-one': 'N:1',
  'manytoone': 'N:1',
  'belongsTo': 'N:1',
  'belongs_to': 'N:1',
  'many-to-many': 'M:N',
  'manytomany': 'M:N',
  'hasManyThrough': 'M:N',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeString(value: unknown): string | null {
  if (typeof value === 'string') return value.trim();
  return null;
}

function resolveFieldType(raw: string): FieldType | null {
  const lower = raw.toLowerCase().trim();
  if (VALID_FIELD_TYPES.has(lower)) return lower as FieldType;
  return FIELD_TYPE_ALIASES[lower] ?? null;
}

function resolveFeature(raw: string): Feature | null {
  const lower = raw.toLowerCase().trim();
  if (VALID_FEATURES.has(lower)) return lower as Feature;
  return FEATURE_ALIASES[lower] ?? null;
}

function resolveRelationType(raw: string): string | null {
  const trimmed = raw.trim();
  if (VALID_RELATION_TYPES.has(trimmed)) return trimmed;
  return RELATION_TYPE_ALIASES[trimmed] ?? null;
}

// ─── normalizeSchema ─────────────────────────────────────────────────────────
/**
 * Attempts to coerce common LLM output mistakes into a valid AppSchema shape:
 * - Lowercases field types and maps aliases
 * - Lowercases feature names and maps aliases
 * - Normalises relation types using known aliases
 * - Trims all string values
 * - Removes unknown features / field types instead of failing
 *
 * Returns the best-effort normalised object (may still fail validation).
 */
export function normalizeSchema(raw: unknown): unknown {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return raw;

  const obj = raw as Record<string, unknown>;
  const result: Record<string, unknown> = { ...obj };

  // app_name
  if (typeof result.app_name === 'string') {
    result.app_name = result.app_name.trim();
  }

  // description (optional)
  if (typeof result.description === 'string') {
    result.description = result.description.trim();
  }

  // auth_entity (optional)
  if (typeof result.auth_entity === 'string') {
    result.auth_entity = result.auth_entity.trim();
  }

  // entities
  if (Array.isArray(result.entities)) {
    result.entities = result.entities.map((entity: unknown) => {
      if (entity === null || typeof entity !== 'object' || Array.isArray(entity)) {
        return entity;
      }
      const e = entity as Record<string, unknown>;
      const normalizedEntity: Record<string, unknown> = { ...e };

      // Entity name — ensure PascalCase is preserved, just trim
      if (typeof normalizedEntity.name === 'string') {
        normalizedEntity.name = normalizedEntity.name.trim();
      }

      // Fields
      if (Array.isArray(normalizedEntity.fields)) {
        normalizedEntity.fields = normalizedEntity.fields
          .map((field: unknown) => {
            if (field === null || typeof field !== 'object' || Array.isArray(field)) {
              return field;
            }
            const f = field as Record<string, unknown>;
            const normalizedField: Record<string, unknown> = { ...f };

            if (typeof normalizedField.name === 'string') {
              normalizedField.name = normalizedField.name.trim();
            }

            if (typeof normalizedField.type === 'string') {
              const resolved = resolveFieldType(normalizedField.type);
              if (resolved) normalizedField.type = resolved;
              // If unresolvable, leave as-is so the validator can report it
            }

            return normalizedField;
          });
      }

      return normalizedEntity;
    });
  }

  // relations (optional)
  if (Array.isArray(result.relations)) {
    result.relations = result.relations.map((relation: unknown) => {
      if (relation === null || typeof relation !== 'object' || Array.isArray(relation)) {
        return relation;
      }
      const r = relation as Record<string, unknown>;
      const normalizedRelation: Record<string, unknown> = { ...r };

      if (typeof normalizedRelation.type === 'string') {
        const resolved = resolveRelationType(normalizedRelation.type);
        if (resolved) normalizedRelation.type = resolved;
      }

      if (typeof normalizedRelation.from === 'string') {
        normalizedRelation.from = normalizedRelation.from.trim();
      }
      if (typeof normalizedRelation.to === 'string') {
        normalizedRelation.to = normalizedRelation.to.trim();
      }
      if (typeof normalizedRelation.fieldName === 'string') {
        normalizedRelation.fieldName = normalizedRelation.fieldName.trim();
      }

      return normalizedRelation;
    });
  }

  // features
  if (Array.isArray(result.features)) {
    result.features = result.features
      .map((feat: unknown) => {
        if (typeof feat !== 'string') return feat;
        return resolveFeature(feat) ?? feat;
      });
  }

  return result;
}

// ─── validateAppSchema ───────────────────────────────────────────────────────
/**
 * Validates (and normalises) an unknown JSON value against the AppSchema shape.
 *
 * @param json - The raw parsed JSON value from the LLM response
 * @returns ValidationResult with `valid`, `errors`, and optionally `data`
 */
export function validateAppSchema(json: unknown): ValidationResult {
  const errors: string[] = [];

  // ── 1. Normalize first ───────────────────────────────────────────────────
  const normalized = normalizeSchema(json);

  // ── 2. Top-level type check ──────────────────────────────────────────────
  if (normalized === null || typeof normalized !== 'object' || Array.isArray(normalized)) {
    return {
      valid: false,
      errors: ['Root value must be a JSON object, got ' + (Array.isArray(normalized) ? 'array' : typeof normalized)],
    };
  }

  const obj = normalized as Record<string, unknown>;

  // ── 3. app_name ──────────────────────────────────────────────────────────
  const appName = normalizeString(obj.app_name);
  if (appName === null || appName.length === 0) {
    errors.push('"app_name" is required and must be a non-empty string');
  }

  // ── 4. description (optional) ────────────────────────────────────────────
  if ('description' in obj && obj.description !== undefined) {
    if (typeof obj.description !== 'string') {
      errors.push('"description" must be a string if present');
    }
  }

  // ── 5. entities ──────────────────────────────────────────────────────────
  const entityNames = new Set<string>();

  if (!Array.isArray(obj.entities)) {
    errors.push('"entities" is required and must be an array');
  } else if (obj.entities.length === 0) {
    errors.push('"entities" must contain at least one entity');
  } else {
    (obj.entities as unknown[]).forEach((entity: unknown, entityIdx: number) => {
      const prefix = `entities[${entityIdx}]`;

      if (entity === null || typeof entity !== 'object' || Array.isArray(entity)) {
        errors.push(`${prefix} must be an object`);
        return;
      }

      const e = entity as Record<string, unknown>;

      // entity.name
      const entityName = normalizeString(e.name);
      if (entityName === null || entityName.length === 0) {
        errors.push(`${prefix}.name is required and must be a non-empty string`);
      } else {
        entityNames.add(entityName);
      }

      // entity.fields
      if (!Array.isArray(e.fields)) {
        errors.push(`${prefix}.fields is required and must be an array`);
      } else if (e.fields.length === 0) {
        errors.push(`${prefix}.fields must contain at least one field`);
      } else {
        (e.fields as unknown[]).forEach((field: unknown, fieldIdx: number) => {
          const fPrefix = `${prefix}.fields[${fieldIdx}]`;

          if (field === null || typeof field !== 'object' || Array.isArray(field)) {
            errors.push(`${fPrefix} must be an object`);
            return;
          }

          const f = field as Record<string, unknown>;

          // field.name
          const fieldName = normalizeString(f.name);
          if (fieldName === null || fieldName.length === 0) {
            errors.push(`${fPrefix}.name is required and must be a non-empty string`);
          }

          // field.type
          const fieldType = normalizeString(f.type);
          if (fieldType === null || fieldType.length === 0) {
            errors.push(`${fPrefix}.type is required and must be a non-empty string`);
          } else if (!VALID_FIELD_TYPES.has(fieldType)) {
            errors.push(
              `${fPrefix}.type "${fieldType}" is not valid. ` +
              `Allowed values: ${[...VALID_FIELD_TYPES].join(', ')}`,
            );
          }

          // optional booleans
          if ('required' in f && typeof f.required !== 'boolean') {
            errors.push(`${fPrefix}.required must be a boolean if present`);
          }
          if ('unique' in f && typeof f.unique !== 'boolean') {
            errors.push(`${fPrefix}.unique must be a boolean if present`);
          }
        });
      }
    });
  }

  // ── 6. relations (optional) ──────────────────────────────────────────────
  if ('relations' in obj && obj.relations !== undefined) {
    if (!Array.isArray(obj.relations)) {
      errors.push('"relations" must be an array if present');
    } else {
      (obj.relations as unknown[]).forEach((relation: unknown, relIdx: number) => {
        const prefix = `relations[${relIdx}]`;

        if (relation === null || typeof relation !== 'object' || Array.isArray(relation)) {
          errors.push(`${prefix} must be an object`);
          return;
        }

        const r = relation as Record<string, unknown>;

        // relation.type
        const relType = normalizeString(r.type);
        if (relType === null || relType.length === 0) {
          errors.push(`${prefix}.type is required`);
        } else if (!VALID_RELATION_TYPES.has(relType)) {
          errors.push(
            `${prefix}.type "${relType}" is not valid. ` +
            `Allowed values: ${[...VALID_RELATION_TYPES].join(', ')}`,
          );
        }

        // relation.from
        const fromEntity = normalizeString(r.from);
        if (fromEntity === null || fromEntity.length === 0) {
          errors.push(`${prefix}.from is required and must be a non-empty string`);
        } else if (entityNames.size > 0 && !entityNames.has(fromEntity)) {
          errors.push(
            `${prefix}.from "${fromEntity}" does not match any entity name. ` +
            `Known entities: ${[...entityNames].join(', ')}`,
          );
        }

        // relation.to
        const toEntity = normalizeString(r.to);
        if (toEntity === null || toEntity.length === 0) {
          errors.push(`${prefix}.to is required and must be a non-empty string`);
        } else if (entityNames.size > 0 && !entityNames.has(toEntity)) {
          errors.push(
            `${prefix}.to "${toEntity}" does not match any entity name. ` +
            `Known entities: ${[...entityNames].join(', ')}`,
          );
        }

        // relation.fieldName
        const fieldName = normalizeString(r.fieldName);
        if (fieldName === null || fieldName.length === 0) {
          errors.push(`${prefix}.fieldName is required and must be a non-empty string`);
        }

        // Self-referential relations are allowed (e.g. Category -> Category)
        // but from and to must both be non-empty (checked above)
      });
    }
  }

  // ── 7. features ──────────────────────────────────────────────────────────
  if (!Array.isArray(obj.features)) {
    errors.push('"features" is required and must be an array');
  } else {
    (obj.features as unknown[]).forEach((feat: unknown, idx: number) => {
      if (typeof feat !== 'string') {
        errors.push(`features[${idx}] must be a string`);
      } else if (!VALID_FEATURES.has(feat)) {
        errors.push(
          `features[${idx}] "${feat}" is not valid. ` +
          `Allowed values: ${[...VALID_FEATURES].join(', ')}`,
        );
      }
    });
  }

  // ── 8. auth_entity (optional) ────────────────────────────────────────────
  if ('auth_entity' in obj && obj.auth_entity !== undefined) {
    const authEntity = normalizeString(obj.auth_entity);
    if (authEntity === null || authEntity.length === 0) {
      errors.push('"auth_entity" must be a non-empty string if present');
    } else if (entityNames.size > 0 && !entityNames.has(authEntity)) {
      errors.push(
        `"auth_entity" "${authEntity}" does not match any entity name. ` +
        `Known entities: ${[...entityNames].join(', ')}`,
      );
    }
  }

  // ── 9. Return result ─────────────────────────────────────────────────────
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Safe cast — all validations passed
  return {
    valid: true,
    errors: [],
    data: normalized as unknown as AppSchema,
  };
}
