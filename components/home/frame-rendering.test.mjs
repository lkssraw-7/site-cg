import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canvasResolution, framesToEvict, readyFrame, prefetchOrder } from './frame-rendering.ts';

test('Retina output uses 2x resolution at common desktop and mobile sizes', () => {
  assert.deepEqual(canvasResolution(1440, 900, 2), { width: 2880, height: 1800 });
  assert.deepEqual(canvasResolution(390, 844, 3), { width: 780, height: 1688 });
  assert.deepEqual(canvasResolution(1440, 900, 1), { width: 1440, height: 900 });
});

test('large and ultrawide canvases stay within the pixel and texture budgets', () => {
  for (const [w, h] of [[2560, 1440], [3840, 2160], [5120, 1440], [768, 3000], [390, 844], [0, 0]]) {
    const output = canvasResolution(w, h, 3);
    assert.ok(output.width > 0 && output.height > 0);
    assert.ok(output.width <= 4096 && output.height <= 4096);
    assert.ok(output.width * output.height <= (w <= 768 ? 2_000_000 : 8_294_400));
  }
});

test('4K cache releases enough pixels while preserving the visible and requested frames', () => {
  const frames = Array.from({ length: 24 }, (_, index) => ({ index, pixels: 3840 * 2160 }));
  const evicted = framesToEvict(frames, 20, 10, 64_000_000, 5);
  const kept = frames.filter(frame => !evicted.includes(frame.index));
  assert.ok(kept.some(frame => frame.index === 20));
  assert.ok(kept.some(frame => frame.index === 10));
  assert.ok(kept.reduce((sum, frame) => sum + frame.pixels, 0) <= 64_000_000);
  assert.equal(frames.length, 24);
});

test('reverse jumps evict distant frames and respect the smaller mobile budget', () => {
  const frames = Array.from({ length: 24 }, (_, index) => ({ index, pixels: 2560 * 1440 }));
  const evicted = framesToEvict(frames, 4, 20, 20_000_000, 5);
  const kept = frames.filter(frame => !evicted.includes(frame.index));
  assert.ok(kept.some(frame => frame.index === 4));
  assert.ok(kept.some(frame => frame.index === 20));
  assert.ok(kept.every(frame => frame.index === 20 || Math.abs(frame.index - 4) <= 5));
  assert.ok(kept.reduce((sum, frame) => sum + frame.pixels, 0) <= 20_000_000);
});


test('slow image loads advance through available frames instead of freezing for an exact match', () => {
  let visible = 10;
  for (const [ready, expected] of [[[10, 12], 12], [[10, 12, 16], 16], [[16, 19], 19], [[19, 20], 20]]) {
    visible = readyFrame(20, visible, ready);
    assert.equal(visible, expected);
  }
});

test('reversing or jumping never draws past the target or backtracks toward stale loads', () => {
  assert.equal(readyFrame(10, 20, [8, 15, 19, 25]), 15);
  assert.equal(readyFrame(10, 15, [8, 12, 19, 25]), 12);
  assert.equal(readyFrame(10, 12, [8, 19, 25]), 12);
  assert.equal(readyFrame(10, 12, [10, 19]), 10);
  assert.equal(readyFrame(100, 80, [70, 86, 95, 102]), 95);
  assert.equal(readyFrame(100, 95, [92, 102]), 95);
  assert.equal(readyFrame(0, -1, []), -1);
  assert.equal(readyFrame(80, -1, [50, 78, 90]), 78);
});

test('prefetch prioritizes the target and scroll direction with bounded reversible buffers', () => {
  for (const target of [0, 1, 100, 225, 226]) for (const direction of [-1, 1]) {
    const frames = prefetchOrder(target, 227, direction, 10, 4);
    assert.equal(frames[0], target);
    assert.equal(new Set(frames).size, frames.length);
    assert.ok(frames.every(index => index >= 0 && index < 227));
    assert.ok(frames.length <= 15);
  }
  assert.deepEqual(prefetchOrder(100, 227, 1, 3, 1), [100, 101, 99, 102, 103]);
  assert.deepEqual(prefetchOrder(100, 227, -1, 3, 1), [100, 99, 101, 98, 97]);
});
