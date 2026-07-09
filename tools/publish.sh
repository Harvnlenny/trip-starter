#!/usr/bin/env bash
# Re-encrypts the trip page with your password and publishes it to the public site repo.
# Run whenever you update index.html (or want to change the password).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$ROOT/trip.config" ] || { echo "No trip.config. Run setup-trip.sh first."; exit 1; }
# shellcheck disable=SC1091
source "$ROOT/trip.config"
SITE="$ROOT/../${TRIP_SLUG}-page"
[ -d "$SITE" ] || { echo "Site repo missing at $SITE. Run setup-trip.sh first."; exit 1; }

echo "Encrypting the trip page — your password stays on this machine."
node "$ROOT/tools/lock.mjs"

cd "$SITE"
git add index.html
if git commit -m "Update encrypted trip page" 2>/dev/null; then
  git push
  echo "Done. Live in ~1 minute at ${PAGES_URL:-your GitHub Pages URL}."
else
  echo "No changes to publish."
fi
