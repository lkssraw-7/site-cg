export const PRESENCE_TRANSITION_VH = 50;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const easeRange = (value: number, from: number, to: number) => {
  const p = clamp((value - from) / (to - from));
  return p * p * (3 - 2 * p);
};

/** Adding a sticky exit tail must not stretch the original logo/video timeline. */
export function heroProgressWithoutExit(progress: number, scrollLengthVh: number, exitLengthVh: number) {
  return clamp(progress * (scrollLengthVh + exitLengthVh) / Math.max(1, scrollLengthVh));
}

/** Inverse mapping for the existing keyboard skip and explicit Hero seek. */
export function heroProgressWithExit(progress: number, scrollLengthVh: number, exitLengthVh: number) {
  return clamp(progress) * scrollLengthVh / Math.max(1, scrollLengthVh + exitLengthVh);
}

/** Measured on an untransformed section from start/end to start/start. The panel
 * covers the held Hero during the last half viewport, then joins normal flow. */
export function presenceTransition(viewportProgress: number) {
  const p = clamp((viewportProgress - (1 - PRESENCE_TRANSITION_VH / 100)) / (PRESENCE_TRANSITION_VH / 100));
  const panel = easeRange(p, 0, 1);
  const globe = easeRange(p, .08, .68);
  const copy = easeRange(p, .28, .9);
  const overview = easeRange(p, .45, 1);
  return {
    progress: p,
    panelYVh: PRESENCE_TRANSITION_VH * (1 - panel),
    globeOpacity: globe,
    globeScale: .96 + .04 * globe,
    globeY: 18 * (1 - globe),
    copyOpacity: copy,
    copyY: 22 * (1 - copy),
    overviewOpacity: overview,
    overviewY: 16 * (1 - overview),
  };
}
