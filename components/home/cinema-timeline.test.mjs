import { test } from "node:test";
import assert from "node:assert/strict";
import { CINEMA, cinemaFrame, earthLimb, earthPlacement } from "./cinema-timeline.ts";
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, a + " vs " + b);

test("the same 16 cloud frames crossfade in both directions and both clocks hold when scrolling stops", () => {
  for (let frame = 0; frame <= 15; frame++) {
    const p = CINEMA.cloudIn + frame / 15 * (CINEMA.cloudOut - CINEMA.cloudIn);
    const state = cinemaFrame(p);
    close(state.houseTime * 94 - .5, 78 + frame);
    close(state.cloudTime * 239 - .5, frame);
    assert.deepEqual(cinemaFrame(p), state);
  }
  const forward = Array.from({ length: 1001 }, (_, n) => cinemaFrame(n / 1000));
  for (let n = 1000; n >= 1; n--) {
    assert.deepEqual(cinemaFrame(n / 1000), forward[n]);
    assert.ok(forward[n].houseTime >= forward[n-1].houseTime && forward[n].cloudTime >= forward[n-1].cloudTime);
    assert.ok(forward[n].cloudTime < 1 && forward[n].houseTime < 1);
  }
  close(cinemaFrame(.35).clouds, 0);
  close(cinemaFrame(.45).clouds, 1);
  close(cinemaFrame(.8).cloudFrame, 175);
  close(cinemaFrame(.92).cloudFrame, 238);
  close(cinemaFrame(.426).heroOpacity, 1);
  close(cinemaFrame(.45).heroOpacity, 0);
});

test("the photographed limb stays concentric with the actual globe throughout its dissolve", () => {
  const screens = [
    { width: 1440, height: 900, globeX: 450, globeY: 420, globeRadius: 275 },
    { width: 820, height: 1180, globeX: 410, globeY: 730, globeRadius: 269 },
    { width: 375, height: 667, globeX: 187.5, globeY: 546, globeRadius: 127 },
  ];
  for (const g of screens) {
    for (let n = 0; n <= 100; n++) {
      const p = CINEMA.registered + n / 100 * (1 - CINEMA.registered);
      const f = cinemaFrame(p);
      for (const sourceFrame of [f.cloudFrame, 238]) {
        const limb = earthLimb(sourceFrame);
        const pose = earthPlacement(p, g, f, limb);
        close(pose.x + limb.x * pose.scale, g.globeX);
        close(pose.y + limb.y * pose.scale, g.globeY + pose.globeShift);
        close(limb.r * pose.scale, g.globeRadius);
      }
    }
    close(earthPlacement(1, g).globeShift, 0);
    close(cinemaFrame(CINEMA.registered).dissolve, 0);
    close(cinemaFrame(CINEMA.globeComplete).dissolve, 1);
    close(cinemaFrame(CINEMA.globeComplete).details, 0);
    close(cinemaFrame(1).overview, 1);
  }
});
