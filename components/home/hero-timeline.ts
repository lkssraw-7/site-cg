/** One reversible scroll timeline coordinates the logo, frames and content. */
export const HERO_TIMELINE = {
  welcome: [.04, .3],
  hint: [0, .12],
  header: [.82, .98],
  // Content starts at 70% of the continuous logo journey.
  content: [.7, .73],
  title: [.7, .87],
  description: [.8, .93],
  actions: [.9, .96],
  benefits: [.94, .995],
} as const;

/** Scene progress after the logo docks: lower content leaves before upper copy. */
export const HERO_EXIT = {
  benefits: [.335, .365],
  actions: [.345, .38],
  description: [.353, .392],
  title: [.365, .416],
  complete: .426,
} as const;

export function heroRange(progress: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (progress - start) / Math.max(end - start, 1e-6)));
}

export function staggerWindow(start: number, end: number, index: number, count: number) {
  // Short groups need a longer overlap; single words occupy the full range.
  const duration = (end - start) * Math.max(.28, 1 / (1 + (count - 1) * .52));
  const step = count > 1 ? ((end - start) - duration) / (count - 1) : 0;
  return [start + index * step, start + index * step + duration] as const;
}

export const HERO_SCROLL = { scrollDistance: 1.4, holdDistance: .35, smoothing: .19 } as const;

/** Reserve the final 0.35 viewport for reading, preserving frame synchronization. */
export function heroJourneyProgress(trackProgress: number) {
  return heroRange(trackProgress, 0, HERO_SCROLL.scrollDistance / (HERO_SCROLL.scrollDistance + HERO_SCROLL.holdDistance));
}

export type LogoBounds = { left: number; top: number; width: number; height: number };

/** Translate from the real header slot to the center of the pinned hero. */
export function logoStartPose(stage: LogoBounds, destination: LogoBounds, width: number) {
  const scale = width / Math.max(1, destination.width);
  return {
    x: stage.left + (stage.width - width) / 2 - destination.left,
    y: stage.top + (stage.height - destination.height * scale) / 2 - destination.top,
    scale,
  };
}

/** No accumulated deltas: every scroll position has the same pose in either direction. */
export function logoPose(progress: number, start: { x: number; y: number; scale: number }) {
  const p = heroRange(progress, 0, 1);
  const remaining = 1 - p * p * (3 - 2 * p);
  return { x: start.x * remaining, y: start.y * remaining, scale: 1 + (start.scale - 1) * remaining };
}

/** Paint at the largest required width, then only scale down. This preserves the
 * same visible journey without magnifying a header-sized rasterized SVG layer. */
export function logoRenderPose(progress: number, start: { x: number; y: number; scale: number }) {
  const pose = logoPose(progress, start);
  return { ...pose, scale: pose.scale / Math.max(1, start.scale) };
}

/** Time-based exponential following: same response at 30, 60 or 120 Hz. */
export function followProgress(current: number, target: number, elapsedSeconds: number, smoothing: number) {
  if (smoothing <= 0) return target;
  return current + (target - current) * (1 - Math.exp(-Math.max(0, elapsedSeconds) / smoothing));
}

export function heroVisibility(progress: number, sceneProgress = 0) {
  return {
    header: progress >= HERO_TIMELINE.header[1],
    content: progress > HERO_TIMELINE.content[0] && sceneProgress < HERO_EXIT.complete,
    actions: progress >= HERO_TIMELINE.actions[1] && sceneProgress < HERO_EXIT.actions[1],
    hint: progress < HERO_TIMELINE.hint[1],
    benefits: progress > HERO_TIMELINE.benefits[0] && sceneProgress < HERO_EXIT.benefits[1],
  };
}
