#!/usr/bin/env bash
# serve.sh - Development server with live citation preprocessing.
#
# Flow:
#   1. build.sh runs once so generated *.md files are current.
#   2. watchexec watches citation inputs and reruns build.sh on changes.
#   3. zola serve runs in the foreground and reloads generated content.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BUILD_SCRIPT="$ROOT_DIR/build.sh"
CONTENT_DIR="${PERSONA_CONTENT_DIR:-content}"
ZOLA_PORT="${ZOLA_PORT:-}"

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required but was not found in PATH." >&2
    exit 1
  fi
}

require_command zola
require_command pandoc
require_command watchexec

if [[ -z "$ZOLA_PORT" ]]; then
  for port in $(seq 1111 1120); do
    if ! lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      ZOLA_PORT="$port"
      break
    fi
  done
fi

if [[ -z "$ZOLA_PORT" ]]; then
  echo "Error: no available Zola port found in 1111-1120. Set ZOLA_PORT manually." >&2
  exit 1
fi

echo "Initial citation preprocessing..."
bash "$BUILD_SCRIPT"

if [[ -d "$CONTENT_DIR" ]]; then
  echo "Starting citation watcher..."
  watchexec \
    --watch "$CONTENT_DIR" \
    --watch config.toml \
    --watch themes/persona/config.toml \
    --watch themes/persona/theme.toml \
    --watch themes/persona/citation-style \
    --filter "**/*.src.md" \
    --filter "**/*.bib" \
    --filter "**/style.csl" \
    --filter "**/*.csl" \
    --filter "config.toml" \
    --clear \
    --postpone \
    --shell bash \
    "$BUILD_SCRIPT" &
  WATCHER_PID=$!
  trap 'kill "$WATCHER_PID" 2>/dev/null || true' EXIT INT TERM
else
  echo "No $CONTENT_DIR/ directory found; starting Zola without citation watcher."
fi

echo "Starting Zola..."
echo "Serving on http://127.0.0.1:$ZOLA_PORT"
zola serve --port "$ZOLA_PORT"
