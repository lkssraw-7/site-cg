type ScrubMedia = Pick<HTMLVideoElement,
  "duration" | "currentTime" | "readyState" | "seeking" | "error" |
  "pause" | "addEventListener" | "removeEventListener"
>;

type FrameScheduler = {
  request: (callback: () => void) => number;
  cancel: (id: number) => void;
};

/** Stay inside the last playable frame instead of seeking to the ended state. */
export function videoTimeAtProgress(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return fraction * Math.max(0, duration - .001);
}

/** A paused video follows the latest scroll position. Only one seek is in flight;
 * intermediate requests are replaced, not queued or used to interrupt decoding. */
export function createVideoScrubber(
  video: ScrubMedia,
  scheduler: FrameScheduler,
  options: { framesPerSecond?: number; onReady?: () => void; onError?: () => void } = {},
) {
  let progress = 0;
  let active = false;
  let disposed = false;
  let failed = false;
  let inFlight = false;
  let frame = 0;
  const tolerance = 1 / (Math.max(1, options.framesPerSecond ?? 24) * 2);

  const cancel = () => { if (frame) scheduler.cancel(frame); frame = 0; };
  const showReady = () => {
    if (!failed && video.readyState >= 2 && !video.seeking && !inFlight) options.onReady?.();
  };
  const flush = () => {
    frame = 0;
    if (disposed || failed || !active || inFlight || video.seeking || video.readyState < 1) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const time = videoTimeAtProgress(progress, video.duration);
    if (Math.abs(video.currentTime - time) < tolerance) { showReady(); return; }
    inFlight = true;
    try { video.currentTime = time; }
    catch {
      // Metadata/buffer transitions can temporarily reject a seek. Retry on the
      // next media or scroll event, never in a self-scheduling busy loop.
      inFlight = false;
    }
  };
  const request = () => {
    if (!disposed && !failed && active && !inFlight && !frame) frame = scheduler.request(flush);
  };
  const onMediaReady = () => { showReady(); request(); };
  const onSeeked = () => { inFlight = false; showReady(); request(); };
  const onError = () => { failed = true; inFlight = false; cancel(); options.onError?.(); };
  const readyEvents = ["loadedmetadata", "durationchange", "loadeddata", "canplay", "progress"];
  for (const event of readyEvents) video.addEventListener(event, onMediaReady);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("error", onError);
  video.pause();
  if (video.error) onError();

  return {
    update(value: number) { progress = value; request(); },
    setActive(value: boolean) {
      if (active === value) return;
      active = value;
      if (active) request();
      else { cancel(); video.pause(); }
    },
    dispose() {
      disposed = true;
      cancel();
      for (const event of readyEvents) video.removeEventListener(event, onMediaReady);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.pause();
    },
  };
}
