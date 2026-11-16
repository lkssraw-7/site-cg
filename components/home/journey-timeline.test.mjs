import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JOURNEY, chapterAt, chapterDestination, chapterVisual, interactiveChapter } from './journey-timeline.ts';

test('all chapter shortcuts land on a fully readable, interactive plateau', () => {
  for (let i = 0; i < 3; i++) {
    const p = chapterDestination(i);
    assert.equal(chapterAt(p), i);
    assert.equal(interactiveChapter(p), i);
    assert.equal(chapterVisual(p, i).opacity, 1);
    assert.equal(chapterVisual(p, i).y, 0);
  }
});
test('endpoints hold first and last content, with native-scroll overshoot clamped', () => {
  assert.equal(interactiveChapter(-1), 0);
  assert.equal(interactiveChapter(2), 2);
  assert.equal(chapterVisual(0, 0).opacity, 1);
  assert.equal(chapterVisual(1, 2).opacity, 1);
});
test('both transition boundaries preserve a background and suppress invisible controls', () => {
  for (const b of JOURNEY.boundaries.slice(1, -1)) {
    assert.equal(interactiveChapter(b), -1);
    for (const d of [-.075, -.055, -.025, 0, .025, .055, .075]) {
      const p = b + d;
      const scenes = [0, 1, 2].map(i => chapterVisual(p, i));
      assert.equal(scenes[0].backgroundOpacity, 1);
      assert.ok(scenes.filter(s => s.opacity >= .75).length <= 1);
      for (const scene of scenes) {
        assert.ok(scene.opacity >= 0 && scene.opacity <= 1);
        assert.ok(scene.backgroundOpacity >= 0 && scene.backgroundOpacity <= 1);
        assert.ok(Number.isFinite(scene.y));
        assert.ok(scene.scale >= 1 && scene.scale <= 1.045);
      }
    }
  }
});
test('forward, reverse and fast jumps produce the same composition at every position', () => {
  const samples = Array.from({ length: 1001 }, (_, i) => i / 1000);
  const composition = p => [chapterAt(p), interactiveChapter(p), ...[0, 1, 2].map(i => chapterVisual(p, i))];
  const forward = new Map(samples.map(p => [p, composition(p)]));
  for (const p of [...samples].reverse()) assert.deepEqual(composition(p), forward.get(p));
  for (const p of [.9, .1, .55, .33, .85, 0, 1, .5]) assert.deepEqual(composition(p), forward.get(p));
});
