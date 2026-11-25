---
description: Security rules — authentication, authorization, secrets, input validation
---

# Security Rules

## Authentication
- JWT access tokens: 15-minute expiry (short-lived)
- JWT refresh tokens: 7-day expiry with database-backed rotation
- Refresh tokens stored in `refresh_tokens` table, revocable instantly
- Logout revokes the specific refresh token
- Logout-all revokes all user's refresh tokens

## Password Handling
- Always hash with Argon2 (`argon2.hash()`) — never store plaintext
- Never log passwords or hashes anywhere
- Never return password fields from API responses
- Use `argon2.verify()` for comparison — never compare hashes directly

## Token Security
- Never log JWT tokens (access or refresh)
- Access secrets must be minimum 32 characters
- Use separate secrets for access and refresh tokens (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`)
- Validate token type (`payload.type === 'access'`) in `authenticate` middleware

## Input Validation
- Validate ALL user inputs with Zod schemas in `*.validation.ts`
- Validate route params, query strings, AND body — not just body
- Use `validate({ body, query, params })` middleware before controller

## Secret Management
- Environment variables ONLY — never hardcode secrets
- Use `.env.example` as a template; `.env` is gitignored
- Minimum JWT secret length: 32 characters (enforced by `env.ts` Zod schema)

## Rate Limiting
- Global: 100 req/15min per IP (`globalRateLimiter`)
- Auth endpoints: 10 req/15min per IP (`authRateLimiter`)
- Never disable rate limiting in production
- Rate limiter uses `express-rate-limit` with `trust proxy: 1`

## Security Headers
- Helmet enabled for all HTTP responses
- CORS restricted to explicit allowlist (`CORS_ORIGIN` env var)
- Only `X-Request-ID` and rate limit headers exposed

## Error Handling
- Never expose stack traces in production (`NODE_ENV=production`)
- Generic messages for unexpected errors: "An unexpected error occurred"
- Specific messages only for operational errors (validation, auth, not found)
- Prisma errors mapped to appropriate HTTP codes in `error-handler.ts`
