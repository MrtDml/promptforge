/**
 * Postman Collection v2.1 generator
 * Generates a ready-to-import Postman collection from the parsed schema.
 */

import { ParsedEntity } from '../../parser/dto/parse-prompt.dto';

function toPascalCase(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function toKebabCase(s: string) { return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }

function makeId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function exampleBody(entity: ParsedEntity): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (['id', 'createdAt', 'updatedAt'].includes(field.name)) continue;
    if (field.type === 'number') body[field.name] = 42;
    else if (field.type === 'boolean') body[field.name] = true;
    else if (field.type === 'date') body[field.name] = new Date().toISOString();
    else body[field.name] = `example_${field.name}`;
  }
  return body;
}

export function generatePostmanCollection(
  appName: string,
  entities: ParsedEntity[],
  hasAuth: boolean,
  baseUrl = '{{BASE_URL}}',
): string {
  const items: any[] = [];

  // ── Auth folder ────────────────────────────────────────────────────────────
  if (hasAuth) {
    const userEntity = entities.find((e) => e.name.toLowerCase() === 'user') ?? entities[0];
    const registerBody = exampleBody(userEntity ?? { name: 'User', fields: [] });
    registerBody['password'] = 'Password123!';

    items.push({
      name: 'Authentication',
      item: [
        {
          name: 'Register',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'if (pm.response.code === 201 || pm.response.code === 200) {',
                  '  const json = pm.response.json();',
                  '  const token = json.data?.access_token ?? json.access_token;',
                  '  if (token) pm.collectionVariables.set("TOKEN", token);',
                  '}',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(registerBody, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: { raw: `${baseUrl}/auth/register`, host: [baseUrl], path: ['auth', 'register'] },
          },
        },
        {
          name: 'Login',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'if (pm.response.code === 200 || pm.response.code === 201) {',
                  '  const json = pm.response.json();',
                  '  const token = json.data?.access_token ?? json.access_token;',
                  '  if (token) pm.collectionVariables.set("TOKEN", token);',
                  '}',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ email: 'user@example.com', password: 'Password123!' }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: { raw: `${baseUrl}/auth/login`, host: [baseUrl], path: ['auth', 'login'] },
          },
        },
        {
          name: 'Get Current User',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{TOKEN}}' }],
            url: { raw: `${baseUrl}/auth/me`, host: [baseUrl], path: ['auth', 'me'] },
          },
        },
      ],
    });
  }

  // ── Entity CRUD folders ────────────────────────────────────────────────────
  for (const entity of entities) {
    const pascal = toPascalCase(entity.name);
    const route = toKebabCase(pascal) + 's';
    const body = exampleBody(entity);

    const authHeader = hasAuth
      ? [{ key: 'Authorization', value: 'Bearer {{TOKEN}}' }]
      : [];
    const jsonHeader = [{ key: 'Content-Type', value: 'application/json' }];

    items.push({
      name: pascal,
      item: [
        {
          name: `Create ${pascal}`,
          request: {
            method: 'POST',
            header: [...authHeader, ...jsonHeader],
            body: {
              mode: 'raw',
              raw: JSON.stringify(body, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: { raw: `${baseUrl}/${route}`, host: [baseUrl], path: [route] },
          },
        },
        {
          name: `List ${pascal}s`,
          request: {
            method: 'GET',
            header: authHeader,
            url: {
              raw: `${baseUrl}/${route}?page=1&limit=20`,
              host: [baseUrl],
              path: [route],
              query: [
                { key: 'page', value: '1' },
                { key: 'limit', value: '20' },
              ],
            },
          },
        },
        {
          name: `Get ${pascal} by ID`,
          request: {
            method: 'GET',
            header: authHeader,
            url: {
              raw: `${baseUrl}/${route}/{{${pascal.toLowerCase()}_id}}`,
              host: [baseUrl],
              path: [route, `{{${pascal.toLowerCase()}_id}}`],
            },
          },
        },
        {
          name: `Update ${pascal}`,
          request: {
            method: 'PATCH',
            header: [...authHeader, ...jsonHeader],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                Object.fromEntries(Object.entries(body).slice(0, 2)),
                null,
                2,
              ),
              options: { raw: { language: 'json' } },
            },
            url: {
              raw: `${baseUrl}/${route}/{{${pascal.toLowerCase()}_id}}`,
              host: [baseUrl],
              path: [route, `{{${pascal.toLowerCase()}_id}}`],
            },
          },
        },
        {
          name: `Delete ${pascal}`,
          request: {
            method: 'DELETE',
            header: authHeader,
            url: {
              raw: `${baseUrl}/${route}/{{${pascal.toLowerCase()}_id}}`,
              host: [baseUrl],
              path: [route, `{{${pascal.toLowerCase()}_id}}`],
            },
          },
        },
      ],
    });
  }

  const collection = {
    info: {
      _postman_id: makeId(),
      name: `${appName} API`,
      description: `Auto-generated Postman collection for ${appName}.\n\nGenerated by [PromptForge](https://promptforgeai.dev).\n\n**Setup:**\n1. Set the \`BASE_URL\` variable to your API URL (e.g. \`http://localhost:3000\`)\n2. Run the Login request — the TOKEN variable is set automatically\n3. All other requests use Bearer token auth automatically`,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: items,
    variable: [
      {
        key: 'BASE_URL',
        value: 'http://localhost:3000',
        type: 'string',
      },
      {
        key: 'TOKEN',
        value: '',
        type: 'string',
      },
      ...entities.map((e) => ({
        key: `${e.name.toLowerCase()}_id`,
        value: 'replace-with-actual-id',
        type: 'string',
      })),
    ],
  };

  return JSON.stringify(collection, null, 2);
}
