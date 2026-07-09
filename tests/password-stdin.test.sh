#!/usr/bin/env bash
# Verifies lock.mjs's stdin password mode (used by automation): reads two
# password lines from stdin when TRIP_PAGE_PW_FROM_STDIN is set, encrypts the
# page, and enforces match + minimum length. Does NOT exercise the GUI path.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cleanup(){ rm -f "$ROOT/trip.config"; rm -rf "$ROOT/../pwtest-trip-page"; }
trap cleanup EXIT
fail=0

printf 'TRIP_NAME="PwTest"\nTRIP_SLUG="pwtest-trip"\nGH_USERNAME=""\nPAGES_URL=""\n' > "$ROOT/trip.config"

out="$(printf 'hunter2\nhunter2\n' | TRIP_PAGE_PW_FROM_STDIN=1 node "$ROOT/tools/lock.mjs" 2>&1)"; rc=$?
if [ $rc -eq 0 ] && [ -f "$ROOT/../pwtest-trip-page/index.html" ] \
   && grep -qi "Enter the password" "$ROOT/../pwtest-trip-page/index.html"; then
  echo "  PASS: stdin password -> encrypted page produced"
else
  echo "  FAIL: stdin password path (rc=$rc): $out"; fail=1
fi

out="$(printf 'aaaaaa\nbbbbbb\n' | TRIP_PAGE_PW_FROM_STDIN=1 node "$ROOT/tools/lock.mjs" 2>&1)"; rc=$?
if [ $rc -ne 0 ] && printf '%s' "$out" | grep -qi "do not match"; then
  echo "  PASS: mismatched passwords rejected"
else
  echo "  FAIL: mismatch not rejected (rc=$rc): $out"; fail=1
fi

out="$(printf 'abc\nabc\n' | TRIP_PAGE_PW_FROM_STDIN=1 node "$ROOT/tools/lock.mjs" 2>&1)"; rc=$?
if [ $rc -ne 0 ] && printf '%s' "$out" | grep -qi "6 characters"; then
  echo "  PASS: too-short password rejected"
else
  echo "  FAIL: short password not rejected (rc=$rc): $out"; fail=1
fi

[ "$fail" = 0 ] && echo "password-stdin OK"
exit "$fail"
