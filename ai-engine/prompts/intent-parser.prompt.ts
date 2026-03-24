/**
 * Builds the prompt pair sent to the LLM (Claude) to parse a natural-language
 * app description into a structured AppSchema JSON object.
 *
 * The system prompt enforces strict JSON output with no markdown fencing,
 * using few-shot examples to guide the model including relational data.
 */

export interface PromptPair {
  system: string;
  user: string;
}

// ─── Few-shot examples embedded in the system prompt ────────────────────────

const FEW_SHOT_EXAMPLES = `
### Example 1 — Task Manager (simple 1:N)

User input: "Build me a task management app with users and tasks. Tasks belong to users. I need login and a dashboard."

Expected output:
{
  "app_name": "TaskManager",
  "description": "A task management application where users can create and manage their tasks with authentication and a personal dashboard.",
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "email", "type": "string", "required": true, "unique": true },
        { "name": "password", "type": "string", "required": true },
        { "name": "name", "type": "string", "required": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Task",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "title", "type": "string", "required": true },
        { "name": "description", "type": "string", "required": false },
        { "name": "completed", "type": "boolean", "required": true },
        { "name": "dueDate", "type": "date", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    }
  ],
  "relations": [
    { "type": "1:N", "from": "User", "to": "Task", "fieldName": "tasks" }
  ],
  "features": ["auth", "dashboard", "crud", "api"],
  "auth_entity": "User"
}

---

### Example 2 — E-commerce (1:N + M:N)

User input: "E-commerce store where users place orders and orders contain multiple products. Products can appear in many orders. Needs REST API and payments."

Expected output:
{
  "app_name": "EcommerceStore",
  "description": "An e-commerce platform where users can browse products, place orders, and make payments. Orders support multiple products via a many-to-many relationship.",
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "email", "type": "string", "required": true, "unique": true },
        { "name": "password", "type": "string", "required": true },
        { "name": "name", "type": "string", "required": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Order",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "totalAmount", "type": "number", "required": true },
        { "name": "status", "type": "string", "required": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Product",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "name", "type": "string", "required": true },
        { "name": "price", "type": "number", "required": true },
        { "name": "stock", "type": "number", "required": true },
        { "name": "description", "type": "string", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    }
  ],
  "relations": [
    { "type": "1:N", "from": "User", "to": "Order", "fieldName": "orders" },
    { "type": "M:N", "from": "Order", "to": "Product", "fieldName": "products" }
  ],
  "features": ["auth", "crud", "api", "payments"],
  "auth_entity": "User"
}

---

### Example 3 — Blog Platform (1:N + M:N)

User input: "Blog platform where authors write posts and posts can be tagged with multiple tags. Tags can be shared across posts. Readers can leave comments on posts."

Expected output:
{
  "app_name": "BlogPlatform",
  "description": "A blogging platform where authors publish posts, posts are categorised with reusable tags, and readers can comment on posts.",
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "email", "type": "string", "required": true, "unique": true },
        { "name": "password", "type": "string", "required": true },
        { "name": "username", "type": "string", "required": true, "unique": true },
        { "name": "bio", "type": "string", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Post",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "title", "type": "string", "required": true },
        { "name": "content", "type": "string", "required": true },
        { "name": "published", "type": "boolean", "required": true },
        { "name": "publishedAt", "type": "date", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Tag",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "name", "type": "string", "required": true, "unique": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Comment",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "body", "type": "string", "required": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    }
  ],
  "relations": [
    { "type": "1:N", "from": "User", "to": "Post", "fieldName": "posts" },
    { "type": "M:N", "from": "Post", "to": "Tag", "fieldName": "tags" },
    { "type": "1:N", "from": "User", "to": "Comment", "fieldName": "comments" },
    { "type": "1:N", "from": "Post", "to": "Comment", "fieldName": "comments" }
  ],
  "features": ["auth", "crud", "api"],
  "auth_entity": "User"
}

---

### Example 4 — Project Management (M:N + 1:N)

User input: "Project management tool where users can belong to many projects and projects have many tasks. Tasks are assigned to specific users."

Expected output:
{
  "app_name": "ProjectManager",
  "description": "A project management platform where users collaborate across multiple projects, and each project contains tasks that can be assigned to team members.",
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "email", "type": "string", "required": true, "unique": true },
        { "name": "password", "type": "string", "required": true },
        { "name": "name", "type": "string", "required": true },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Project",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "name", "type": "string", "required": true },
        { "name": "description", "type": "string", "required": false },
        { "name": "status", "type": "string", "required": true },
        { "name": "deadline", "type": "date", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    },
    {
      "name": "Task",
      "fields": [
        { "name": "id", "type": "string", "required": true, "unique": true },
        { "name": "title", "type": "string", "required": true },
        { "name": "description", "type": "string", "required": false },
        { "name": "status", "type": "string", "required": true },
        { "name": "priority", "type": "string", "required": false },
        { "name": "dueDate", "type": "date", "required": false },
        { "name": "createdAt", "type": "date", "required": true },
        { "name": "updatedAt", "type": "date", "required": true }
      ]
    }
  ],
  "relations": [
    { "type": "M:N", "from": "User", "to": "Project", "fieldName": "projects" },
    { "type": "1:N", "from": "Project", "to": "Task", "fieldName": "tasks" },
    { "type": "N:1", "from": "Task", "to": "User", "fieldName": "assignee" }
  ],
  "features": ["auth", "dashboard", "crud", "api"],
  "auth_entity": "User"
}
`.trim();

// ─── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are a strict JSON generator. Your only job is to convert a natural-language
description of a software application into a valid JSON object that conforms
exactly to the AppGenerationSchema below.

## Rules — follow these without exception

