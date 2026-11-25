# API Conventions

## Base URL

```
http://localhost:3000/api/v1/
```

Production: replace `localhost:3000` with your domain.

## URL Conventions

- Kebab-case path segments: `/api/v1/user-profiles/`
- Plural nouns for collections: `/api/v1/users`
- Resource IDs in path: `/api/v1/users/:id`
- Actions as sub-paths: `/api/v1/auth/logout`
- Avoid deeply nested paths — prefer `/api/v1/users/:id/profile` maximum one level deep

## HTTP Methods

| Method | Semantics | Idempotent |
|--------|-----------|-----------|
| GET | Read resource(s) | Yes |
| POST | Create resource or trigger action | No |
| PUT | Full replacement | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resource | Yes |

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... },
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "requestId": "550e8400...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "fieldErrors": {
      "email": ["Invalid email format"],
      "password": ["Must contain at least one uppercase letter"]
    }
  },
  "requestId": "550e8400...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful read or update |
| 201 | Created | Successful resource creation |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Validation error (Zod) |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (email, username) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Database or critical dependency down |

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod schema failed |
| `UNAUTHORIZED` | 401 | Missing/invalid/expired JWT |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate record |
| `TOO_MANY_REQUESTS` | 429 | Rate limited |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

## Authentication

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

The access token is returned from `/api/v1/auth/login` and `/api/v1/auth/refresh`.

## Pagination

Query parameters:
- `?page=1` (default: 1)
- `?limit=20` (default: 20, max: 100)

## Filtering

Supported on the users list endpoint:
- `?search=john` — filter by email or username (case-insensitive)
- `?role=ADMIN` — filter by role
- `?isActive=true` — filter by active status

## Request ID

Every response includes `X-Request-ID` header and `requestId` in the response body. Use this for log correlation and support tickets.

## Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1735689600
```
