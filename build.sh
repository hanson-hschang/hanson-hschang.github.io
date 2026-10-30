#!/usr/bin/env bash
# Build from ordinary Markdown using Persona's shared preprocessing pipeline.
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 -B "$ROOT_DIR/themes/persona/scripts/persona.py" build --root "$ROOT_DIR" -- "$@"
