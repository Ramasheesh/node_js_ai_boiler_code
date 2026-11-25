# 🚀 Node.js Backend Boilerplate

[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_strict-blue)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Production-ready Node.js backend boilerplate with Express, TypeScript (strict), PostgreSQL/Prisma, JWT authentication with refresh token rotation, Pino structured logging, and a **complete Claude Code AI development environment** with specialized agents, skills, rules, and hooks.

---

## ✨ Features

- **TypeScript strict mode** — zero implicit `any`, full type safety
- **Modular monolith** architecture — Routes → Controller → Service → Repository → Database
- **JWT authentication** — access + refresh tokens with rotation and revocation
- **Argon2 password hashing** — memory-hard, industry-leading security
- **Prisma ORM** — type-safe database access with PostgreSQL
- **Zod validation** — schema-based input validation at every entry point
- **Role-based access control** — USER / ADMIN / MODERATOR roles
- **Pino structured logging** — JSON logs with request correlation IDs
- **Helmet + CORS** — security headers and origin allowlisting
- **Rate limiting** — global + auth-endpoint specific limits
- **Graceful shutdown** — SIGTERM/SIGINT with connection cleanup
- **Health endpoints** — /health, /health/live, /health/ready
- **Swagger UI** — auto-generated OpenAPI docs from JSDoc
- **Vitest + Supertest** — unit and integration tests
- **Docker + Docker Compose** — multi-stage production image
- **PM2 ecosystem** — cluster mode for VPS deployment
- **Claude Code AI environment** — 6 agents, 7 skills, 7 rules, 4 hooks

---

## 🏗 Architecture

**Request lifecycle:**
```
Client → Routes → Middleware → Controller → Service → Repository → Database
```

| Layer | Responsibility |
|-------|---------------|
| Routes | URL patterns + middleware chain |
| Middleware | Auth, validation, rate limiting, logging |
| Controller | HTTP req/res only — delegates to service |
| Service | All business logic |
| Repository | All Prisma/database operations |
| Database | PostgreSQL via Prisma |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 22 LTS |
| Language | TypeScript 5 (strict) |
| Framework | Express 4 |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | JWT + Argon2 |
| Cache | Redis 7 (optional) |
| Logging | Pino 9 |
| Validation | Zod 3 |
| Security | Helmet, CORS, express-rate-limit |
| API Docs | Swagger UI + swagger-jsdoc |
| Testing | Vitest 2 + Supertest |
| Container | Docker + Docker Compose |
| Process Manager | PM2 |

---

## 📋 Prerequisites

- **Node.js** 20+ (22 LTS recommended)
- **PostgreSQL** 16+
- **Redis** 7+ (optional — set `REDIS_ENABLED=false` to skip)
- **npm** 10+
- **Docker + Docker Compose** (for containerized setup)

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd backend

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets

# 3. Install dependencies
npm install

# 4. Set up the database
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Create tables
npm run db:seed       # Optional: add sample data

# 5. Start the development server
npm run dev
```

The server starts on `http://localhost:3000`

- **API**: `http://localhost:3000/api/v1/`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health**: `http://localhost:3000/api/v1/health`

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `PORT` | No | `3000` | HTTP server port |
| `API_VERSION` | No | `v1` | API version prefix |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection URL |
| `JWT_ACCESS_SECRET` | **Yes** | — | Min 32 chars, access token signing key |
| `JWT_REFRESH_SECRET` | **Yes** | — | Min 32 chars, different from access secret |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token TTL |
| `REDIS_URL` | No | — | Redis connection URL |
| `REDIS_ENABLED` | No | `false` | Enable Redis |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Comma-separated allowed origins |
| `LOG_LEVEL` | No | `info` | `trace`, `debug`, `info`, `warn`, `error` |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `ARGON2_MEMORY_COST` | No | `65536` | Argon2 memory cost (KB) |
| `ARGON2_TIME_COST` | No | `3` | Argon2 iterations |
| `ARGON2_PARALLELISM` | No | `4` | Argon2 parallelism |

---

## 📦 NPM Scripts

