import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HERO_TIMELINE, HERO_EXIT, HERO_SCROLL, heroRange, heroVisibility, heroJourneyProgress, logoStartPose, logoPose, logoRenderPose, followProgress, staggerWindow } from './hero-timeline.ts';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`);

test('logo starts centered and docks exactly in the measured slot across viewport sizes', () => {
  for (const [width, height, slotWidth, centerWidth] of [[1440, 900, 226, 671], [1024, 768, 200, 512], [768, 1024, 200, 560], [390, 844, 190, 334]]) {
    for (const scrollOffset of [0, -200]) {
      const stage = { left: 0, top: scrollOffset, width, height };
      const slot = { left: width > 768 ? 64 : 24, top: scrollOffset + 20, width: slotWidth, height: slotWidth * 153 / 574 };
      const start = logoStartPose(stage, slot, centerWidth);
      const initial = logoPose(0, start);
      close(slot.left + initial.x + slot.width * initial.scale / 2, width / 2);
      close(slot.top + initial.y + slot.height * initial.scale / 2, scrollOffset + height / 2);
      assert.deepEqual(logoPose(1, start), { x: 0, y: 0, scale: 1 });
      assert.deepEqual(logoPose(2, start), { x: 0, y: 0, scale: 1 });
      const forward = Array.from({ length: 101 }, (_, i) => logoPose(i / 100, start));
      for (let i = 100; i >= 0; i--) assert.deepEqual(logoPose(i / 100, start), forward[i]);
      for (let i = 1; i <= 100; i++) {
        assert.ok(forward[i].scale <= forward[i - 1].scale);
        assert.ok(forward[i].y <= forward[i - 1].y);
      }
    }
  }
});

test('full-size logo painting preserves the complete journey without scaling the image above 1', () => {
  for (const [slotWidth, centerWidth] of [[226, 671], [200, 512], [200, 560], [190, 334], [226, 180]]) {
    const start = { x: 320, y: 350, scale: centerWidth / slotWidth };
    const renderWidth = slotWidth * Math.max(1, start.scale);
    for (let step = 0; step <= 100; step++) {
      const progress = step / 100;
      const original = logoPose(progress, start);
      const rendered = logoRenderPose(progress, start);
      assert.ok(rendered.scale > 0 && rendered.scale <= 1);
      close(rendered.x, original.x);
      close(rendered.y, original.y);
      close(renderWidth * rendered.scale, slotWidth * original.scale);
    }
    close(renderWidth * logoRenderPose(0, start).scale, centerWidth);
    close(renderWidth * logoRenderPose(1, start).scale, slotWidth);
  }
});

test('existing frame progression and reading hold are preserved', () => {
  const end = HERO_SCROLL.scrollDistance / (HERO_SCROLL.scrollDistance + HERO_SCROLL.holdDistance);
  close(end, .8);
  close(heroJourneyProgress(0), 0);
  close(heroJourneyProgress(.4), .5);
  for (const p of [end, .9, 1]) {
    assert.equal(heroJourneyProgress(p), 1);
    assert.deepEqual(heroVisibility(heroJourneyProgress(p)), { header: true, content: true, actions: true, hint: false, benefits: true });
  }
});

test('content begins at 70% while navigation waits until the logo approaches its slot', () => {
  assert.equal(HERO_TIMELINE.content[0], .7);
  assert.equal(HERO_TIMELINE.title[0], .7);
  assert.ok(HERO_TIMELINE.header[0] >= .8);
  for (let i = 0; i <= 100; i++) {
    const p = i / 100, gate = heroVisibility(p);
    if (gate.header) assert.equal(heroRange(p, ...HERO_TIMELINE.header), 1);
    if (gate.actions) assert.equal(heroRange(p, ...HERO_TIMELINE.actions), 1);
    if (p <= .7) assert.equal(gate.content, false);
  }
});

test('smoothing is independent of frame rate and never overshoots either direction', () => {
  for (const fps of [30, 60, 120]) {
    let value = 0;
    for (let i = 0; i < fps; i++) value = followProgress(value, 1, 1 / fps, .19);
    close(value, 1 - Math.exp(-1 / .19));
    for (let i = 0; i < fps; i++) {
      const next = followProgress(value, 0, 1 / fps, .19);
      assert.ok(next >= 0 && next <= value);
      value = next;
    }
  }
  assert.equal(followProgress(.3, 1, .016, 0), 1);
  assert.equal(followProgress(.7, 0, .016, 0), 0);
});

test('word staggering preserves reading order and completes inside each content range', () => {
  for (const [name, count] of [['title', 7], ['description', 12]]) {
    const [start, end] = HERO_TIMELINE[name];
    const windows = Array.from({ length: count }, (_, i) => staggerWindow(start, end, i, count));
    close(windows[0][0], start);
    close(windows.at(-1)[1], end);
    for (let i = 0; i < count; i++) {
      const [from, to] = windows[i];
      assert.ok(from >= .7 && to <= 1);
      assert.equal(heroRange(.7, from, to), 0);
      assert.equal(heroRange(1, from, to), 1);
      if (i) {
        assert.ok(from > windows[i - 1][0]);
        assert.ok(from < windows[i - 1][1]);
      }
    }
  }
});

test('the lower Hero content leaves before each title line', () => {
  assert.ok(HERO_EXIT.benefits[0] < HERO_EXIT.actions[0]);
  assert.ok(HERO_EXIT.actions[0] < HERO_EXIT.description[0]);
  assert.ok(HERO_EXIT.description[0] < HERO_EXIT.title[0]);
  for (const count of [3, 4]) {
    const lines = Array.from({ length: count }, (_, line) => staggerWindow(...HERO_EXIT.title, count - 1 - line, count));
    for (let line = 1; line < count; line++) assert.ok(lines[line][0] < lines[line - 1][0]);
    assert.ok(lines[0][1] < HERO_EXIT.complete);
  }
  assert.equal(heroVisibility(1, .34).benefits, true);
  assert.equal(heroVisibility(1, .37).benefits, false);
  assert.equal(heroVisibility(1, .37).actions, true);
  assert.equal(heroVisibility(1, .39).actions, false);
  assert.equal(heroVisibility(1, HERO_EXIT.complete).content, false);
});
