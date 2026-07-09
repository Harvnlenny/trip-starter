#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp)"; printf 'TRIP_NAME="X"\nTRIP_SLUG="nope-trip"\nGH_USERNAME=""\nPAGES_URL=""\n' > "$ROOT/trip.config"
out="$(bash "$ROOT/tools/publish.sh" 2>&1)"; rc=$?
rm -f "$ROOT/trip.config" "$tmp"
if [ "$rc" -ne 0 ] && printf '%s' "$out" | grep -q 'Run setup-trip.sh first'; then
  echo "publish guard OK"; exit 0
fi
echo "FAIL: expected guard error, got rc=$rc out=$out"; exit 1
