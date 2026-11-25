---
name: api-development
description: REST API endpoint design and implementation with OpenAPI documentation
---

# API Development Skill

## Purpose
Design and implement REST API endpoints following project conventions, with proper validation, error handling, and OpenAPI documentation.

## When To Use
- Designing a new endpoint or reviewing an existing one
- Adding/updating Swagger/OpenAPI documentation
- Ensuring API consistency across modules

## Workflow

### Step 1 — Design the Contract
Before writing code, define:
```
METHOD /api/v1/<resource>
Auth: none | bearer
Request body: { field: type }
Query params: ?page=1&limit=20
Response 200: { success, data: { ... } }
Response 400: { success: false, code: 'VALIDATION_ERROR' }
Response 401: { success: false, code: 'UNAUTHORIZED' }
```

### Step 2 — Zod Validation Schema
```typescript
// src/modules/<feature>/<feature>.validation.ts
export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
});
```

### Step 3 — Controller with OpenAPI JSDoc
```typescript
/**
 * @openapi
 * /items:
 *   post:
 *     tags: [Items]
 *     summary: Create a new item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *     responses:
 *       201: { description: Item created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
async createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await itemService.create(req.body);
    sendCreated(res, item, 'Item created');
  } catch (err) {
    next(err);
  }
}
```

### Step 4 — Route with Middleware Chain
```typescript
router.post(
  '/',
  authenticate,                        // JWT check
  authorize(Role.ADMIN),              // optional role check
  validate({ body: createItemSchema }), // Zod validation
  itemController.createItem.bind(itemController),
);
```

## OpenAPI Best Practices
- Every endpoint needs `@openapi` JSDoc
- Document ALL response codes including 401, 403, 400
- Use `security: []` to mark public endpoints explicitly
- Keep descriptions concise — one sentence

## Common Mistakes
- ❌ Missing `security` annotation on protected routes
- ❌ No `validate()` middleware before controller
- ❌ Using 200 instead of 201 for creation
- ❌ Not documenting error responses
- ❌ Missing `bind(controller)` on route handlers
