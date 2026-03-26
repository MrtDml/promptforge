// ─── Auth & User ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  planType?: string;
  generationsUsed?: number;
  generationsLimit?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// ─── Schema / Entity ──────────────────────────────────────────────────────────

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "url"
  | "text"
  | "uuid"
  | "enum"
  | "relation";

export interface EntityField {
  name: string;
  type: FieldType;
  required: boolean;
  unique?: boolean;
  default?: string | number | boolean | null;
  enumValues?: string[];
  relation?: {
    entity: string;
    type: "one-to-one" | "one-to-many" | "many-to-many";
  };
  description?: string;
}

export interface Entity {
  name: string;
  fields: EntityField[];
  description?: string;
  timestamps?: boolean;
  softDelete?: boolean;
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  requestBody?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

export interface AppSchema {
  appName: string;
  description: string;
  entities: Entity[];
  endpoints: ApiEndpoint[];
  features: string[];
  techStack: {
    backend: string;
    database: string;
    auth: string;
    frontend?: string;
  };
  rawPrompt?: string;
  _parsed?: Record<string, unknown>;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "pending"
  | "parsing"
  | "generating"
  | "completed"
  | "failed";

export type DeployStatus =
  | "not_deployed"
  | "deploying"
  | "deployed"
  | "failed";

export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}

export interface GeneratedOutput {
  files: GeneratedFile[];
  instructions?: string;
  dockerCompose?: string;
  readme?: string;
  envExample?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  schema?: AppSchema;
  generatedOutput?: GeneratedOutput;
  status: ProjectStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Deployment fields
  deployUrl?: string;
  deployStatus?: DeployStatus;
  railwayProjectId?: string;
  deployedAt?: string;
  lastDeployAt?: string;
}

export interface DeployResult {
  deployUrl: string;
  railwayProjectId: string;
  status: DeployStatus;
}

export interface DeployStatusResponse {
  status: DeployStatus;
  url?: string;
  railwayProjectId?: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── Parser / Generator requests ─────────────────────────────────────────────

export interface ParseRequest {
  prompt: string;
}

export interface ParseResponse {
  schema: AppSchema;
  confidence: number;
  suggestions?: string[];
}

export interface GenerateRequest {
  schema: AppSchema;
  projectId?: string;
  options?: {
    includeTests?: boolean;
    includeDocker?: boolean;
    includeCI?: boolean;
    includeSwagger?: boolean;
    includeFrontend?: boolean;
    includeIyzico?: boolean;
    includeEFatura?: boolean;
    includeKVKK?: boolean;
    framework?: "nestjs" | "express";
  };
}

export interface GenerateResponse {
  projectId: string;
  output: GeneratedOutput;
  status: ProjectStatus;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}
