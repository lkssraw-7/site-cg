"use client";

import { useLayoutEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import { followProgress } from "./hero-timeline";

/** One followed progress drives frames, logo, header and text. */
export function useFollowedProgress(target: MotionValue<number>, enabled: boolean, smoothing: number) {
  const progress = useMotionValue(target.get());
  useLayoutEffect(() => {
    let frame = 0;
    let previousTime = 0;
    progress.set(enabled ? target.get() : 1);
    if (!enabled) return;

    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const tick = (time: number) => {
      frame = 0;
      const next = followProgress(progress.get(), target.get(), (time - previousTime) / 1000, smoothing);
      previousTime = time;
      const settled = Math.abs(next - target.get()) < .0004;
      progress.set(settled ? target.get() : next);
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const follow = () => {
      if (smoothing <= 0 || document.hidden) { stop(); progress.set(target.get()); return; }
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const unsubscribe = target.on("change", follow);
    const syncVisibility = () => { if (document.hidden) { stop(); progress.set(target.get()); } };
    document.addEventListener("visibilitychange", syncVisibility);
    return () => { stop(); unsubscribe(); document.removeEventListener("visibilitychange", syncVisibility); };
  }, [target, enabled, smoothing, progress]);
  return progress;
}
