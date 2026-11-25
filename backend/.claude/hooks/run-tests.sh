#!/usr/bin/env bash
# Claude Code hook: run unit tests after code changes
# Only runs unit tests (fast, no DB required) — not the full suite

set -euo pipefail

# Only run if vitest is available
if [ ! -f "node_modules/.bin/vitest" ]; then
  exit 0
fi

# Only run if unit tests exist
if [ ! -d "tests/unit" ]; then
  exit 0
fi

echo "🧪 Running unit tests..."
OUTPUT=$(npx vitest run tests/unit --reporter=verbose 2>&1 | tail -30 || true)

echo "$OUTPUT"

# Check for failures
if echo "$OUTPUT" | grep -q "FAIL\|failed"; then
  echo ""
  echo "⚠️  Some unit tests failed — run 'npm test' for details"
fi

# Always exit 0 — tests are advisory in hook context
exit 0