```bash
npm run dev              # Development server with hot reload (tsx watch)
npm run build            # Compile TypeScript → dist/
npm start                # Run compiled production server
npm run typecheck        # Type check without emitting files
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Prettier check (for CI)
npm test                 # Run all tests
npm run test:coverage    # Tests with coverage report
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create + apply migration (dev)
npm run db:deploy        # Apply migrations without prompts (prod)
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio
npm run health           # Check if server is running
```

---

## 🌐 API Endpoints

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | None | Full health with DB status |
| GET | `/api/v1/health/live` | None | Liveness probe |
| GET | `/api/v1/health/ready` | None | Readiness probe |

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | None | Register new user |
| POST | `/api/v1/auth/login` | None | Login, get tokens |
| POST | `/api/v1/auth/refresh` | None | Refresh access token |
| POST | `/api/v1/auth/logout` | Bearer | Revoke refresh token |
| POST | `/api/v1/auth/logout-all` | Bearer | Revoke all sessions |
| GET | `/api/v1/auth/me` | Bearer | Get current user |

### Users (Admin only)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users` | Admin | List users (paginated) |
| GET | `/api/v1/users/:id` | Admin | Get user by ID |
| PATCH | `/api/v1/users/profile` | Bearer | Update own profile |
| PATCH | `/api/v1/users/:id` | Admin | Update user |
| DELETE | `/api/v1/users/:id` | Admin | Delete user |

**API Documentation**: `http://localhost:3000/api-docs` (dev mode only)

---

## 🧪 Testing

```bash
npm test                        # All tests
npm test -- tests/unit          # Unit tests only (no DB needed)
npm test -- tests/integration   # Integration tests
npm run test:coverage           # With coverage report
npm test -- --reporter=verbose  # Detailed output
```

Coverage targets: **70%** lines/functions, **60%** branches

---

## 🐳 Docker

### Development with Docker Compose
```bash
cp .env.example .env  # Configure env vars

# Start all services (API + PostgreSQL + Redis)
docker compose up -d

# View logs
docker compose logs api -f

# Stop everything
docker compose down
```

### Production Build
```bash
docker build --target production -t backend:latest .
docker run -p 3000:3000 --env-file .env backend:latest
```

---

## 🚀 Production Deployment

### Render
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Build command: `npm ci && npm run build && npm run db:generate`
4. Start command: `npm run db:deploy && node dist/server.js`
5. Health check path: `/api/v1/health/live`
6. Set all environment variables in the Render dashboard
7. Add a Render PostgreSQL database and copy the internal URL

### VPS with PM2
```bash
# Initial deployment
npm install -g pm2
git clone <repo> /var/www/backend && cd /var/www/backend
cp .env.example .env              # Fill production values
npm ci --only=production
npm run db:generate
npm run db:deploy
npm run build
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup

# Update deployment
git pull
npm ci --only=production
npm run db:generate && npm run db:deploy && npm run build
pm2 reload ecosystem.config.js --env production
```

> ⚠️ **Never deploy automatically** — always require human approval before production deployment.

---

## 🤖 Claude Code AI Development Environment

This boilerplate includes a production-grade Claude Code setup.

### Quick Setup
```bash
# Install Claude Code (if not already installed)
# See: https://docs.anthropic.com/en/docs/claude-code

# Open the project in Claude Code
claude  # from the backend/ directory
```

### Agents
| Agent | Use When |
|-------|---------|
| `architect` | Planning new features or architecture changes |
| `backend-developer` | Implementing controllers, services, routes |
| `database-engineer` | Schema design, migrations, query optimization |
| `code-reviewer` | Reviewing PRs for quality and architecture |
| `security-auditor` | Pre-deployment security review |
| `qa-tester` | Writing and debugging tests |

### Skills
Load a skill to get step-by-step guidance:

| Skill | Description |
|-------|-------------|
| `backend-development` | Full workflow for new feature modules |
| `api-development` | REST endpoint design + OpenAPI docs |
| `database-management` | Prisma schema + migrations + optimization |
| `debugging` | Systematic debugging with decision trees |
| `testing` | Writing Vitest unit + integration tests |
| `security-audit` | Pre-deployment security checklist |
| `deployment` | Docker, Render, VPS step-by-step guides |

