---
name: deployment
description: Step-by-step deployment guide for Docker, Render, and VPS/PM2
---

# Deployment Skill

## Purpose
Deploy the backend safely to production using Docker Compose, Render, or VPS with PM2.

## When To Use
- First-time production deployment
- Deploying a new release
- Configuring CI/CD pipeline
- Troubleshooting deployment failures

## ⚠️ Pre-Deployment Checklist
- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] `.env.example` updated with all new variables
- [ ] Database migrations are tested in staging
- [ ] **Human approval obtained** ← mandatory

## Docker Deployment

### Build & Run
```bash
# Build production image
docker build --target production -t backend-boilerplate:latest .

# Start all services
cp .env.example .env  # Fill in real values first
docker compose up -d

# First deploy — run migrations and seed
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run db:seed  # Optional
```

### Verify
```bash
docker compose ps                  # All containers running
curl localhost:3000/api/v1/health  # Health check
docker compose logs api -f         # Tail logs
```

## Render Deployment

### Setup
1. Connect GitHub repo to Render → New Web Service
2. Environment: **Node**, Runtime: **Node 22**
3. Build command: `npm ci && npm run build && npm run db:generate`
4. Start command: `npm run db:deploy && node dist/server.js`
5. Health check path: `/api/v1/health/live`

### Required Environment Variables (Render Dashboard)
```
NODE_ENV=production
DATABASE_URL=<Render PostgreSQL internal URL>
JWT_ACCESS_SECRET=<min 32 chars — generate with: openssl rand -hex 32>
JWT_REFRESH_SECRET=<min 32 chars — different from access secret>
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
```

## VPS Deployment (PM2)

### Initial Setup
```bash
npm install -g pm2
git clone <repo> /var/www/backend && cd /var/www/backend
cp .env.example .env  # Fill in production values
npm ci --only=production
npm run db:generate
npm run db:deploy
npm run build
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

### Update Release
```bash
cd /var/www/backend
git pull
npm ci --only=production
npm run db:generate
npm run db:deploy    # ← NEVER db:migrate in production
npm run build
pm2 reload ecosystem.config.js --env production
```

### Rollback
```bash
git checkout <previous-version-tag>
npm run build
pm2 reload ecosystem.config.js --env production
# If DB migration was destructive: restore backup first
```
