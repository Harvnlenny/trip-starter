#!/usr/bin/env bash
# Guided one-time setup for a trip. Creates the private working repo and the
# public encrypted-page repo, then wires up trip.config. Safe to re-run.
set -euo pipefail

slugify() {
  local s
  s="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed -E 's/^-+|-+$//g')"
  case "$s" in
    *-trip|trip) : ;;
    *) s="${s}-trip" ;;
  esac
  printf '%s' "$s"
}

main() {
  local ROOT CFG PARENT SITE
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  CFG="$ROOT/trip.config"
  [ -f "$CFG" ] && { # shellcheck disable=SC1090
    source "$CFG"; }

  if [ -z "${TRIP_NAME:-}" ]; then read -r -p "Trip name (e.g. a destination or dates): " TRIP_NAME; fi
  TRIP_SLUG="$(slugify "$TRIP_NAME")"
  if [ -z "${GH_USERNAME:-}" ]; then read -r -p "Your GitHub username: " GH_USERNAME; fi
  PAGES_URL="https://${GH_USERNAME}.github.io/${TRIP_SLUG}-page/"

  cat > "$CFG" <<EOF
TRIP_NAME="$TRIP_NAME"
TRIP_SLUG="$TRIP_SLUG"
GH_USERNAME="$GH_USERNAME"
PAGES_URL="$PAGES_URL"
EOF
  echo "Wrote trip.config for '$TRIP_NAME' ($TRIP_SLUG)."

  if ! command -v gh >/dev/null 2>&1; then
    echo "GitHub CLI (gh) not found. Install it and run 'gh auth login', then re-run this script."
    exit 1
  fi

  # Private working repo (this folder)
  if ! gh repo view "$GH_USERNAME/$TRIP_SLUG" >/dev/null 2>&1; then
    ( cd "$ROOT"; git init -q 2>/dev/null || true; git add -A; git commit -qm "Initial trip repo" 2>/dev/null || true )
    gh repo create "$GH_USERNAME/$TRIP_SLUG" --private --source="$ROOT" --remote=origin --push
    echo "Created private repo $GH_USERNAME/$TRIP_SLUG."
  else
    echo "Private repo $GH_USERNAME/$TRIP_SLUG already exists — skipping."
  fi

  # Public encrypted-page sibling
  PARENT="$(cd "$ROOT/.." && pwd)"
  SITE="$PARENT/${TRIP_SLUG}-page"
  if [ ! -d "$SITE" ]; then
    mkdir -p "$SITE"
    printf '<!doctype html><meta charset="utf-8"><title>%s</title><p>Publishing…</p>\n' "$TRIP_NAME" > "$SITE/index.html"
    ( cd "$SITE"; git init -q; git add -A; git commit -qm "Init site" )
  fi
  if ! gh repo view "$GH_USERNAME/${TRIP_SLUG}-page" >/dev/null 2>&1; then
    gh repo create "$GH_USERNAME/${TRIP_SLUG}-page" --public --source="$SITE" --remote=origin --push
    gh api -X POST "repos/$GH_USERNAME/${TRIP_SLUG}-page/pages" \
      -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
      || echo "Note: enable GitHub Pages (main / root) in the ${TRIP_SLUG}-page repo settings."
    echo "Created public site repo $GH_USERNAME/${TRIP_SLUG}-page."
  else
    echo "Public repo $GH_USERNAME/${TRIP_SLUG}-page already exists — skipping."
  fi

  echo "Setup complete. After you publish, the page will be at: $PAGES_URL"
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then main "$@"; fi
