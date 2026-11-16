import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createVideoScrubber, videoTimeAtProgress } from './video-scrubbing.ts';

class FakeVideo extends EventTarget {
  duration = NaN;
  readyState = 0;
  seeking = false;
  error = null;
  time = 0;
  writes = [];
  pauses = 0;
  rejectSeek = false;
  get currentTime() { return this.time; }
  set currentTime(time) {
    if (this.rejectSeek) throw new Error('Media not ready');
    this.time = time;
    this.writes.push(time);
    this.seeking = true;
  }
  pause() { this.pauses++; }
  metadata() { this.duration = 10; this.readyState = 1; this.dispatchEvent(new Event('loadedmetadata')); }
  finishSeek() { this.readyState = 2; this.seeking = false; this.dispatchEvent(new Event('seeked')); }
}

function setup() {
  const video = new FakeVideo();
  let id = 0, ready = 0, errors = 0;
  const frames = new Map();
  const controller = createVideoScrubber(video, {
    request(callback) { frames.set(++id, callback); return id; },
    cancel(id) { frames.delete(id); },
  }, { onReady() { ready++; }, onError() { errors++; } });
  const tick = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()); };
  return { video, controller, frames, tick, get ready() { return ready; }, get errors() { return errors; } };
}

test('video time stays within playable bounds in both directions and rejects invalid metadata', () => {
  assert.equal(videoTimeAtProgress(-1, 10), 0);
  assert.equal(videoTimeAtProgress(0, 10), 0);
  assert.equal(videoTimeAtProgress(.5, 10), 4.9995);
  assert.equal(videoTimeAtProgress(1, 10), 9.999);
  assert.equal(videoTimeAtProgress(2, 10), 9.999);
  for (const duration of [0, -1, NaN, Infinity]) assert.equal(videoTimeAtProgress(.8, duration), 0);
  assert.equal(videoTimeAtProgress(NaN, 10), 0);
});

test('a restored scroll position waits for metadata and uses the newest target', () => {
  const s = setup();
  s.controller.setActive(true);
  s.controller.update(.2);
  s.controller.update(.7);
  s.tick();
  assert.deepEqual(s.video.writes, []);
  assert.equal(s.frames.size, 0);
  s.video.metadata(); s.tick();
  assert.deepEqual(s.video.writes, [videoTimeAtProgress(.7, 10)]);
  assert.ok(s.video.pauses > 0);
  s.video.finishSeek(); s.tick();
  assert.equal(s.ready > 0, true);
  assert.equal(s.frames.size, 0);
  assert.equal(s.video.writes.length, 1);
  s.controller.dispose();
});

test('rapid scroll and reversal coalesce without interrupting an in-flight seek or replaying stale targets', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true); s.controller.update(.1); s.tick();
  for (const p of [.3, .8, .95, .6, .25]) s.controller.update(p);
  assert.equal(s.frames.size, 0);
  assert.equal(s.video.writes.length, 1);
  s.video.finishSeek(); s.tick();
  assert.deepEqual(s.video.writes, [videoTimeAtProgress(.1, 10), videoTimeAtProgress(.25, 10)]);
  s.controller.update(0);
  s.video.finishSeek(); s.tick();
  assert.equal(s.video.writes.at(-1), 0);
  s.video.finishSeek(); s.tick();
  assert.equal(s.frames.size, 0);
  s.controller.dispose();
});

test('offscreen or hidden video stops scheduling and resumes at the current scroll position', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true); s.controller.update(.3);
  s.controller.setActive(false);
  assert.equal(s.frames.size, 0);
  s.controller.update(.8); s.tick();
  assert.equal(s.video.writes.length, 0);
  s.controller.setActive(true); s.tick();
  assert.equal(s.video.writes.at(-1), videoTimeAtProgress(.8, 10));
  s.controller.setActive(false); s.controller.update(.2);
  s.video.finishSeek(); s.tick();
  assert.equal(s.video.writes.length, 1);
  s.controller.setActive(true); s.tick();
  assert.equal(s.video.writes.at(-1), videoTimeAtProgress(.2, 10));
  s.controller.dispose();
});

test('small scroll changes within half a video frame do not trigger redundant seeks', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true); s.controller.update(.5); s.tick();
  s.video.finishSeek(); s.controller.update(.5005); s.tick();
  assert.equal(s.video.writes.length, 1);
  assert.equal(s.frames.size, 0);
  s.controller.dispose();
});

test('temporarily rejected seeks wait for new media events instead of spinning', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true);
  s.video.rejectSeek = true; s.controller.update(.7); s.tick();
  assert.equal(s.frames.size, 0);
  assert.equal(s.video.writes.length, 0);
  s.video.rejectSeek = false; s.video.dispatchEvent(new Event('canplay')); s.tick();
  assert.equal(s.video.writes.at(-1), videoTimeAtProgress(.7, 10));
  s.controller.dispose();
});

test('media failures keep the poster fallback and stop scheduling', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true); s.controller.update(.6);
  s.video.dispatchEvent(new Event('error'));
  s.tick(); s.controller.update(.9); s.video.dispatchEvent(new Event('canplay')); s.tick();
  assert.equal(s.errors, 1);
  assert.equal(s.ready, 0);
  assert.equal(s.video.writes.length, 0);
  assert.equal(s.frames.size, 0);
  s.controller.dispose();
});

test('unmount cancels work and removes media event subscriptions', () => {
  const s = setup();
  s.video.metadata(); s.controller.setActive(true); s.controller.update(.4);
  s.controller.dispose();
  s.video.finishSeek(); s.video.dispatchEvent(new Event('error')); s.tick();
  assert.equal(s.frames.size, 0);
  assert.equal(s.video.writes.length, 0);
  assert.equal(s.ready, 0);
  assert.equal(s.errors, 0);
});
