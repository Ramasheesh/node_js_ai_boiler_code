---
description: Express.js backend architecture rules — enforces layered architecture
globs: ["src/**/*.ts"]
---

# Backend Architecture Rules

## Request Lifecycle (strict)
Routes → Middleware → Controller → Service → Repository → Database

## Layer Responsibilities

### Controllers (`*.controller.ts`)
- Handle HTTP req/res ONLY
- Call exactly one service method per handler
- Wrap in `try/catch` and pass errors to `next(err)`
- Use response helpers: `sendSuccess`, `sendCreated`, `sendPaginated`, `sendNoContent`
- NO business logic, NO if/else chains, NO Prisma imports

### Services (`*.service.ts`)
- ALL business logic lives here
- Orchestrate repository calls
- Throw `AppError` subclasses for domain errors
- NO direct Prisma/database access — use repositories
- NO HTTP concepts (no Request, Response, next)

### Repositories (`*.repository.ts`)
- ALL Prisma calls live here — nowhere else
- Always use `select` to limit returned fields
- Use `satisfies Prisma.XxxSelect` for type safety
- NO business logic — pure data access

### Middleware
- Stateless and reusable
- Always call `next()` or `next(err)` — never both, never neither
- Never throw — always pass to `next(err)`

## Error Handling
- Use `AppError` and subclasses from `src/shared/errors/`
- Always pass to `next(err)` in async handlers — never `throw` without catching
- Error handler in `src/middleware/error-handler.ts` formats all responses

## Logging
- Import `logger` from `src/config/logger.ts`
- Never use `console.log` — use `logger.info`, `logger.warn`, `logger.error`
- Log at the right level: `debug` → `info` → `warn` → `error` → `fatal`
- Never log sensitive data (passwords, tokens, PII)

## Configuration
- All env vars validated in `src/config/env.ts`
- Access env via `import { env } from '../../config/env.js'`
- Never access `process.env` directly in business code
