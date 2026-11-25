#!/usr/bin/env bash
# Claude Code hook: detect accidental secret exposure in TypeScript source files
# Scans for common secret patterns before allowing changes to be committed

set -euo pipefail

FOUND=0
SCANNED=0

# Patterns to detect (case-insensitive where appropriate)
declare -a PATTERNS=(
  'password\s*=\s*["'"'"'][^"'"'"'$\{]'
  'secret\s*=\s*["'"'"'][^"'"'"'$\{]'
  'api[_-]?key\s*=\s*["'"'"'][^"'"'"'$\{]'
  'private[_-]?key\s*=\s*["'"'"'][^"'"'"'$\{]'
  'access[_-]?token\s*=\s*["'"'"'][^"'"'"'$\{]'
  'AKIA[0-9A-Z]{16}'
  'ghp_[a-zA-Z0-9]{36}'
  'sk-[a-zA-Z0-9]{48}'
  'xoxb-[0-9]+-[a-zA-Z0-9]+'
)

# Scan only TypeScript source files (not test fixtures, not node_modules)
while IFS= read -r -d '' file; do
  SCANNED=$((SCANNED + 1))
  for pattern in "${PATTERNS[@]}"; do
    if grep -qiE "$pattern" "$file" 2>/dev/null; then
      echo "⚠️  Potential secret in: $file"
      grep -niE "$pattern" "$file" | head -3 | sed 's/^/   /'
      FOUND=1
      break
    fi
  done
done < <(find src -name "*.ts" -not -path "*/node_modules/*" -type f -print0 2>/dev/null)

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "❌ Secret scan failed — review flagged files"
  echo "   Use environment variables instead of hardcoded values"
  echo "   Access config via: import { env } from './config/env.js'"
  exit 1
fi

exit 0
