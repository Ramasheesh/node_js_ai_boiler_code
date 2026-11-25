---
description: Database and Prisma rules
globs: ["src/database/**/*.ts", "src/modules/**/*.repository.ts", "prisma/**"]
---

# Database Rules

## Prisma Usage
- Import `prisma` from `src/database/prisma.ts` only — never `new PrismaClient()` in modules
- Always use `select` to limit returned fields — never return password fields
- Use `satisfies Prisma.XxxSelect` for compile-time type safety on select objects
- Use `prisma.$transaction([...])` for atomic operations

## Schema Conventions
- Table names: `snake_case` via `@@map("table_name")`
- Model field names: `camelCase` (Prisma maps to snake_case in DB)
- Always include `@@index` for FK fields and frequently filtered fields
- Every model must have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Use `@default(uuid())` for all primary keys

## Migration Workflow
```bash
# Development: creates migration file + applies it
npm run db:migrate

# Production: applies pending migrations only (no prompt, no reset)
npm run db:deploy

# After schema change: regenerate Prisma client
npm run db:generate
```

- Never edit migration files after they are applied
- Commit migration files to version control
- One concern per migration (atomic schema changes)

## Transactions
- Use for any operation that modifies multiple related records
- Keep transactions short — no slow I/O inside transactions
- Use `prisma.$transaction` array syntax for simple cases

## Health Checks
- Use `prisma.$queryRaw\`SELECT 1\`` for health probes only
- Never for data retrieval

## Security
- Prisma parameterizes all queries automatically — no SQL injection risk
- Never use `prisma.$queryRawUnsafe`
- Validate all inputs with Zod before passing to Prisma
- Never return `password` field from any query — always exclude via `select`
