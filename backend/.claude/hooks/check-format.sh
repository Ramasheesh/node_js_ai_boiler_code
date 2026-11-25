#!/usr/bin/env bash
# Claude Code hook: check Prettier formatting after file writes
# Reports formatting issues but does NOT auto-fix (advisory only)

set -euo pipefail

# Only run if prettier is available
if [ ! -f "node_modules/.bin/prettier" ]; then
  exit 0
fi

# Only run if config exists
if [ ! -f "prettier.config.js" ] && [ ! -f ".prettierrc" ] && [ ! -f ".prettierrc.json" ]; then
  exit 0
fi

# Check TypeScript files
UNFORMATTED=$(npx prettier --check "src/**/*.ts" "tests/**/*.ts" 2>&1 | grep "\[warn\]" | head -5 || true)

if [ -n "$UNFORMATTED" ]; then
  echo "⚠️  Formatting issues detected in:"
  echo "$UNFORMATTED"
  echo ""
  echo "   Run: npm run format"
fi

# Always exit 0 — formatting is advisory, not blocking in hook context
exit 0
