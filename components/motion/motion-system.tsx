"use client";

import { MotionConfig, animate, motion, useScroll, useTransform } from "motion/react";
import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

export const ease = [0.23, 1, 0.32, 1] as const;

const MotionPreference = createContext<boolean | null>(null);
const preferenceKey = "cg-motion";
let sessionPreference: string | null = null;
function readPreference() {
  try { return sessionPreference ?? window.localStorage.getItem(preferenceKey); }
  catch { return sessionPreference; }
}
function subscribePreference(update: () => void) {
  const syncStorage = () => { sessionPreference = null; update(); };
  window.addEventListener("storage", syncStorage);
  window.addEventListener("cg-motion-change", update);
  return () => { window.removeEventListener("storage", syncStorage); window.removeEventListener("cg-motion-change", update); };
}
export function useSiteReducedMotion() { return useContext(MotionPreference); }

export function MotionProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribePreference, readPreference, () => null);
  // Motion is enabled by default; the site's explicit saved choice takes priority.
  const reduced = preference === "reduced";
  useEffect(() => { document.documentElement.dataset.motion = reduced === false ? "full" : "reduced"; }, [reduced]);
  useEffect(() => {
    const keyboard = () => { document.documentElement.dataset.input = "keyboard"; };
    const pointer = () => { document.documentElement.dataset.input = "pointer"; };
    window.addEventListener("keydown", keyboard, true);
    window.addEventListener("pointerdown", pointer, true);
    return () => { window.removeEventListener("keydown", keyboard, true); window.removeEventListener("pointerdown", pointer, true); };
  }, []);
  return <MotionPreference.Provider value={reduced}><MotionConfig reducedMotion={reduced === false ? "never" : "always"} transition={{ duration: .45, ease }}>{children}</MotionConfig></MotionPreference.Provider>;
}

export function MotionToggle() {
  const reduced = useSiteReducedMotion();
  return <button type="button" className="motion-toggle" aria-pressed={reduced === false} onClick={() => {
    sessionPreference = reduced === false ? "reduced" : "full";
    try { window.localStorage.setItem(preferenceKey, sessionPreference); } catch { /* Keep the choice for this visit. */ }
    window.dispatchEvent(new Event("cg-motion-change"));
  }}>{reduced === false ? "Reduzir animações" : "Ativar animações"}</button>;
}

export type RevealVariant = "rise" | "fade" | "settle" | "line";
const reveals = {
  rise: { enter: "translateY(24px)", exit: "translateY(-12px)", rest: "translateY(0px)", duration: .65 },
  fade: { enter: "none", exit: "none", rest: "none", duration: .4 },
  settle: { enter: "scale(1.045)", exit: "scale(1.045)", rest: "scale(1)", duration: .8 },
  line: { enter: "scaleX(0)", exit: "scaleX(0)", rest: "scaleX(1)", duration: .7 },
} as const;

// Content stays readable without JS. Only selected landmarks repeat; photographs
// and process rules reveal once. Exits happen at the viewport edge, not mid-reading.
export function Reveal({ children, className = "", delay = 0, mode = "scroll", variant = "fade", once = false }: { children?: ReactNode; className?: string; delay?: number; mode?: "scroll" | "load"; variant?: RevealVariant; once?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useSiteReducedMotion();
  useEffect(() => {
    const element = scope.current;
    if (!element || reduced !== false || typeof window.IntersectionObserver !== "function" || typeof element.animate !== "function") return;
    const preset = reveals[variant];
    let controls: ReturnType<typeof animate> | undefined;
    let entered: boolean | undefined;
    let revealed = false;
    const reset = () => {
      controls?.stop();
      element.style.opacity = "1";
      element.style.transform = "none";
    };
    const show = (visible: boolean, immediate = false) => {
      controls?.stop();
      const above = element.getBoundingClientRect().bottom <= 24;
      element.dataset.motionState = visible ? "visible" : "hidden";
      try {
        controls = animate(element, { opacity: visible || variant === "line" ? 1 : 0, transform: visible ? preset.rest : above ? preset.exit : preset.enter }, {
          duration: immediate ? 0 : visible ? preset.duration : .2,
          delay: visible && !immediate ? Math.min(delay, .18) : 0,
          ease,
        });
      } catch { reset(); }
    };
    const bounds = element.getBoundingClientRect();
    if (bounds.top >= window.innerHeight - 24) show(false, true);
    else if (mode === "load" && bounds.bottom > 0) {
      element.style.opacity = "0";
      element.style.transform = preset.enter;
    }
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (once && revealed) return;
      if (entered === visible) return;
      entered = visible;
      if (visible) revealed = true;
      show(visible || element.contains(document.activeElement), document.documentElement.dataset.input === "keyboard");
    }, { rootMargin: "-16px 0px -24px 0px", threshold: 0 });
    observer.observe(element);
    const showFocused = () => show(true, true);
    const finishForKeyboard = () => controls?.complete();
    element.addEventListener("focusin", showFocused);
    window.addEventListener("keydown", finishForKeyboard);
    return () => {
      observer.disconnect();
      element.removeEventListener("focusin", showFocused);
      window.removeEventListener("keydown", finishForKeyboard);
      reset();
      delete element.dataset.motionState;
    };
  }, [delay, mode, reduced, variant, once]);
  return <div ref={scope} className={className} data-reveal={variant} data-once={once || undefined} style={variant === "line" ? { transformOrigin: "left" } : undefined}>{children}</div>;
}

// Keep the hero readable while any part of its copy is on screen. Its individual
// text landmarks own entry/exit; the background alone follows scroll progress.
export function HeroContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className} data-hero-scroll>{children}</div>;
}

export function AnimatedImage({ children, className = "", hero = false }: { children: ReactNode; className?: string; hero?: boolean }) {
  return hero ? <HeroImage className={className}>{children}</HeroImage> : <div className={className}><div className="motion-image-inner">{children}</div></div>;
}

function HeroImage({ children, className }: { children: ReactNode; className: string }) {
  const reduced = useSiteReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start start", "end start"] });
  const transform = useTransform(scrollYProgress, [0, 1], ["scale(1)", "scale(1.06)"]);
  return <div ref={frame} className={className}>
    <motion.div className="motion-image-inner" style={reduced === false ? { transform } : undefined}>{children}</motion.div>
  </div>;
}
