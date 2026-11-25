---
name: backend-development
description: Complete workflow for building new backend feature modules following the layered architecture
---

# Backend Development Skill

## Purpose
Guide step-by-step implementation of new backend features in the Express/TypeScript modular monolith.

## When To Use
- Adding a new API module (e.g., `products`, `orders`, `notifications`)
- Extending an existing module with new endpoints
- Implementing background jobs or cron tasks

## Workflow

### Step 1 — Plan (use Architect Agent)
1. Define the feature requirements
2. Design API endpoints and request/response contracts
3. Design Prisma schema changes (if any)
4. List files to create/modify in dependency order

### Step 2 — Schema (if DB change needed)
```bash
# 1. Update prisma/schema.prisma
# 2. Regenerate client
npm run db:generate
# 3. Create migration
npm run db:migrate
# 4. Update seed if needed
```

### Step 3 — Implement in this exact order
```
src/modules/<feature>/
  <feature>.types.ts        # DTOs and response interfaces
  <feature>.validation.ts   # Zod input schemas
  <feature>.repository.ts   # Prisma calls only
  <feature>.service.ts      # Business logic
  <feature>.controller.ts   # HTTP handlers + @openapi JSDoc
  <feature>.routes.ts       # Route definitions with middleware
```
Then register in `src/routes/index.ts`.

### Step 4 — Write Tests
```
tests/unit/<feature>/<feature>.validation.test.ts
tests/integration/<feature>.test.ts
```

### Step 5 — Validate
```bash
npm run typecheck && npm run lint && npm test
```

## Best Practices
- Use `auth/` and `users/` modules as reference implementations
- Use `AppError` subclasses for all error cases
- Use response helpers (`sendSuccess`, `sendCreated`, `sendPaginated`)
- Add `@openapi` JSDoc to every controller method
- Keep validation in Zod schemas only

## Common Mistakes
- ❌ Business logic in controllers
- ❌ Direct Prisma calls in services
- ❌ Missing `validate()` middleware on routes
- ❌ Hardcoded values instead of `env.*`
- ❌ Forgetting `npm run db:generate` after schema change
- ❌ Not registering routes in `src/routes/index.ts`

## Validation Checklist
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero errors
- [ ] All new endpoints have tests (happy + error paths)
- [ ] Controller has zero business logic
- [ ] Repository always uses `select`
- [ ] Routes registered in `src/routes/index.ts`
