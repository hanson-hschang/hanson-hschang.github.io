#!/usr/bin/env bash
# Watch source files and preview the same processed site used for deployment.
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -n "${ZOLA_PORT:-}" ]]; then
  set -- --port "$ZOLA_PORT" "$@"
fi
exec python3 -B "$ROOT_DIR/themes/persona/scripts/persona.py" serve --root "$ROOT_DIR" -- "$@"
