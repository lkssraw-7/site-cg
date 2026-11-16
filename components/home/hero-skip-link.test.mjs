import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindHeroSkipLink } from './hero-skip-link.ts';

function click(options = {}) {
  const event = new Event('click', { cancelable: true });
  Object.assign(event, { button: 0, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...options });
  return event;
}

test('focus on main or the globe never triggers Hero seeking; explicit skip still does', () => {
  const link = new EventTarget(), main = new EventTarget(), globe = new EventTarget();
  let seeks = 0;
  const cleanup = bindHeroSkipLink(link, () => seeks++);
  main.dispatchEvent(new Event('focus'));
  globe.dispatchEvent(new Event('focus'));
  globe.dispatchEvent(click());
  link.dispatchEvent(new Event('focus'));
  assert.equal(seeks, 0);
  const mouse = click(); link.dispatchEvent(mouse);
  assert.equal(seeks, 1); assert.equal(mouse.defaultPrevented, true);
  const keyboard = click({ detail: 0 }); link.dispatchEvent(keyboard);
  assert.equal(seeks, 2); assert.equal(keyboard.defaultPrevented, true);
  cleanup(); link.dispatchEvent(click());
  assert.equal(seeks, 2);
});

test('modified, secondary and already-handled skip activations keep native behavior', () => {
  const link = new EventTarget(); let seeks = 0;
  const cleanup = bindHeroSkipLink(link, () => seeks++);
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { button: 1 }]) {
    const event = click(options); link.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
  }
  const handled = click(); handled.preventDefault(); link.dispatchEvent(handled);
  assert.equal(seeks, 0); cleanup();
});
