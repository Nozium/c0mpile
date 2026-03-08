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

# Agent Chat requires claude CLI in PATH
if ! command -v claude &>/dev/null; then
  printf '\033[33m%s\033[0m\n' "[warn] claude CLI not found in PATH — Agent Chat will return fallback responses"
else
  printf '\033[32m%s\033[0m\n' "[ok] claude CLI detected — Agent Chat is live"
fi

printf '%s\n' ""
printf '%s\n' "  BONSAI — Constitutional Product Allocation"
printf '%s\n' "  ─────────────────────────────────────────"
printf '%s\n' "  Frontend + API : Next.js (includes /api/agent-chat)"
printf '%s\n' "  Agent backend  : claude -p (local, via Next.js API route)"
printf '%s\n' ""

cd "$REPO_ROOT"
exec npm --prefix "$APP_DIR" run dev -- "$@"
