"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { useSiteReducedMotion } from "@/components/motion/motion-system";

// The Hero and its outgoing transition must switch layouts together.
const presentationQuery = "(min-width: 360px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";
function subscribePresentation(notify: () => void) {
  const query = window.matchMedia(presentationQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const canPresent = () => window.matchMedia(presentationQuery).matches;
const serverPresentation = () => false;

export function useHeroPresentation() {
  const systemReduced = useReducedMotion();
  const siteReduced = useSiteReducedMotion();
  const fits = useSyncExternalStore(subscribePresentation, canPresent, serverPresentation);
  const prefersReducedMotion = Boolean(systemReduced || siteReduced);
  return { enabled: fits && !prefersReducedMotion, prefersReducedMotion };
}
