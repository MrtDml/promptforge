/**
 * Generates Docker and environment-related files for a NestJS project.
 */

export function generateDockerfile(): string {
  return `# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source and build
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Stage 2: Production image ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma client generated code and schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
`;
}

export function generateDockerCompose(appName: string): string {
  const kebab = appName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return `version: '3.9'

services:
  app:
    build: .
    container_name: ${kebab}-app
    restart: unless-stopped
    ports:
      - '\${APP_PORT:-3000}:3000'
    environment:
      DATABASE_URL: postgresql://\${POSTGRES_USER:-postgres}:\${POSTGRES_PASSWORD:-postgres}@db:5432/\${POSTGRES_DB:-${kebab}}?schema=public
      JWT_SECRET: \${JWT_SECRET:-change-me-in-production}
      JWT_EXPIRES_IN: \${JWT_EXPIRES_IN:-7d}
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    container_name: ${kebab}-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: \${POSTGRES_DB:-${kebab}}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '\${POSTGRES_PORT:-5432}:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${POSTGRES_USER:-postgres}']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
`;
}

export function generateDockerEnv(): string {
  return `# ─── Application ────────────────────────────────────────────────────────────
APP_PORT=3000
NODE_ENV=development

# ─── Database ────────────────────────────────────────────────────────────────
# Full connection string used by Prisma
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp?schema=public"

# Individual vars used by docker-compose
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=myapp
POSTGRES_PORT=5432

# ─── Auth ────────────────────────────────────────────────────────────────────
# IMPORTANT: Change this to a long random string before deploying!
JWT_SECRET=change-me-to-a-long-random-secret-before-deploying
JWT_EXPIRES_IN=7d
`;
}
