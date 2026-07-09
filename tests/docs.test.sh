#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
need() { grep -q "$2" "$ROOT/$1" || { echo "MISSING in $1: $2"; fail=1; }; }
need CLAUDE.md "setup-trip.sh"
need CLAUDE.md "tools/publish.sh"
need CLAUDE.md "TRIP-CONTENT:START"
need CLAUDE.md "docs/"
need CLAUDE.md "never"          # must state the never-expose-plaintext rule
need README.md "setup-trip.sh"
[ "$fail" = 0 ] && echo "docs OK"
exit "$fail"
