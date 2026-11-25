---
name: security-audit
description: Security audit checklist for auth, authorization, secrets, and vulnerability detection
---

# Security Audit Skill

## Purpose
Perform a targeted security audit on code changes before deployment.

## When To Use
- Before deploying new auth-related code
- After adding new API endpoints
- Periodic security review
- After major dependency updates

## Audit Process

### 1. Secret Scanning
```bash
bash .claude/hooks/prevent-secrets.sh
```
Manual check:
- Search for hardcoded API keys, passwords, or tokens in source
- Verify `.env` is in `.gitignore` and not tracked
- Check git log: `git log --all --full-history -- .env`

### 2. Authentication Audit
Verify `src/middleware/authenticate.ts`:
- [ ] Token extracted from `Authorization: Bearer <token>` header
- [ ] Verified with `jwt.verify()` using `env.JWT_ACCESS_SECRET`
- [ ] Token type checked: `payload.type === 'access'`
- [ ] JWT errors caught and converted to `UnauthorizedError`

### 3. Authorization Audit
Review route definitions:
- [ ] Every non-public route has `authenticate` middleware
- [ ] Admin routes have `authorize(Role.ADMIN)` after `authenticate`
- [ ] Self-only operations use `req.user!.id` (not `req.params.id`)

### 4. Input Validation
Check route files:
- [ ] `validate({ body: schema })` on every route with a request body
- [ ] `validate({ params: schema })` for UUID params
- [ ] `validate({ query: schema })` for filter/pagination params
- [ ] Zod schemas use `.email()`, `.url()`, `.uuid()` where appropriate

### 5. Error Response Audit
Check `src/middleware/error-handler.ts`:
- [ ] Stack traces only included in `development` mode
- [ ] `password`, `token` fields redacted in Pino logger
- [ ] Generic "An unexpected error occurred" for 500 responses in production

### 6. Rate Limiting
Check `src/app.ts` and `src/modules/auth/auth.routes.ts`:
- [ ] `globalRateLimiter` applied before all routes
- [ ] `authRateLimiter` applied to login, register, refresh routes

### 7. Dependency Audit
```bash
npm audit
npm audit --audit-level=high
```

## Findings Report Template
```
## Security Audit Report
Date: <date>
Scope: <files/modules reviewed>

### Findings
| # | Severity | File:Line | Issue | Remediation |
|---|---------|-----------|-------|-------------|
| 1 | 🔴 Critical | auth.service.ts:45 | ... | ... |

### Summary
- Critical: 0
- Medium: 0
- Low: 0
- Result: PASS / FAIL
```
