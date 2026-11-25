# AGENTS.md — Shared AI Coding Conventions

This file is shared across all compatible AI coding agents (Claude Code, Codex, Cursor, etc.).

## Repository Conventions

### File Organization
- Feature code lives in `src/modules/<feature>/`
- Each module has 6 files: `.routes.ts`, `.controller.ts`, `.service.ts`, `.repository.ts`, `.validation.ts`, `.types.ts`
- Shared utilities go in `src/shared/`
- Config in `src/config/` — access via `import { env } from '../../config/env.js'`

### Naming
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database tables: `snake_case` via `@@map()` in Prisma schema

### Imports
- Always use `.js` extension for local imports (ES module compatibility with tsx)
- Group: node built-ins → external packages → internal modules
- No barrel re-exports from `index.ts` files for lazy-load paths

## Architecture Constraints

1. **Controllers** only handle HTTP req/res — call one service method, pass errors to `next(err)`
2. **Services** contain ALL business logic — no Prisma imports, no HTTP concepts
3. **Repositories** are the ONLY layer with Prisma — always use `select`, never over-fetch
4. **Middleware** is reusable and stateless — always call `next()` or `next(err)`, never both
5. **No circular dependencies** — dependency flows one way: routes → controller → service → repository → database

## Code Quality Standards

- TypeScript strict mode — zero `any` without explicit justification + comment
- All exported functions have explicit return types
- Zero `console.log` in production code — use `logger` from `src/config/logger.ts`
- Zero unused variables or imports
- Run `npm run typecheck && npm run lint` after every change

## Testing Expectations

- Unit tests for: Zod validation schemas, AppError subclasses, utility functions
- Integration tests for: all HTTP routes including error paths
- Tests live in `tests/unit/` or `tests/integration/`
- Coverage target: 70%+ lines/functions, 60%+ branches
- Never mock `AppError` classes or response helpers — test them directly

## Security Requirements

- Never hardcode secrets, tokens, credentials in source code
- Never log sensitive data (passwords, JWT tokens, PII)
- All user input validated with Zod before entering business logic
- Authentication checked in middleware (`authenticate.ts`), not in controllers
- Rate limiting on all public auth endpoints

## Git Workflow

- Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`, `test/`
- Atomic commits with descriptive messages
- Do not commit `.env`, `.env.local`, or any file with real credentials
- Do not push directly to `main`/`master` — use pull requests
- **Never auto-push to production branches**

## What NOT To Do

- Do not modify unrelated files
- Do not add npm packages without clear justification
- Do not write business logic in controllers
- Do not write database queries in services
- Do not expose internal errors or stack traces to API clients
- Do not leave TODO comments in production code
- Do not bypass the `validate()` middleware
- Do not access `process.env` directly — use `env` from `src/config/env.ts`
