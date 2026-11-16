/** Match Retina screens without allocating an unbounded full-screen canvas. */
export function canvasResolution(width: number, height: number, devicePixelRatio: number) {
  const cssWidth = Math.max(1, width);
  const cssHeight = Math.max(1, height);
  const pixelBudget = cssWidth <= 768 ? 2_000_000 : 8_294_400;
  const ratio = Math.min(
    Math.max(1, devicePixelRatio),
    2,
    Math.sqrt(pixelBudget / (cssWidth * cssHeight)),
    4096 / Math.max(cssWidth, cssHeight),
  );
  return { width: Math.max(1, Math.floor(cssWidth * ratio)), height: Math.max(1, Math.floor(cssHeight * ratio)) };
}

export const HIGH_RESOLUTION_QUERY = "(min-width: 769px) and (min-resolution: 1.5dppx), (min-width: 1921px)";

/** Keep the visible and requested images, releasing distant/heavy decoded frames. */
export function framesToEvict(frames: ReadonlyArray<{ index: number; pixels: number }>, target: number, visible: number, pixelBudget: number, radius: number) {
  let pixels = frames.reduce((sum, frame) => sum + frame.pixels, 0);
  const evicted: number[] = [];
  const farthestFirst = [...frames].sort((a, b) => Math.abs(b.index - target) - Math.abs(a.index - target));
  for (const frame of farthestFirst) {
    if (frame.index === target || frame.index === visible) continue;
    if (pixels > pixelBudget || Math.abs(frame.index - target) > radius) {
      pixels -= frame.pixels;
      evicted.push(frame.index);
    }
  }
  return evicted;
}

/** Advance toward the requested frame using decoded images, without reversing
 * direction or overshooting while an exact frame is still loading. */
export function readyFrame(target: number, visible: number, available: readonly number[]) {
  if (available.includes(target)) return target;
  const candidates = available.filter(index => visible < 0 || (index >= Math.min(visible, target) && index <= Math.max(visible, target)));
  return candidates.reduce((best, index) => best < 0 || Math.abs(index - target) < Math.abs(best - target) ? index : best, visible);
}

/** Current frame first, then a runway in the scroll direction and a small reverse buffer. */
export function prefetchOrder(target: number, count: number, direction: number, ahead: number, behind: number) {
  const frames = [target];
  for (let distance = 1; distance <= Math.max(ahead, behind); distance++) {
    if (distance <= ahead) frames.push(target + distance * direction);
    if (distance <= behind) frames.push(target - distance * direction);
  }
  return frames.filter(index => index >= 0 && index < count);
}
