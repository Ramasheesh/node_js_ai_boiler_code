#!/usr/bin/env bash
# Claude Code hook: validate TypeScript before tool execution
# Fast check — reports errors but exits 0 to not block non-TS operations

set -euo pipefail

# Only run if TypeScript source exists
if ! find src -name "*.ts" -type f 2>/dev/null | grep -q .; then
  exit 0
fi

# Only run if tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then
  exit 0
fi

# Only run if node_modules installed
if [ ! -d "node_modules" ]; then
  exit 0
fi

# Run TypeScript check (advisory — does not block)
OUTPUT=$(npx tsc --noEmit --skipLibCheck 2>&1 | head -20 || true)

if [ -n "$OUTPUT" ]; then
  echo "⚠️  TypeScript issues detected:"
  echo "$OUTPUT"
  echo ""
  echo "   Run: npm run typecheck for full output"
fi

# Always exit 0 — TypeScript check is advisory in pre-tool hook
exit 0
