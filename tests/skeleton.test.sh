#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
must_exist() { [ -e "$ROOT/$1" ] || { echo "MISSING: $1"; fail=1; }; }
for f in .gitignore trip.config.example index.html \
         docs/itinerary.md docs/flights.md docs/hotels.md docs/activities.md docs/notes.md; do
  must_exist "$f"
done
grep -q 'TRIP-CONTENT:START' "$ROOT/index.html" || { echo "index.html missing content markers"; fail=1; }
grep -q 'trip.config' "$ROOT/.gitignore" || { echo ".gitignore must ignore trip.config"; fail=1; }
[ "$fail" = 0 ] && echo "skeleton OK"
exit "$fail"
