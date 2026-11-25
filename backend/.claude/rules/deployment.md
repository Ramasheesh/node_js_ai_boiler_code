---
description: Deployment rules and procedures for production safety
---

# Deployment Rules

## ⚠️ Mandatory Rules (Never Violate)
- **NEVER deploy automatically** — human approval required
- **NEVER use `db:migrate` in production** — always `db:deploy`
- **NEVER push directly to main/master** — use pull requests
- **NEVER hardcode secrets** in source code or Docker images
- **NEVER expose `/api-docs`** in production (`NODE_ENV=production` disables it)

## Pre-Deployment Checklist
- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] `.env.example` is up to date
- [ ] Database migrations are tested in staging
- [ ] Human approval obtained

## Production Requirements
- Build from `dist/` only — compiled JavaScript
- `NODE_ENV` must be `production`
- All env vars validated at startup — server exits on invalid config
- Run `npm run db:deploy` before starting new server version

## Docker Deployment
```bash
docker build --target production -t backend-boilerplate:latest .
docker compose up -d
docker compose exec api npx prisma migrate deploy  # First deploy
```

## Render Deployment
1. Build command: `npm ci && npm run build && npm run db:generate`
2. Start command: `npm run db:deploy && node dist/server.js`
3. Health check path: `/api/v1/health/live`
4. All env vars set in Render dashboard

## VPS/PM2 Deployment
```bash
git pull && npm ci --only=production
npm run db:generate && npm run db:deploy && npm run build
pm2 reload ecosystem.config.js --env production
```

## Rollback
```bash
git checkout <previous-tag>
npm run build
pm2 reload ecosystem.config.js --env production
# If DB migration was destructive: restore from backup first
```