### Rules
Auto-loaded for matching files:
- `.claude/rules/code-style.md` — TypeScript + formatting rules
- `.claude/rules/backend.md` — Express layered architecture
- `.claude/rules/api-conventions.md` — REST conventions + response formats
- `.claude/rules/database.md` — Prisma usage patterns
- `.claude/rules/security.md` — Auth, validation, secrets
- `.claude/rules/testing.md` — Vitest patterns + coverage targets
- `.claude/rules/deployment.md` — Production deployment safety rules

### Hooks
Run automatically on file writes:
- `check-format.sh` — Reports Prettier formatting issues
- `prevent-secrets.sh` — Scans for hardcoded secrets
- `validate-code.sh` — TypeScript syntax advisory check
- `run-tests.sh` — Unit test runner (advisory)

### MCP Servers
Configure in `.mcp.json`:
- **GitHub** (disabled by default) — set `GITHUB_TOKEN` env var
- **PostgreSQL** (disabled by default) — set `DATABASE_URL` env var
- **Filesystem** (enabled) — access to `src/`, `tests/`, `prisma/`, `docs/`

---

## 🌳 Git Worktree Workflow

Worktrees allow parallel feature development without stashing:

```bash
# Create a worktree for a new feature
git worktree add ../backend-feat-orders feat/orders

# Work in the separate directory
cd ../backend-feat-orders
npm install

# Back in the main worktree — independent changes
cd ../backend

# Remove when done (after merging)
git worktree remove ../backend-feat-orders
```

The `worktrees/` directory is gitignored to avoid conflicts.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app factory
│   ├── server.ts                 # HTTP server + graceful shutdown
│   ├── config/
│   │   ├── env.ts                # Env var validation (Zod)
│   │   ├── logger.ts             # Pino logger
│   │   ├── cors.ts               # CORS options
│   │   ├── redis.ts              # Redis connection lifecycle
│   │   ├── swagger.ts            # OpenAPI spec
│   │   └── database.ts           # Database re-export
│   ├── modules/
│   │   ├── auth/                 # Auth module (register/login/refresh/logout)
│   │   └── users/                # Users module (CRUD + profiles)
│   ├── middleware/
│   │   ├── authenticate.ts       # JWT verification
│   │   ├── authorize.ts          # Role-based access
│   │   ├── validate.ts           # Zod validation
│   │   ├── error-handler.ts      # Global error formatter
│   │   ├── not-found.ts          # 404 handler
│   │   ├── rate-limiter.ts       # Rate limiting
│   │   └── request-id.ts         # Request ID injection
│   ├── shared/
│   │   ├── errors/               # AppError class hierarchy
│   │   ├── responses/            # Response format helpers
│   │   ├── types/                # Express type augmentation
│   │   ├── constants/            # HTTP codes, pagination defaults
│   │   └── utils/                # Pagination utilities
│   ├── database/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── health-check.ts       # DB health check
│   └── routes/
│       └── index.ts              # Route aggregator + health endpoints
├── prisma/
│   └── schema.prisma             # Database schema (User, UserProfile, RefreshToken)
├── tests/
│   ├── setup.ts                  # Global test environment
│   ├── unit/                     # Pure logic tests
│   └── integration/              # HTTP integration tests
├── scripts/
│   ├── seed.ts                   # Database seeder
│   ├── migrate.ts                # Migration runner
│   └── health-check.ts           # CLI health check
├── docs/                         # Architecture and API documentation
├── .claude/                      # Claude Code AI environment
│   ├── settings.json             # Permissions + hook registrations
│   ├── rules/                    # 7 specialized rule files
│   ├── skills/                   # 7 reusable skill guides
│   ├── agents/                   # 6 specialized agent definitions
│   └── hooks/                    # 4 executable hook scripts
├── CLAUDE.md                     # Claude Code project instructions
├── AGENTS.md                     # Shared AI agent conventions
├── .mcp.json                     # MCP server configuration
├── Dockerfile                    # Multi-stage production image
├── docker-compose.yml            # Full stack local development
├── ecosystem.config.js           # PM2 cluster configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.js
└── prettier.config.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes following the architecture rules
4. Run validation: `npm run typecheck && npm run lint && npm test`
5. Commit: `git commit -m 'feat: add my feature'`
6. Open a Pull Request

---

## 📄 License

MIT © 2024
