// The source clips are 1920 × 1080 at 24 fps. Frame centres avoid decoder
// rounding at frame boundaries. The chosen cloud overlap is 78–93 against 0–15.
export const CINEMA = {
  scrollScreens: 5,
  heroEnd: .28,
  cloudIn: .35,
  cloudOut: .45,
  orbitStart: .8,
  registered: .854,
  globeComplete: .92,
} as const;

export const unit = (n: number) => Math.min(1, Math.max(0, n));
const range = (n: number, a: number, b: number) => unit((n - a) / (b - a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function easeRange(n: number, a: number, b: number) {
  const t = range(n, a, b);
  return t * t * (3 - 2 * t);
}

// End velocities are in source frames per unit of scroll. Matching the slopes
// across the cloud overlap keeps both cameras moving when the blend reverses.
function retime(t: number, frames: number, span: number, speedIn: number, speedOut: number) {
  return frames * t * t * (3 - 2 * t)
    + span * (speedIn * t * (1 - t) ** 2 - speedOut * t * t * (1 - t));
}

export function cinemaFrame(p: number) {
  const c = CINEMA;
  const overlap = range(p, c.cloudIn, c.cloudOut);
  const orbit = range(p, c.orbitStart, c.globeComplete);
  const overlapSpeed = 15 / (c.cloudOut - c.cloudIn);
  const houseFrame = retime(range(p, 0, c.cloudIn), 78, c.cloudIn, 200, overlapSpeed) + 15 * overlap;
  const cloudFrame = 15 * overlap
    + retime(range(p, c.cloudOut, c.orbitStart), 160, c.orbitStart - c.cloudOut, overlapSpeed, 800)
    + retime(orbit, 63, c.globeComplete - c.orbitStart, 800, 0);
  return {
    houseTime: (houseFrame + .5) / 94, cloudTime: (cloudFrame + .5) / 239, cloudFrame,
    hero: range(p, 0, c.heroEnd), heroOpacity: 1 - easeRange(p, .426, .45),
    clouds: easeRange(p, c.cloudIn, c.cloudOut), align: easeRange(p, .811, c.registered),
    outsideLimb: 1 - easeRange(p, c.orbitStart, .822),
    space: 1 - easeRange(p, .823, c.globeComplete), dissolve: easeRange(p, c.registered, c.globeComplete),
    globe: easeRange(p, .849, .864), details: easeRange(p, c.globeComplete, .97),
    heading: easeRange(p, .92, .965), description: easeRange(p, .935, .982),
    overview: easeRange(p, .951, 1), settle: easeRange(p, .92, 1),
  };
}

// Measured limb centres and radii on quarter-size source frames, before object-fit.
const orbitSamples = [
  [175, 241.4, 135.3, 113.4], [184, 233.5, 135.3, 108.3], [192, 225.7, 135.1, 105.8],
  [200, 216.6, 134.7, 104.9], [208, 205.9, 134.6, 104.9], [216, 194.2, 134.4, 104.8],
  [224, 185.1, 134.1, 104.9], [232, 180.2, 134.2, 105.3], [238, 178.1, 134.1, 105.2],
];
export function earthLimb(frame: number) {
  const i = orbitSamples.findIndex(row => row[0] >= frame);
  const b = orbitSamples[i < 0 ? orbitSamples.length - 1 : i];
  const a = orbitSamples[Math.max(0, (i < 0 ? orbitSamples.length - 1 : i) - 1)];
  const t = range(frame, a[0], Math.max(a[0] + 1, b[0]));
  return { x: 4 * mix(a[1], b[1], t), y: 4 * mix(a[2], b[2], t), r: 4 * mix(a[3], b[3], t) };
}
export type StageGeometry = { width: number; height: number; globeX: number; globeY: number; globeRadius: number };
export function earthPlacement(p: number, geometry: StageGeometry, frame = cinemaFrame(p), limb = earthLimb(frame.cloudFrame)) {
  const { width, height, globeX, globeY, globeRadius } = geometry;
  // Keep the sphere inside the visible stage while the stacked text is hidden.
  const globeShift = (Math.min(globeY, height * .52) - globeY) * (1 - frame.settle);
  const cover = Math.max(width / 1920, height / 1080) * (1 + .018 * (1 - easeRange(p, .35, .50)));
  const scale = mix(cover, globeRadius / limb.r, frame.align);
  return {
    x: mix((width - 1920 * cover) / 2, globeX - limb.x * scale, frame.align),
    y: mix((height - 1080 * cover) / 2, globeY + globeShift - limb.y * scale, frame.align),
    scale, globeShift,
  };
}
