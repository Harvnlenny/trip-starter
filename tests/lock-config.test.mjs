import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfig } from '../tools/lock.mjs';

test('parseConfig reads TRIP_NAME and TRIP_SLUG from shell-style config', () => {
  const cfg = 'TRIP_NAME="Taiwan"\nTRIP_SLUG="taiwan-trip"\nGH_USERNAME="alex"\nPAGES_URL=""\n';
  assert.deepEqual(parseConfig(cfg), { name: 'Taiwan', slug: 'taiwan-trip' });
});
