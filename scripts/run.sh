#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$REPO_ROOT/apps/bonsai"

if [ ! -d "$APP_DIR/node_modules" ]; then
  printf '%s\n' "Missing dependencies in apps/bonsai/node_modules" >&2
  printf '%s\n' "Run: npm --prefix apps/bonsai install" >&2
  exit 1
fi

cd "$REPO_ROOT"
exec npm --prefix "$APP_DIR" run dev -- "$@"
