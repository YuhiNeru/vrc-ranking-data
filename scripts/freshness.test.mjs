import test from 'node:test';
import assert from 'node:assert/strict';
import {ensureFreshSnapshot} from './freshness.mjs';
const now=Date.parse('2026-10-12T10:00:00Z');
test('Allow an hourly observation and delayed collection',()=>{
  assert.doesNotThrow(()=>ensureFreshSnapshot({observedAt:'2026-10-12T08:00:00Z'},now));
});
test('Fail when observations are stale',()=>{
  assert.throws(()=>ensureFreshSnapshot({observedAt:'2026-10-12T07:29:59Z'},now),/150 minutes/);
});
test('Reject invalid and future timestamps',()=>{
  assert.throws(()=>ensureFreshSnapshot({observedAt:'invalid'},now));
  assert.throws(()=>ensureFreshSnapshot({observedAt:'2026-10-12T10:06:00Z'},now),/future/);
});
