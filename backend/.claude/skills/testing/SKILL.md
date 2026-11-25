---
name: testing
description: Writing and running Vitest unit and integration tests for the backend
---

# Testing Skill

## Purpose
Write comprehensive tests using Vitest and Supertest for all backend features.

## When To Use
- Writing tests for new endpoints or modules
- Increasing test coverage
- Debugging failing tests

## Unit Test Workflow

### For Zod Validation Schemas
```typescript
import { describe, it, expect } from 'vitest';
import { createItemSchema } from '../../../src/modules/items/item.validation.js';

describe('createItemSchema', () => {
  it('should accept valid data', () => {
    const result = createItemSchema.safeParse({ name: 'Widget', price: 9.99 });
    expect(result.success).toBe(true);
  });

  it('should reject negative price', () => {
    const result = createItemSchema.safeParse({ name: 'Widget', price: -1 });
    expect(result.success).toBe(false);
  });
});
```

### For AppError Classes
```typescript
it('should create NotFoundError with 404', () => {
  const err = new NotFoundError('Item');
  expect(err.statusCode).toBe(404);
  expect(err.code).toBe('NOT_FOUND');
  expect(err.message).toContain('Item');
});
```

## Integration Test Workflow

### Setup (once per file)
```typescript
import { createApp } from '../../src/app.js';
const app = createApp();
```

### Test Pattern
```typescript
it('POST /api/v1/items — should return 201', async () => {
  const res = await supertest(app)
    .post('/api/v1/items')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: 'Widget', price: 9.99 });

  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data.name).toBe('Widget');
  expect(res.body.timestamp).toBeDefined();
});
```

## Test Commands
```bash
npm test                              # All tests
npm test -- tests/unit               # Unit only (fast)
npm test -- tests/integration        # Integration only
npm test -- --reporter=verbose       # Detailed output
npm run test:coverage                # Coverage report
```

## Coverage Checklist
- [ ] Zod validation schemas tested (valid + each invalid case)
- [ ] AppError subclasses tested
- [ ] All endpoints: success + 400 + 401 + 404 cases
- [ ] Response format verified (`success`, `code`, `timestamp`)
- [ ] `npm run test:coverage` shows 70%+ lines/functions

## Troubleshooting Tests
- **Import errors**: Add `.js` to local import paths
- **Env errors**: Check `tests/setup.ts` sets all required env vars
- **DB-dependent tests failing**: Use `tests/unit/` for logic-only tests; keep DB in `integration/`
- **Timeout errors**: Increase `testTimeout` in `vitest.config.ts`
