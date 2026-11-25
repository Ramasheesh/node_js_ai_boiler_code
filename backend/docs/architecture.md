# Architecture

## Pattern: Modular Monolith

This project uses a **modular monolith** — all code runs in a single process but is organized into well-defined modules with strict dependency boundaries. This provides the simplicity of a monolith with the organization of microservices, and can be split into services later if needed.

## Request Lifecycle

```
HTTP Request
     │
     ▼
[ Express Router ]  — matches URL and method
     │
     ▼
[ Global Middleware ]
  ├── Helmet (security headers)
  ├── CORS (origin allowlist)
  ├── Compression (gzip)
  ├── Request ID (UUID injection)
  ├── Pino HTTP logger (structured logging)
  ├── Body parser (JSON + URL-encoded)
  └── Global Rate Limiter
     │
     ▼
[ Route Middleware ]  — per-route
  ├── authenticate (JWT verification)
  ├── authorize (role check)
  ├── authRateLimiter (auth endpoints)
  └── validate (Zod schema)
     │
     ▼
[ Controller ]  — HTTP req/res only, no business logic
     │
     ▼
[ Service ]  — all business logic, throws AppError
     │
     ▼
[ Repository ]  — all Prisma calls, always uses `select`
     │
     ▼
[ Database ]  — PostgreSQL via Prisma ORM
```

## Layer Responsibilities

### Config (`src/config/`)
- `env.ts` — Zod-validated environment variables. App exits if invalid.
- `logger.ts` — Pino logger singleton with redaction
- `cors.ts` — CORS origin allowlist
- `redis.ts` — Optional Redis connection lifecycle
- `swagger.ts` — OpenAPI spec generation from JSDoc
- `database.ts` — Re-exports from `src/database/prisma.ts`

### Database (`src/database/`)
- `prisma.ts` — Prisma singleton (global in dev to prevent connection leaks with hot reload)
- `health-check.ts` — `SELECT 1` for liveness/readiness probes

### Modules (`src/modules/<name>/`)
Each module is self-contained with 6 files:
- `.types.ts` — DTO interfaces and response types
- `.validation.ts` — Zod schemas for all input shapes
- `.repository.ts` — Prisma operations (only layer that imports prisma)
- `.service.ts` — Business logic (only layer that throws AppError)
- `.controller.ts` — HTTP handlers (try/catch + delegate to service)
- `.routes.ts` — Route definitions with middleware chain

### Middleware (`src/middleware/`)
All middleware is stateless and reusable:
- `authenticate.ts` — Verifies JWT access token, sets `req.user`
- `authorize.ts` — Checks `req.user.role` against allowed roles
- `validate.ts` — Applies Zod schemas to body/query/params
- `error-handler.ts` — Formats all errors into consistent API responses
- `not-found.ts` — Catches unmatched routes as 404
- `rate-limiter.ts` — Global and auth-specific rate limiters
- `request-id.ts` — Injects UUID request ID for log correlation

### Shared (`src/shared/`)
- `errors/` — `AppError` base class and subclasses (NotFoundError, ValidationError, etc.)
- `responses/` — `sendSuccess`, `sendCreated`, `sendPaginated`, `sendNoContent`
- `types/` — Express type augmentation (`req.user`, `req.requestId`)
- `constants/` — HTTP status codes, pagination defaults
- `utils/` — `parsePagination`, `buildPaginationMeta`

## Authentication Flow

```
Register:
  POST /auth/register → validate → hash password (Argon2) → create user
                      → generate access + refresh tokens → store refresh token → return both

Login:
  POST /auth/login → validate → find user → verify password (Argon2)
                  → generate tokens → store refresh token → return both

Refresh:
  POST /auth/refresh → validate → verify refresh JWT signature
                     → check token in DB (not revoked, not expired)
                     → revoke old token → generate new pair → store new refresh → return

Logout:
  POST /auth/logout → authenticate → revoke specific refresh token

Logout All:
  POST /auth/logout-all → authenticate → revoke all user refresh tokens
```

## Error Handling Architecture

```
AppError (base)
├── NotFoundError (404, NOT_FOUND)
├── ValidationError (400, VALIDATION_ERROR) — with Zod details
├── UnauthorizedError (401, UNAUTHORIZED)
├── ForbiddenError (403, FORBIDDEN)
├── ConflictError (409, CONFLICT)
└── TooManyRequestsError (429, TOO_MANY_REQUESTS)

Prisma errors → mapped in error-handler.ts:
  P2002 → 409 ConflictError
  P2025 → 404 NotFoundError
  P2003 → 400 (FK violation)
  Other → 500 (generic database error)
```

## Dependency Rules (enforced by convention)

```
routes → controller → service → repository → database (prisma)
              ↓            ↓
           shared/     shared/
           responses   errors
```

**Violations that must never happen:**
- Controller importing Prisma
- Service importing Prisma
- Repository importing AppError subclasses
- Circular imports between modules
