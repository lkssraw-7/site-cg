import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESENCE_TRANSITION_VH, heroProgressWithoutExit, heroProgressWithExit, presenceTransition } from './presence-transition.ts';
import { HERO_SCROLL, heroJourneyProgress } from './hero-timeline.ts';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);
const originalScrollVh = (HERO_SCROLL.scrollDistance + HERO_SCROLL.holdDistance) * 100;

test('the additional sticky tail preserves video and logo progress at the same physical scroll positions', () => {
  for (const height of [700, 768, 844, 900, 1080, 1440]) {
    const originalDistance = originalScrollVh / 100 * height;
    const extendedDistance = (originalScrollVh + PRESENCE_TRANSITION_VH) / 100 * height;
    for (let scroll = 0; scroll <= extendedDistance; scroll += 7) {
      const previous = heroJourneyProgress(scroll / originalDistance);
      const current = heroJourneyProgress(heroProgressWithoutExit(scroll / extendedDistance, originalScrollVh, PRESENCE_TRANSITION_VH));
      close(current, previous);
      if (scroll >= originalDistance) assert.equal(current, 1);
    }
  }
});

test('keyboard skip and explicit seeking still land at their original document positions', () => {
  for (const exit of [0, PRESENCE_TRANSITION_VH]) {
    for (const progress of [0, .2, .56, .8, 1]) {
      const mapped = heroProgressWithExit(progress, originalScrollVh, exit);
      close(mapped * (originalScrollVh + exit), progress * originalScrollVh);
      close(heroProgressWithoutExit(mapped, originalScrollVh, exit), progress);
    }
  }
});

test('the light panel enters from below and covers the pinned Hero in half a viewport without a gap', () => {
  for (const height of [700, 768, 844, 900, 1080, 1440]) {
    const heroHeight = (100 + originalScrollVh + PRESENCE_TRANSITION_VH) / 100 * height;
    const presenceTop = heroHeight - height; // CSS margin-top: -100svh.
    const start = originalScrollVh / 100 * height;
    const end = presenceTop;
    close(end - start, height * .5);
    let previousTop = Infinity;
    for (let step = 0; step <= 100; step++) {
      const scroll = start + (end - start) * step / 100;
      const viewportProgress = (scroll - presenceTop + height) / height;
      const frame = presenceTransition(viewportProgress);
      const panelTop = presenceTop - scroll + frame.panelYVh / 100 * height;
      assert.ok(panelTop <= previousTop + 1e-8);
      assert.ok(panelTop >= -1e-8 && panelTop <= height + 1e-8);
      if (step === 0) close(panelTop, height);
      if (step === 100) close(panelTop, 0);
      previousTop = panelTop;
    }
  }
});

test('globe leads the copy, all values remain bounded, and reverse scroll reproduces every pose', () => {
  const beginning = presenceTransition(.5);
  assert.equal(beginning.globeOpacity, 0);
  assert.equal(beginning.globeScale, .96);
  const globeFirst = presenceTransition(.6);
  assert.ok(globeFirst.globeOpacity > 0);
  assert.equal(globeFirst.copyOpacity, 0);
  const forward = Array.from({ length: 101 }, (_, index) => presenceTransition(index / 100));
  for (let index = 100; index >= 0; index--) {
    const frame = presenceTransition(index / 100);
    assert.deepEqual(frame, forward[index]);
    assert.ok(frame.globeScale >= .96 && frame.globeScale <= 1);
    for (const value of [frame.globeOpacity, frame.copyOpacity, frame.overviewOpacity]) assert.ok(value >= 0 && value <= 1);
  }
});

test('direct section links and later scroll positions always reveal a complete, stationary section', () => {
  for (const progress of [1, 1.5, 2]) {
    assert.deepEqual(presenceTransition(progress), {
      progress: 1, panelYVh: 0, globeOpacity: 1, globeScale: 1, globeY: 0,
      copyOpacity: 1, copyY: 0, overviewOpacity: 1, overviewY: 0,
    });
  }
});
