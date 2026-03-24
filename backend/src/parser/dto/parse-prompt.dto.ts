import { IsString, MinLength, MaxLength, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class ParsePromptDto {
  @IsString()
  @MinLength(10, { message: 'Prompt must be at least 10 characters long' })
  @MaxLength(4000, { message: 'Prompt must not exceed 4000 characters' })
  prompt: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  maxRetries?: number;
}

export interface ParsedField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
  unique?: boolean;
}

export interface ParsedEntity {
  name: string;
  fields: ParsedField[];
}

export interface ParsedRelation {
  /** Cardinality: one-to-many, many-to-one, or many-to-many */
  type: '1:N' | 'N:1' | 'M:N';
  /** Source entity name (PascalCase) */
  from: string;
  /** Target entity name (PascalCase) */
  to: string;
  /**
   * The relation field name on the "from" entity.
   * e.g. for User 1:N Post this would be "posts".
   */
  fieldName: string;
}

export type AppFeature =
  | 'auth'
  | 'dashboard'
  | 'crud'
  | 'api'
  | 'payments'
  | 'notifications'
  | 'deploy';

export interface ParsedSchema {
  app_name: string;
  description?: string;
  entities: ParsedEntity[];
  relations?: ParsedRelation[];
  features: AppFeature[];
  auth_entity?: string;
}
