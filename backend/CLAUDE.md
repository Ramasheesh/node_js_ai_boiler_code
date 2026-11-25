# Backend Boilerplate — Claude Code Instructions

> **See also**: @AGENTS.md for shared repository conventions used by all AI agents.

## Project Overview

Production-ready Node.js backend boilerplate featuring Express, TypeScript (strict mode), PostgreSQL/Prisma, JWT authentication with refresh token rotation, optional Redis caching, Pino structured logging, and a complete Claude Code AI development environment.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 22 LTS |
| Language | TypeScript | 5.x (strict) |
| Framework | Express | 4.x |
| Database ORM | Prisma | 5.x |
| Database | PostgreSQL | 16 |
| Auth | JWT + Argon2 | — |
| Cache | Redis (optional) | 7 |
| Logging | Pino | 9.x |
| Validation | Zod | 3.x |
| Testing | Vitest + Supertest | 2.x |

## Architecture

**Request lifecycle**: Routes → Middleware → Controller → Service → Repository → Database

```
src/
├── config/      # env.ts, logger.ts, cors.ts, redis.ts, swagger.ts, database.ts
├── modules/     # Feature modules (auth/, users/)
│   └── <name>/ # .routes.ts, .controller.ts, .service.ts, .repository.ts, .validation.ts, .types.ts
├── middleware/  # authenticate, authorize, validate, error-handler, rate-limiter, request-id, not-found
├── shared/      # errors/, responses/, types/, constants/, utils/
├── database/    # prisma.ts (client), health-check.ts
└── routes/      # index.ts — route aggregator + health endpoints
```

## Commands

```bash
npm run dev              # Start dev server (tsx watch)
npm run build            # Compile TypeScript → dist/
npm start                # Run compiled production server
npm run typecheck        # Type check without emitting
npm run lint             # ESLint
npm run format           # Prettier format
npm run format:check     # Prettier check (CI)
npm test                 # Run all tests
npm run test:coverage    # Tests with coverage report
npm run db:generate      # Regenerate Prisma client after schema change
npm run db:migrate       # Create + apply migration (dev)
npm run db:deploy        # Apply migrations (production — no prompt)
npm run db:seed          # Seed database with example data
```

## API Conventions

- **Base URL**: `/api/v1/`
- **Success**: `{ success: true, message, data, requestId, timestamp }`
- **Error**: `{ success: false, message, code, details?, requestId, timestamp }`
- **Paginated**: adds `pagination: { page, limit, total, totalPages, hasNext, hasPrev }`

## Security Rules (non-negotiable)

- Never log passwords, tokens, or secrets — Pino redact config is active
- Never expose stack traces in production API responses
- All user input validated with Zod before reaching controllers
- SQL injection prevented via Prisma parameterized queries
- Rate limiting always active — never disable in production

## Database Rules

- All DB operations via Prisma only — import `prisma` from `src/database/prisma.ts`
- Always use `select` to avoid over-fetching
- Schema changes via `prisma migrate dev` (dev) or `prisma migrate deploy` (prod)
- Never run `migrate dev` in production

## Testing Requirements

- Unit tests: validation schemas, error classes, utility functions
- Integration tests: all API endpoints via Supertest
- Run `npm test` before every commit
- Coverage targets: 70%+ lines/functions

## AI Development Environment

This project includes a complete Claude Code setup:
- **Rules** in `.claude/rules/` — load automatically for matching file patterns
- **Skills** in `.claude/skills/` — load with `/skill <name>` for specialized workflows
- **Agents** in `.claude/agents/` — specialized subagents for different roles
- **Hooks** in `.claude/hooks/` — run automatically on file writes (format check, secret scan)
- **MCP** in `.mcp.json` — optional GitHub, PostgreSQL, filesystem integrations

## Important Files

| File | Purpose |
|------|---------|
| `src/config/env.ts` | All env vars — validated at startup |
| `src/shared/errors/AppError.ts` | Error class hierarchy |
| `src/shared/responses/ApiResponse.ts` | Response format helpers |
| `src/middleware/error-handler.ts` | Global error formatter |
| `prisma/schema.prisma` | Database schema |
| `.env.example` | Environment variable template |
