# PromptForge

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **PromptForge** turns a plain-English description of your idea into a fully scaffolded, production-ready SaaS application — complete with a database schema, REST API, authentication, and a React dashboard.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
  - [Local Development](#local-development)
  - [Docker](#docker)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Description

PromptForge is an AI-powered code generation platform. You describe your application in natural language and the platform:

1. Parses your intent using Claude (Anthropic) into a structured JSON schema.
2. Designs the data model and feature set automatically.
3. Generates a working NestJS backend with Prisma ORM, full CRUD endpoints, and JWT authentication.
4. Generates a Next.js frontend with a dashboard and all the necessary pages.
5. Packages everything into a Docker image ready for deployment.

---

## Features

- **Natural language to app** — describe what you want in plain English
- **Structured intent parsing** — Claude converts your description to a validated JSON schema
- **Full-stack code generation** — NestJS API + Next.js frontend scaffolded in seconds
- **Prisma ORM** — type-safe database access with automatic migrations
- **JWT Authentication** — registration, login, and protected routes out of the box
- **Admin dashboard** — overview of generated apps and generation history
- **Docker-ready** — multi-stage Dockerfiles and a Compose file included
- **Retry mechanism** — automatic schema repair when the LLM output is invalid

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User (Browser)                       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────┐
│              Next.js Frontend  :3000                     │
│  (App Router · Tailwind CSS · Radix UI)                  │
└────────────────────────┬────────────────────────────────┘
                         │ REST / JSON
┌────────────────────────▼────────────────────────────────┐
│              NestJS Backend  :3001                       │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │  Auth Module │  │ Prompt Module │  │  Gen Module  │  │
│  │  (JWT/bcrypt)│  │ (Claude SDK)  │  │ (code writer)│  │
│  └──────────────┘  └──────┬────────┘  └──────────────┘  │
│                           │                              │
│  ┌────────────────────────▼──────────────────────────┐  │
│  │          ai-engine (shared library)               │  │
│  │   intent-parser prompt · retry prompt             │  │
│  │   app-schema validator · TypeScript types         │  │
│  └───────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌────────────────────────▼──────────────────────────┐  │
│  │          Prisma ORM  ↔  PostgreSQL :5432          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│           Anthropic Claude API (external)                │
└─────────────────────────────────────────────────────────┘
```

**Data flow for a new generation request:**

```
User Prompt
    │
    ▼
Intent Parser (Claude)
    │
    ▼ JSON
Schema Validator
    │  ✗ invalid → Retry Prompt (Claude) → Schema Validator
    │  ✓ valid
    ▼
System Designer
    │
    ▼
Code Generator   ──►  Generated NestJS + Next.js source
    │
    ▼
Docker Packager  ──►  Container image
```

---

## Project Structure

```
PromptForge/
├── backend/                   NestJS API server
│   ├── prisma/                Prisma schema & migrations
│   └── src/
│       ├── auth/              JWT auth module
│       ├── prompt/            Prompt parsing & generation logic
│       ├── generator/         Code generator module
│       └── health/            Health check endpoint
│
├── frontend/                  Next.js 14 (App Router)
│   └── src/
│       ├── app/               Route segments
│       ├── components/        Shared UI components
│       └── generated/         Generated app previews
│
├── ai-engine/                 Shared AI utilities (no runtime deps)
│   ├── prompts/
│   │   ├── intent-parser.prompt.ts
│   │   └── retry.prompt.ts
│   ├── schemas/
│   │   └── app.schema.json    JSON Schema (source of truth)
│   └── validators/
│       ├── types.ts           TypeScript types
│       └── app-schema.validator.ts
│
├── docker/
│   ├── docker-compose.yml
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── .env.example
│
├── scripts/
│   ├── setup.sh               First-time setup
│   ├── dev.sh                 Start local dev servers
│   └── docker-start.sh        Start via Docker Compose
│
├── .env.example               Root environment template
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 20.x |
| npm | 9.x |
| PostgreSQL | 15+ (or Docker) |
| Docker | 24+ (optional) |

### Local Development

**1. Clone and install**

```bash
git clone https://github.com/your-org/promptforge.git
cd promptforge
bash scripts/setup.sh
```

The setup script will:
- Verify prerequisites
- Copy `.env.example` to `.env`
- Run `npm ci` for both backend and frontend
- Run `prisma generate`

**2. Configure secrets**

Open `.env` and fill in:

```bash
POSTGRES_PASSWORD=your_strong_password
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**3. Start a PostgreSQL instance**

```bash
# Using Docker (easiest):
docker run -d \
  --name pf_postgres \
  -e POSTGRES_USER=promptforge \
  -e POSTGRES_PASSWORD=your_strong_password \
  -e POSTGRES_DB=promptforge_db \
  -p 5432:5432 \
  postgres:16-alpine
```

**4. Run database migrations**

```bash
cd backend
npx prisma migrate dev
```

**5. Start both servers**

```bash
bash scripts/dev.sh
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |

---

### Docker

**1. Configure Docker environment**

```bash
cp docker/.env.example docker/.env
# Edit docker/.env with your secrets
```

**2. Start all services**

```bash
bash scripts/docker-start.sh
```

Or with a forced rebuild:

```bash
bash scripts/docker-start.sh --build
```

To also start PgAdmin at http://localhost:5050:

```bash
bash scripts/docker-start.sh --with-pgadmin
```

**3. Stop all services**

```bash
docker compose --project-directory docker down
```

---

## Environment Variables

### Root `.env` (local development)

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_USER` | Yes | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `POSTGRES_DB` | Yes | PostgreSQL database name |
| `DATABASE_URL` | Yes | Full Prisma connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs (64+ chars) |
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Backend server port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL seen by the browser |

### `docker/.env` (Docker Compose)

Same variables as above, but `DATABASE_URL` should point to the `postgres` service name:

```
DATABASE_URL=postgresql://promptforge:password@postgres:5432/promptforge_db?schema=public
```

Additional optional Docker-only variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PGADMIN_DEFAULT_EMAIL` | `admin@promptforge.dev` | PgAdmin login email |
| `PGADMIN_DEFAULT_PASSWORD` | `pgadmin_secret` | PgAdmin login password |

---

## API Overview

All endpoints are prefixed with `/api/v1`. Authentication endpoints are public; all others require a valid Bearer token.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT |
| `GET` | `/auth/me` | Get current user profile |

### Prompt Generation

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/prompt/parse` | Parse a natural-language prompt into AppSchema JSON |
| `POST` | `/prompt/generate` | Generate a full application from an AppSchema |
| `GET` | `/prompt/history` | List past generation requests |
| `GET` | `/prompt/:id` | Get a specific generation result |

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service liveness check |

**Example — parse a prompt:**

```bash
curl -X POST http://localhost:3001/api/v1/prompt/parse \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a task manager with users and tasks"}'
```

**Response:**

```json
{
  "app_name": "TaskManager",
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "email", "type": "string", "required": true, "unique": true },
        { "name": "password", "type": "string", "required": true }
      ]
    },
    {
      "name": "Task",
      "fields": [
        { "name": "title", "type": "string", "required": true },
        { "name": "completed", "type": "boolean", "required": true },
        { "name": "userId", "type": "number", "required": true }
      ]
    }
  ],
  "features": ["auth", "crud", "api", "dashboard"]
}
```

---

## Roadmap

- [x] Project boilerplate — NestJS + Next.js + Prisma
- [x] JWT authentication
- [x] AI engine — intent parser prompts and schema validator
- [x] Docker multi-stage builds and Compose configuration
- [ ] Prompt parsing service (NestJS module with Claude SDK)
- [ ] Backend code generator (Prisma schema + NestJS CRUD modules)
- [ ] Frontend generator (Next.js pages + Tailwind components)
- [ ] Generation history dashboard
- [ ] One-click Docker deployment of generated apps
- [ ] Webhook notifications on generation complete
- [ ] Multi-user workspace support
- [ ] CLI tool (`npx promptforge generate "..."`)

---

## Contributing

Contributions are welcome. Please follow this workflow:

1. Fork the repository and create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and add tests where applicable.
3. Ensure the build passes: `cd backend && npm run build && npm test`
4. Commit using [Conventional Commits](https://www.conventionalcommits.org): `feat: add retry prompt builder`
5. Open a Pull Request with a clear description of what and why.

Please check open issues before starting work on a major feature to avoid duplicate effort.

---

## License

[MIT](LICENSE) — Copyright 2025 PromptForge Contributors
