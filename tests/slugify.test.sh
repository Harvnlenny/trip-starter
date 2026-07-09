#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/setup-trip.sh"   # sourcing must NOT run main
fail=0
check() { got="$(slugify "$1")"; [ "$got" = "$2" ] || { echo "FAIL slugify('$1')='$got' want '$2'"; fail=1; }; }
check "Taiwan" "taiwan-trip"
check "Taiwan Trip" "taiwan-trip"
check "New York 2027!" "new-york-2027-trip"
check "  Spain   " "spain-trip"
[ "$fail" = 0 ] && echo "slugify tests passed"
exit "$fail"
