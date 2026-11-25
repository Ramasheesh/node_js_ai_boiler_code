---
description: REST API conventions — response formats, status codes, routing
globs: ["src/modules/**/*.ts", "src/routes/**/*.ts"]
---

# API Conventions

## URL Structure
- Base: `/api/v1/`
- Kebab-case path segments: `/api/v1/user-profiles/`
- Resource IDs: `/api/v1/users/:id`
- Actions on resources: `/api/v1/auth/logout`

## HTTP Methods
- `GET` — read (no side effects)
- `POST` — create or action
- `PUT` — full replacement
- `PATCH` — partial update
- `DELETE` — remove

## Response Formats

### Success (200/201)
```json
{ "success": true, "message": "Description", "data": {}, "requestId": "uuid", "timestamp": "ISO-8601" }
```

### Paginated (200)
```json
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5, "hasNext": true, "hasPrev": false }, "timestamp": "ISO-8601" }
```

### Error (4xx/5xx)
```json
{ "success": false, "message": "Human-readable", "code": "ERROR_CODE", "details": {}, "requestId": "uuid", "timestamp": "ISO-8601" }
```

## HTTP Status Codes
| Code | When |
|------|------|
| 200 | Successful read or update |
| 201 | Successful creation |
| 204 | Successful delete (no body) |
| 400 | Validation error |
| 401 | Missing or invalid authentication |
| 403 | Authenticated but insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limited |
| 500 | Unexpected server error |
| 503 | Service unavailable (DB/Redis down) |

## Validation
- All inputs validated with Zod in `*.validation.ts` files
- Use the `validate({ body, query, params })` middleware in routes
- Return 400 with Zod field-level errors in `details`

## OpenAPI Documentation
- Every controller method needs `@openapi` JSDoc
- Document request body, parameters, and all response codes
- Swagger UI available at `/api-docs` (dev/staging only)

## Pagination
- Query params: `?page=1&limit=20`
- Max limit: 100
- Use `parsePagination(req)` and `buildPaginationMeta()` from `src/shared/utils/`
