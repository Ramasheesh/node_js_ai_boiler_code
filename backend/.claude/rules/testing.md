---
description: Testing conventions and requirements
globs: ["tests/**/*.ts", "src/**/*.test.ts", "src/**/*.spec.ts"]
---

# Testing Rules

## Framework
- Vitest for all tests (not Jest — different APIs)
- Supertest for HTTP integration tests
- Use `vi.mock()` for mocking in unit tests

## Test Structure
```
tests/
├── unit/
│   ├── shared/      # errors.test.ts, pagination.test.ts
│   └── auth/        # auth.validation.test.ts
├── integration/
│   ├── health.test.ts
│   └── auth.test.ts
└── setup.ts         # global env setup
```

## Test Naming
- File: `<what>.test.ts`
- Describe: `ComponentName` or `methodName`
- It: `should [behavior] when [condition]`

## Unit Tests
- Test one function/class per describe block
- No real database, HTTP, or external service calls
- Mock Prisma: `vi.mock('../../src/database/prisma.js')`
- Test both happy paths and error/edge cases

## Integration Tests
- Use `createApp()` to get the Express application
- Use `supertest(app)` for HTTP requests
- Test success responses AND validation errors AND auth errors
- For every endpoint: test 400 (bad input), 401 (no auth), and success

## Coverage Targets
```bash
npm run test:coverage
```
- Lines: 70%+
- Functions: 70%+
- Branches: 60%+
- Statements: 70%+

## Test Data
- Use realistic but fake data
- Never use production database in tests
- `tests/setup.ts` sets `NODE_ENV=test` and dummy env vars

## Assertions
- Always assert `res.status` AND `res.body.success`
- For errors: also assert `res.body.code`
- For success: assert the shape of `res.body.data`

## Common Patterns
```typescript
// Unit test
expect(result.success).toBe(false); // Zod safeParse
expect(err.statusCode).toBe(404);   // AppError subclass

// Integration test
const res = await supertest(app).post('/api/v1/auth/login').send({...});
expect(res.status).toBe(400);
expect(res.body.success).toBe(false);
expect(res.body.code).toBe('VALIDATION_ERROR');
```