1. Output ONLY raw JSON. Do NOT wrap your response in markdown code fences (\`\`\`json … \`\`\`). Do NOT add explanations, comments, or any text before or after the JSON object.
2. The JSON root must be an object with the keys: "app_name", "description", "entities", "relations", "features", and optionally "auth_entity".
3. "app_name": a concise PascalCase string derived from the user description (e.g. "TaskManager", "EcommerceStore").
4. "description": a 1–2 sentence plain-English summary of what the application does. Always include this.
5. "entities": an array of objects. Each entity must have "name" (PascalCase string) and "fields" (non-empty array).
6. Each field must have "name" (camelCase string) and "type". The only valid types are: "string", "number", "boolean", "date".
7. Every entity MUST include the following system fields:
   - { "name": "id", "type": "string", "required": true, "unique": true }
   - { "name": "createdAt", "type": "date", "required": true }
   - { "name": "updatedAt", "type": "date", "required": true }
8. You may include optional boolean properties "required" and "unique" on each field. Default assumption: required = true unless the description implies optional.
9. Do NOT add foreign-key fields (e.g. "userId") to entity fields — use the "relations" array instead to express ownership.
10. "relations": an array of relationship objects. Each must have:
    - "type": one of "1:N" (one-to-many), "N:1" (many-to-one), "M:N" (many-to-many)
    - "from": the source entity name (PascalCase)
    - "to": the target entity name (PascalCase)
    - "fieldName": the name of the relation field on the "from" entity (camelCase, usually plural for 1:N/M:N, singular for N:1)
11. Relation inference rules:
    - "X has many Y" / "X owns Y" / "Y belongs to X" → 1:N from X to Y, fieldName is plural of Y (lowercase)
    - "X belongs to Y" / "X is assigned to Y" → N:1 from X to Y, fieldName is singular of Y (lowercase)
    - "X and Y are many-to-many" / "X can have many Y and Y can appear in many X" → M:N from X to Y, fieldName is plural of Y (lowercase)
    - When users, authors, or members are mentioned in relation to content they own or create → always create a 1:N from User to that entity
12. "features": an array containing only values from this set: "auth", "dashboard", "crud", "api", "deploy", "payments", "notifications". Infer which features apply from the description. Always include "crud" and "api" when entities are present.
13. "auth_entity": the PascalCase name of the entity that represents an authenticated user. Include this field only when "auth" is a feature. Default to "User".
14. If information is ambiguous, make a reasonable default choice. Never ask a clarifying question.
15. Never output null, undefined, or placeholder strings like "TODO".

## JSON Schema reference

{
  "app_name": "string (PascalCase)",
  "description": "string (1-2 sentences)",
  "entities": [
    {
      "name": "string (PascalCase)",
      "fields": [
        {
          "name": "string (camelCase)",
          "type": "string | number | boolean | date",
          "required": "boolean (optional, default true)",
          "unique": "boolean (optional, default false)"
        }
      ]
    }
  ],
  "relations": [
    {
      "type": "1:N | N:1 | M:N",
      "from": "string (PascalCase entity name)",
      "to": "string (PascalCase entity name)",
      "fieldName": "string (camelCase, the relation field on the 'from' entity)"
    }
  ],
  "features": ["auth", "dashboard", "crud", "api", "deploy", "payments", "notifications"],
  "auth_entity": "string (PascalCase, optional)"
}

## Few-shot examples

${FEW_SHOT_EXAMPLES}

Remember: respond with ONLY the JSON object. Nothing else.
`.trim();

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Builds the system + user prompt pair for the intent-parsing step.
 *
 * @param userPrompt - The raw natural-language description provided by the user
 * @returns A { system, user } pair ready to be sent to the Anthropic Messages API
 */
export function buildIntentParserPrompt(userPrompt: string): PromptPair {
  return {
    system: SYSTEM_PROMPT,
    user: userPrompt.trim(),
  };
}

/**
 * Builds the prompt pair for a second-pass relation-extraction call.
 * This is used when the initial parse returns no relations but the schema
 * has multiple entities that likely have implicit relationships.
 *
 * @param appName - The parsed application name
 * @param entityNames - The list of entity names from the initial parse
 * @param originalPrompt - The original user description
 * @returns A { system, user } pair for the relation-extraction step
 */
export function buildRelationExtractionPrompt(
  appName: string,
  entityNames: string[],
  originalPrompt: string,
): PromptPair {
  const system = `
You are a database architect. Given an application name, a list of entity names,
and the original application description, you must infer the relationships between entities.

Output ONLY raw JSON — an array of relation objects. No markdown, no explanations.

Each relation object must have:
- "type": "1:N" | "N:1" | "M:N"
- "from": source entity name (must be one of the provided entity names, PascalCase)
- "to": target entity name (must be one of the provided entity names, PascalCase)
- "fieldName": camelCase name of the relation field on the "from" entity

Rules:
- Only use entity names from the provided list.
- Use "1:N" when the "from" entity owns or contains multiple "to" entities.
- Use "N:1" when the "from" entity belongs to exactly one "to" entity.
- Use "M:N" when both sides can have many of the other.
- Do NOT create both 1:N and N:1 for the same pair — pick the primary perspective.
- fieldName for 1:N and M:N should be the plural lowercase of the "to" entity name.
- fieldName for N:1 should be the singular lowercase of the "to" entity name.
- If no relationships can be inferred, return an empty array: []

Output format: JSON array only, e.g.:
[
  { "type": "1:N", "from": "User", "to": "Post", "fieldName": "posts" },
  { "type": "M:N", "from": "Post", "to": "Tag", "fieldName": "tags" }
]
`.trim();

  const user = `Application: ${appName}
Entities: ${entityNames.join(', ')}
Description: ${originalPrompt}

Infer and return the relationships between these entities as a JSON array.`;

  return { system, user };
}
