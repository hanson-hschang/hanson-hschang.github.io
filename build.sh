#!/usr/bin/env bash
# build.sh - Pandoc citation preprocessing pipeline
#
# Converts every *.src.md file in content/ into a Zola-renderable *.md file
# by running Pandoc --citeproc on the post body.
#
# CSL priority order (highest to lowest):
#   1. per-post [extra].citation_style -> citation-style/<value>.csl
#   2. local style.csl in the same directory as the .src.md
#   3. config.toml [extra].citation_style -> citation-style/<value>.csl
#   4. theme default in themes/persona/theme.toml or config.toml -> citation-style/<value>.csl
#   5. error: exit 1 when citation processing needs a CSL and none can be resolved

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

THEME_NAME="${PERSONA_THEME_NAME:-persona}"
THEME_DIR="${PERSONA_THEME_DIR:-themes/$THEME_NAME}"
CONTENT_DIR="${PERSONA_CONTENT_DIR:-content}"

CSL_SEARCH_DIRS=(
  "citation-style"
  "$THEME_DIR/citation-style"
  "styles"
  "$THEME_DIR/styles"
)

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required but was not found in PATH." >&2
    exit 1
  fi
}

extract_frontmatter() {
  local file="$1"
  awk '
    /^\+\+\+$/ { count++; next }
    count == 1 { print }
    count >= 2 { exit }
    END { if (count < 2) exit 1 }
  ' "$file"
}

extract_body() {
  local file="$1"
  awk '
    /^\+\+\+$/ { count++; next }
    count >= 2 { print }
    END { if (count < 2) exit 1 }
  ' "$file"
}

