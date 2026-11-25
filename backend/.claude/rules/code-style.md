---
description: TypeScript and code style rules for all source files
globs: ["src/**/*.ts", "tests/**/*.ts"]
---

# Code Style Rules

## TypeScript
- Strict mode is mandatory — never disable strict checks
- No implicit `any` — all types must be explicit
- Prefer `const` over `let`; never use `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Use `satisfies` for type-safe object literals with Prisma select objects
- Prefer `type` for plain data shapes, `interface` for extensible contracts

## Functions
- All exported functions need explicit return types
- Keep functions under 40 lines — extract helpers if needed
- Single responsibility — one function, one job
- Pure functions preferred for utilities

## Naming Conventions
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Booleans: prefix with `is`, `has`, `should`, `can`

## Imports
- Use `.js` extension for all local imports
- Order: node built-ins → external packages → internal `src/` modules
- No wildcard imports (`import * as`)
- Express Router files use default export; everything else uses named exports

## Comments
- JSDoc `/** */` for all exported public APIs
- Inline comments explain WHY not WHAT
- OpenAPI `@openapi` JSDoc on every controller method
- No TODO/FIXME comments in production code

## Formatting
- Prettier enforced: single quotes, 2 spaces, 100 char line width, LF line endings
- Run `npm run format` to fix; `npm run format:check` to verify
