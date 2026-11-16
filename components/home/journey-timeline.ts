/** Direct scroll mapping: no clock, spring, or accumulated playback state. */
export const JOURNEY = {
  scrollLengthVh: 450,
  mobileScrollLengthVh: 360,
  boundaries: [0, 1 / 3, 2 / 3, 1],
  backgroundBlend: .055,
  textExitStart: .075,
  textExitEnd: .025,
  readingOffset: .16,
} as const;

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
export function smoothRange(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}
export function chapterAt(progress: number) {
  const p = clamp(progress);
  return p < JOURNEY.boundaries[1] ? 0 : p < JOURNEY.boundaries[2] ? 1 : 2;
}
export function chapterVisual(progress: number, index: number) {
  const p = clamp(progress);
  const start = JOURNEY.boundaries[index];
  const end = JOURNEY.boundaries[index + 1];
  const arrival = index === 0 ? 1 : smoothRange(p, start + .025, start + .075);
  const departure = index === 2 ? 0 : smoothRange(p, end - .075, end - .025);
  const opacity = arrival * (1 - departure);
  return {
    opacity,
    y: (1 - arrival) * 24 - departure * 18,
    backgroundOpacity: index === 0 ? 1 : smoothRange(p, start - JOURNEY.backgroundBlend, start + JOURNEY.backgroundBlend),
    scale: 1 + .045 * (1 - clamp((p - start) / (end - start))),
  };
}
export function interactiveChapter(progress: number) {
  const chapter = chapterAt(progress);
  return chapterVisual(progress, chapter).opacity >= .75 ? chapter : -1;
}
export function chapterDestination(index: number) {
  return JOURNEY.boundaries[index] + JOURNEY.readingOffset;
}