toml_string_from_content() {
  local content="$1"
  local table="$2"
  local key="$3"

  printf '%s\n' "$content" | awk -v table="$table" -v key="$key" '
    $0 == "[" table "]" { found = 1; next }
    found && /^\[/ { exit }
    found {
      line = $0
      sub(/[[:space:]]*#.*/, "", line)
      if (line ~ "^[[:space:]]*" key "[[:space:]]*=") {
        sub(/^[^=]*=[[:space:]]*/, "", line)
        sub(/^[[:space:]]*"/, "", line)
        sub(/"[[:space:]]*$/, "", line)
        print line
        exit
      }
    }
  '
}

toml_string_from_file() {
  local file="$1"
  local table="$2"
  local key="$3"

  [[ -f "$file" ]] || return 0
  toml_string_from_content "$(cat "$file")" "$table" "$key"
}

resolve_csl_path() {
  local style="$1"

  [[ -n "$style" ]] || return 1

  if [[ -f "$style" ]]; then
    printf '%s\n' "$style"
    return 0
  fi

  for dir in "${CSL_SEARCH_DIRS[@]}"; do
    if [[ -f "$dir/$style" ]]; then
      printf '%s\n' "$dir/$style"
      return 0
    fi
    if [[ -f "$dir/$style.csl" ]]; then
      printf '%s\n' "$dir/$style.csl"
      return 0
    fi
  done

  return 1
}

resolve_global_csl() {
  local style=""
  local csl_path=""

  style="$(toml_string_from_file "config.toml" "extra" "citation_style")"
  if [[ -n "$style" ]]; then
    csl_path="$(resolve_csl_path "$style" || true)"
    if [[ -n "$csl_path" ]]; then
      printf '%s\n' "$csl_path"
      return 0
    fi
    echo "Error: config.toml [extra].citation_style '$style' does not resolve to a CSL file." >&2
    return 1
  fi

  style="$(toml_string_from_file "config.toml" "extra.$THEME_NAME" "citation_style")"
  if [[ -n "$style" ]]; then
    csl_path="$(resolve_csl_path "$style" || true)"
    if [[ -n "$csl_path" ]]; then
      printf '%s\n' "$csl_path"
      return 0
    fi
    echo "Error: config.toml [extra.$THEME_NAME].citation_style '$style' does not resolve to a CSL file." >&2
    return 1
  fi

  style="$(toml_string_from_file "$THEME_DIR/theme.toml" "extra" "citation_style")"
  if [[ -n "$style" ]]; then
    csl_path="$(resolve_csl_path "$style" || true)"
    if [[ -n "$csl_path" ]]; then
      printf '%s\n' "$csl_path"
      return 0
    fi
    echo "Error: $THEME_DIR/theme.toml [extra].citation_style '$style' does not resolve to a CSL file." >&2
    return 1
  fi

  style="$(toml_string_from_file "$THEME_DIR/config.toml" "extra.$THEME_NAME" "citation_style")"
  if [[ -n "$style" ]]; then
    csl_path="$(resolve_csl_path "$style" || true)"
    if [[ -n "$csl_path" ]]; then
      printf '%s\n' "$csl_path"
      return 0
    fi
    echo "Error: $THEME_DIR/config.toml [extra.$THEME_NAME].citation_style '$style' does not resolve to a CSL file." >&2
    return 1
  fi

  echo "Error: no valid citation_style found." >&2
  echo "Set [extra].citation_style in config.toml or provide style.csl beside the .src.md file." >&2
  return 1
}

process_source() {
  local src="$1"
  local dir
  local out
  local frontmatter
  local post_style
  local post_bib
  local bibliography
  local csl_path=""
  local body_tmp
  local rendered_tmp

  dir="$(dirname "$src")"
  out="${src%.src.md}.md"

  echo "Processing $src"

  if ! frontmatter="$(extract_frontmatter "$src")"; then
    echo "Error: $src must contain TOML front matter delimited by +++." >&2
    return 1
  fi

  body_tmp="$(mktemp)"
  rendered_tmp="$(mktemp)"
  trap 'rm -f "$body_tmp" "$rendered_tmp"' RETURN

  if ! extract_body "$src" > "$body_tmp"; then
    echo "Error: could not extract Markdown body from $src." >&2
    return 1
  fi

  post_bib="$(toml_string_from_content "$frontmatter" "extra" "bibliography")"
  bibliography="$dir/${post_bib:-references.bib}"

  if [[ -f "$bibliography" ]]; then
    post_style="$(toml_string_from_content "$frontmatter" "extra" "citation_style")"

    if [[ -n "$post_style" ]]; then
      csl_path="$(resolve_csl_path "$post_style" || true)"
      if [[ -z "$csl_path" ]]; then
        echo "Error: $src [extra].citation_style '$post_style' does not resolve to a CSL file." >&2
        return 1
      fi
    elif [[ -f "$dir/style.csl" ]]; then
      csl_path="$dir/style.csl"
    else
      csl_path="$(resolve_global_csl)"
    fi

    pandoc \
      --citeproc \
      --bibliography="$bibliography" \
      --csl="$csl_path" \
      --metadata link-citations=true \
      --metadata reference-section-title=Bibliography \
      --mathjax \
      --wrap=none \
      -t html \
      -f markdown \
      "$body_tmp" \
      -o "$rendered_tmp"

    LC_ALL=C LANG=C perl -0777 -pi -e \
      's|<h1 class="unnumbered"([^>]*)>(.*?)</h1>\n(<div id="refs"[^>]*>)|$3\n<h2 class="unnumbered"$1>$2</h2>|g' \
      "$rendered_tmp"
  else
    echo "  No bibliography found at $bibliography; rendering without citeproc."
    pandoc --mathjax --wrap=none -t html -f markdown "$body_tmp" -o "$rendered_tmp"
  fi

  {
    printf '%s\n' '+++'
    printf '%s\n' "$frontmatter"
    printf '%s\n\n' '+++'
    cat "$rendered_tmp"
  } > "$out"

  if [[ -n "$csl_path" ]]; then
    echo "  [$csl_path] -> $out"
  else
    echo "  -> $out"
  fi
}

require_command pandoc

if [[ ! -d "$CONTENT_DIR" ]]; then
  echo "No $CONTENT_DIR/ directory found; skipping citation preprocessing."
  exit 0
fi

found_sources=0
while IFS= read -r src; do
  found_sources=1
  process_source "$src"
done < <(find "$CONTENT_DIR" -name "*.src.md" -type f | sort)

if [[ "$found_sources" -eq 0 ]]; then
  echo "No *.src.md files found under $CONTENT_DIR/; skipping citation preprocessing."
  exit 0
fi

echo "Citation preprocessing complete."
