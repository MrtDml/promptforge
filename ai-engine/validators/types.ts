// ─── Field Types ─────────────────────────────────────────────────────────────

export enum FieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
}

// ─── Feature Flags ───────────────────────────────────────────────────────────

export enum Feature {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Crud = 'crud',
  Api = 'api',
  Deploy = 'deploy',
  Payments = 'payments',
  Notifications = 'notifications',
}

// ─── Relation Types ───────────────────────────────────────────────────────────

export enum RelationType {
  OneToMany = '1:N',
  ManyToOne = 'N:1',
  ManyToMany = 'M:N',
}

// ─── Entity Field ─────────────────────────────────────────────────────────────

export interface EntityField {
  /** Column / property name, e.g. "firstName" */
  name: string;
  /** One of the supported primitive types */
  type: FieldType;
  /** Whether the field can be null / undefined */
  required?: boolean;
  /** Whether the field value must be unique across records */
  unique?: boolean;
}

// ─── Entity ──────────────────────────────────────────────────────────────────

export interface Entity {
  /** PascalCase entity name, e.g. "User", "BlogPost" */
  name: string;
  /** At least one field is required */
  fields: EntityField[];
}

// ─── Relation ─────────────────────────────────────────────────────────────────

export interface Relation {
  /** The cardinality of the relationship */
  type: RelationType | '1:N' | 'N:1' | 'M:N';
  /** The source entity name (PascalCase), e.g. "User" */
  from: string;
  /** The target entity name (PascalCase), e.g. "Post" */
  to: string;
  /**
   * The relation field name on the "from" side, e.g. "posts" on User.
   * For N:1 this would be the FK field name on the "from" entity, e.g. "userId" on Post.
   */
  fieldName: string;
}

// ─── Top-level App Schema ────────────────────────────────────────────────────

export interface AppSchema {
  /** Human-readable application name, e.g. "TaskManager" */
  app_name: string;
  /** Short description of what the application does */
  description?: string;
  /** Domain entities that will be persisted */
  entities: Entity[];
  /**
   * Explicit relationships between entities.
   * The AI infers these from the description; they are optional so schemas
   * that omit them remain valid.
   */
  relations?: Relation[];
  /** High-level features to scaffold */
  features: Feature[];
  /**
   * Which entity represents the authenticated user.
   * Defaults to "User" when auth is a feature and the entity exists.
   */
  auth_entity?: string;
}
