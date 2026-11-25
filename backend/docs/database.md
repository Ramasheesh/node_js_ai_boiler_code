# Database Documentation

## Schema Overview

Three models with one-to-many and one-to-one relationships:

```
User ─┬─< RefreshToken (one-to-many)
      └── UserProfile (one-to-one)
```

## Models

### User
Core authentication and identity model.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid() |
| email | String | Unique, indexed |
| username | String | Unique, indexed |
| password | String | Argon2 hash — never returned |
| role | Enum | USER / ADMIN / MODERATOR, default USER |
| isActive | Boolean | default true |
| createdAt | DateTime | default now() |
| updatedAt | DateTime | auto-updated |

### UserProfile
Optional extended user data, one-to-one with User.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| userId | String | FK → User.id, Unique, Cascade delete |
| firstName | String? | nullable |
| lastName | String? | nullable |
| bio | String? | nullable |
| avatarUrl | String? | nullable |

### RefreshToken
Stores refresh tokens for revocation and rotation.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| token | String | Unique, indexed |
| userId | String | FK → User.id, indexed, Cascade delete |
| expiresAt | DateTime | Expiry timestamp |
| revoked | Boolean | default false |
| createdAt | DateTime | default now() |

## Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| users | email | Unique lookup for login |
| users | username | Unique lookup |
| user_profiles | userId | Unique FK lookup |
| refresh_tokens | token | Token lookup for refresh/revoke |
| refresh_tokens | userId | Revoke all user tokens |

## Migration Commands

```bash
# Development: create + apply migration interactively
npm run db:migrate

# After schema changes: regenerate Prisma client
npm run db:generate

# Production: apply pending migrations only (no prompt)
npm run db:deploy

# View current DB in browser
npm run db:studio
```

## Connection Configuration

Prisma uses a singleton client to prevent connection leaks in development (hot reload creates new modules). The global singleton pattern:

```typescript
export const prisma = global.__prisma ?? new PrismaClient({ ... });
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
```

## Seeded Data

After running `npm run db:seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123456 | ADMIN |
| user@example.com | User@123456 | USER |

> ⚠️ Change these credentials immediately in production!
