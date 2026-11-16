import { test } from 'node:test';
import assert from 'node:assert/strict';
import { presenceCountries } from '../../data/global-presence.ts';
import { AMERICAS, focusLocation, nearestAngle, projectLocation, spreadLabels } from './globe-geometry.ts';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('all seven country markers face the visitor in the initial Americas view', () => {
  assert.equal(presenceCountries.length, 7);
  for (const country of presenceCountries) {
    const point = projectLocation(country.location, AMERICAS);
    assert.equal(point.visible, true, country.name);
    assert.ok(point.x > .1 && point.x < .9 && point.y > .1 && point.y < .9);
  }
});

test('selecting every country centers its marker, regardless of longitude or previous turns', () => {
  for (const country of presenceCountries) {
    const focus = focusLocation(country.location);
    for (const turns of [-4, -1, 0, 3]) {
      const adjusted = { ...focus, phi: nearestAngle(focus.phi, turns * Math.PI * 2) };
      const point = projectLocation(country.location, adjusted);
      close(point.x, .5); close(point.y, .5);
      assert.equal(point.visible, true);
      assert.ok(Math.abs(adjusted.phi - turns * Math.PI * 2) <= Math.PI);
    }
  }
});

test('markers on the back are hidden after a half turn', () => {
  for (const country of presenceCountries) {
    const focus = focusLocation(country.location);
    assert.equal(projectLocation(country.location, { phi: focus.phi + Math.PI, theta: -focus.theta }).visible, false);
  }
});

test('desktop and tablet labels stay separated during rotation and country focus', () => {
  const views = [AMERICAS, ...presenceCountries.map(country => focusLocation(country.location)), ...Array.from({ length: 36 }, (_, i) => ({ phi: i / 36 * Math.PI * 2, theta: .2 }))];
  for (const size of [441, 550, 708]) for (const view of views) {
    for (const side of ['left', 'right']) {
      const points = presenceCountries.filter(country => country.side === side).map(country => projectLocation(country.location, view)).filter(point => point.visible);
      const labels = spreadLabels(points, size);
      labels.forEach((point, i) => {
        assert.ok(point.labelY >= .12 && point.labelY <= .88);
        if (i) assert.ok((point.labelY - labels[i - 1].labelY) * size >= 33.999);
      });
    }
  }
});

// Gesture math stays independent of navigation and keeps vertical touch scrolling free.
test('mouse drag rotates both axes; touch rotates horizontally and preserves tilt', async () => {
  const { dragGlobeView } = await import('./globe-geometry.ts');
  for (const size of [342, 550, 708]) {
    assert.deepEqual(dragGlobeView(AMERICAS, 0, 0, size, false), AMERICAS);
    const right = dragGlobeView(AMERICAS, 120, 80, size, false);
    const left = dragGlobeView(AMERICAS, -120, -80, size, false);
    assert.ok(right.phi > AMERICAS.phi && left.phi < AMERICAS.phi);
    assert.ok(right.theta > AMERICAS.theta && left.theta < AMERICAS.theta);
    const touch = dragGlobeView(AMERICAS, 120, 80, size, true);
    close(touch.phi, right.phi); close(touch.theta, AMERICAS.theta);
    close(dragGlobeView(AMERICAS, 0, 100000, size, false).theta, 1.1);
    close(dragGlobeView(AMERICAS, 0, -100000, size, false).theta, -1.1);
  }
});
