---
name: database-management
description: Prisma schema design, migrations, indexes, and query optimization
---

# Database Management Skill

## Purpose
Manage the PostgreSQL database via Prisma: schema design, migrations, indexes, transactions, and query optimization.

## When To Use
- Adding or modifying Prisma models
- Creating or reviewing database migrations
- Optimizing slow or inefficient queries
- Designing data relationships

## Schema Design Workflow

### Step 1 — Model Template
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  userId      String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])    // Index every FK field
  @@index([name])      // Index search/filter fields
  @@map("products")    // Snake_case table name
}
```

### Step 2 — Generate & Migrate
```bash
npm run db:generate  # Regenerate Prisma client
npm run db:migrate   # Create named migration (dev only)
# Production:
npm run db:deploy    # Apply pending migrations
```

### Step 3 — Repository Pattern
```typescript
const productSelect = {
  id: true, name: true, price: true, isActive: true, createdAt: true,
} satisfies Prisma.ProductSelect;

async findByUserId(userId: string, skip: number, take: number) {
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: { userId, isActive: true },
      select: productSelect,
      skip, take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: { userId, isActive: true } }),
  ]);
  return { products, total };
}
```

## Index Strategy
| Scenario | Solution |
|----------|---------|
| FK field | `@@index([fkField])` |
| Unique field | `@unique` |
| Frequently filtered | `@@index([field])` |
| Multi-column filter | `@@index([field1, field2])` |
| Email, username | `@unique` |

## Common Mistakes
- ❌ No `select` on queries (over-fetching)
- ❌ Missing `@@index` on FK fields
- ❌ Running `migrate dev` in production
- ❌ N+1 queries in loops (use `include` or batch)
- ❌ Forgetting `db:generate` after schema change
- ❌ Editing applied migration files
