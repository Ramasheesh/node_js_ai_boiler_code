---
name: debugging
description: Systematic debugging workflow for backend issues — requests, database, auth, performance
---

# Debugging Skill

## Purpose
Systematically debug backend issues: request errors, database failures, auth problems, and startup failures.

## When To Use
- API returning unexpected status codes
- Database query failures or connection errors
- Authentication/authorization errors
- Performance degradation
- Server startup failures

## Debugging Decision Tree

### Step 1 — Check the Logs
```bash
npm run dev  # Pino structured logs with request IDs
```
Every request has an `X-Request-ID` header. Find the failing request's ID in logs.

### Step 2 — Identify the Error Layer

| Symptom | Layer | Action |
|---------|-------|--------|
| 400 response | Validation | Check Zod schema + request payload |
| 401 Unauthorized | Auth middleware | Check JWT token, expiry, format |
| 403 Forbidden | Authorize middleware | Check user role |
| 404 Not Found | Service/Repository | Check ID and DB record |
| 409 Conflict | Service | Unique constraint violation |
| 500 Internal Error | Any | Check Pino error logs |
| 503 Service Unavailable | DB/Redis | Check connection config |

### Step 3 — Database Issues
Prisma error codes:
- `P2002` → Unique constraint → 409 Conflict
- `P2025` → Record not found → 404 Not Found
- `P2003` → Foreign key violation → 400 Bad Request
- `PrismaClientInitializationError` → Bad `DATABASE_URL` or DB not running

### Step 4 — Auth Issues
- `Missing or invalid authorization header` → Bearer token missing
- `Invalid or expired token` → Token expired or wrong `JWT_ACCESS_SECRET`
- `Invalid token type` → Sending refresh token to access-protected route
- `Insufficient permissions` → User role doesn't match `authorize()` check

### Step 5 — TypeScript Errors
```bash
npm run typecheck 2>&1 | head -40
```

### Step 6 — Run Tests in Isolation
```bash
npm test -- --reporter=verbose
npm test -- tests/unit  # No DB needed
```

## Health Check Debugging
```bash
curl http://localhost:3000/api/v1/health      # Full status + DB
curl http://localhost:3000/api/v1/health/live # Liveness only
curl http://localhost:3000/api/v1/health/ready # Readiness
```

## Common Issues & Fixes
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Cannot find module` | Missing `db:generate` | `npm run db:generate` |
| `PrismaClientInitializationError` | Bad DATABASE_URL | Check `.env` |
| `JsonWebTokenError` | Wrong JWT secret | Verify env vars |
| CORS error | Origin not allowlisted | Add to `CORS_ORIGIN` env |
| Port in use | Another process running | `netstat -ano \| findstr :3000` |
| `ERR_MODULE_NOT_FOUND` | Missing `.js` in import | Add `.js` to import path |
