import {
  ParsedSchema,
  ParsedEntity,
  ParsedField,
  ParsedRelation,
} from '../../parser/dto/parse-prompt.dto';

const FIELD_TYPE_MAP: Record<string, string> = {
  string: 'String',
  number: 'Float',
  boolean: 'Boolean',
  date: 'DateTime',
};

// ─── Field-line generation ────────────────────────────────────────────────────

function generateFieldLine(field: ParsedField): string {
  const prismaType = FIELD_TYPE_MAP[field.type] || 'String';
  const optional = field.required === false ? '?' : '';
  const unique = field.unique ? ' @unique' : '';

  // Special handling for known system field names
  if (field.name === 'id') {
    return `  id          String    @id @default(cuid())`;
  }
  if (field.name === 'createdAt') {
    return `  createdAt   DateTime  @default(now())`;
  }
  if (field.name === 'updatedAt') {
    return `  updatedAt   DateTime  @updatedAt`;
  }
  if (field.name === 'email') {
    return `  email       String    @unique`;
  }

  const paddedName = field.name.padEnd(12);
  return `  ${paddedName}${prismaType}${optional}${unique}`;
}

// ─── Relation helpers ─────────────────────────────────────────────────────────

/**
 * Returns all relation lines that should be injected into a given entity's model block.
 *
 * For a 1:N relation (from: A, to: B, fieldName: "items"):
 *   - A gets:  items  B[]
 *   - B gets:  aId    String
 *              a      A   @relation(fields: [aId], references: [id])
 *
 * For a M:N relation (from: A, to: B, fieldName: "tags"):
 *   - A gets:  tags   B[]
 *   - B gets:  (Prisma implicit join table — no fields needed on B side)
 *
 * For N:1 (from: A, to: B, fieldName: "author"):
 *   - A gets:  bId    String
 *              author B      @relation(fields: [bId], references: [id])
 *   - B side is handled by whoever owns the 1:N of this pair (or omitted if standalone)
 */
function buildRelationLines(entityName: string, relations: ParsedRelation[]): string[] {
  const lines: string[] = [];

  for (const rel of relations) {
    const { type, from, to, fieldName } = rel;

    if (type === '1:N' && from === entityName) {
      // The "one" side: expose an array of the related model
      const paddedField = fieldName.padEnd(12);
      lines.push(`  ${paddedField}${to}[]`);
    }

    if (type === '1:N' && to === entityName) {
      // The "many" side: add FK scalar + relation object field
      const fkFieldName = `${from.charAt(0).toLowerCase()}${from.slice(1)}Id`;
      const relationFieldName = `${from.charAt(0).toLowerCase()}${from.slice(1)}`;
      const paddedFk = fkFieldName.padEnd(12);
      const paddedRel = relationFieldName.padEnd(12);
      lines.push(`  ${paddedFk}String`);
      lines.push(`  ${paddedRel}${from}    @relation(fields: [${fkFieldName}], references: [id])`);
    }

    if (type === 'N:1' && from === entityName) {
      // The "belongs to" side: FK scalar + relation object
      const fkFieldName = `${to.charAt(0).toLowerCase()}${to.slice(1)}Id`;
      const paddedFk = fkFieldName.padEnd(12);
      const paddedRel = fieldName.padEnd(12);
      lines.push(`  ${paddedFk}String`);
      lines.push(`  ${paddedRel}${to}    @relation(fields: [${fkFieldName}], references: [id])`);
    }

    if (type === 'M:N' && from === entityName) {
      // Prisma implicit many-to-many: just declare the array field
      // Prisma automatically creates the join table
      const paddedField = fieldName.padEnd(12);
      lines.push(`  ${paddedField}${to}[]`);
    }

    if (type === 'M:N' && to === entityName) {
      // The reverse side of the implicit M:N also needs an array declaration
      // so Prisma can link the join table both ways
      const reverseFieldName = `${from.charAt(0).toLowerCase()}${from.slice(1)}s`;
      const paddedField = reverseFieldName.padEnd(12);
      lines.push(`  ${paddedField}${from}[]`);
    }
  }

  return lines;
}

// ─── Model block generation ───────────────────────────────────────────────────

function generateModelBlock(entity: ParsedEntity, relations: ParsedRelation[]): string {
  // Ensure mandatory system fields exist (prepend them if missing)
  const hasId = entity.fields.some((f) => f.name === 'id');
  const hasCreatedAt = entity.fields.some((f) => f.name === 'createdAt');
  const hasUpdatedAt = entity.fields.some((f) => f.name === 'updatedAt');

  const systemFields: string[] = [];
  if (!hasId) {
    systemFields.push(`  id          String    @id @default(cuid())`);
  }
  if (!hasCreatedAt) {
    systemFields.push(`  createdAt   DateTime  @default(now())`);
  }
  if (!hasUpdatedAt) {
    systemFields.push(`  updatedAt   DateTime  @updatedAt`);
  }

  const regularFieldLines = entity.fields.map(generateFieldLine);

  // Inject relation fields for this entity
  const relationLines = buildRelationLines(entity.name, relations);

  const allLines: string[] = [
    ...systemFields,
    ...(systemFields.length > 0 && regularFieldLines.length > 0 ? [''] : []),
    ...regularFieldLines,
    ...(relationLines.length > 0 ? [''] : []),
    ...relationLines,
  ];

  return `model ${entity.name} {
${allLines.join('\n')}
}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generatePrismaSchema(schema: ParsedSchema): string {
  const relations: ParsedRelation[] = schema.relations ?? [];

  // Build the model blocks for all defined entities
  const modelBlocks = schema.entities
    .map((entity) => generateModelBlock(entity, relations))
    .join('\n\n');

  // Add a default User model when auth is a feature and no User entity exists
  const hasUserEntity = schema.entities.some((e) => e.name.toLowerCase() === 'user');
  const hasAuth = schema.features.includes('auth');

  // Determine if user has any relations so we can inject them into the auto-generated model
  const userRelationLines = hasAuth && !hasUserEntity ? buildRelationLines('User', relations) : [];

  const userModel =
    hasAuth && !hasUserEntity
      ? `
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String
  name        String
  bio         String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
${userRelationLines.length > 0 ? '\n' + userRelationLines.join('\n') + '\n' : ''}}

`
      : '';

  return `// This file is auto-generated by PromptForge
// Do not edit manually — re-generate from your prompt instead
${schema.description ? `// ${schema.description}\n` : ''}
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
${userModel}
${modelBlocks}
`;
}
