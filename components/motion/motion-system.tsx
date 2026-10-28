"use client";

import { MotionConfig, motion, stagger, useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease }}>{children}</MotionConfig>;
}

// Conteúdo nasce visível no HTML. A animação só é aplicada após hidratação e
// entrada no viewport: sem JS, com movimento reduzido ou via teclado, ele continua legível.
export function Reveal({ children, className = "", delay = 0, mode = "scroll" }: { children: ReactNode; className?: string; delay?: number; mode?: "scroll" | "load" }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const visible = useInView(scope, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  const ready = mode === "load" || visible;
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (reduced) { animate(scope.current, { opacity: 1, y: 0 }, { duration: 0 }); return; }
    if (reduced !== false || !ready) return;
    if (scope.current.contains(document.activeElement)) return;
    const controls = animate(scope.current, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: Math.min(delay, 0.24), ease });
    return () => { controls.stop(); element.style.opacity = "1"; element.style.transform = "none"; };
  }, [animate, delay, ready, reduced, scope]);
  return <div ref={scope} className={className} data-reveal>{children}</div>;
}

export function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const visible = useInView(scope, { once: true, amount: 0.08 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!scope.current) return;
    const items = Array.from(scope.current.children) as HTMLElement[];
    if (reduced) { items.forEach(item => { item.style.opacity = "1"; item.style.transform = "none"; }); return; }
    if (!visible || reduced !== false) return;
    const controls = animate(items, { opacity: [0, 1], y: [18, 0] }, { duration: 0.42, delay: stagger(0.065), ease });
    return () => { controls.stop(); items.forEach(item => { item.style.opacity = "1"; item.style.transform = "none"; }); };
  }, [animate, reduced, scope, visible]);
  return <div ref={scope} className={className} data-stagger>{children}</div>;
}

export function HoverCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.article className={className} whileHover={reduced ? undefined : { y: -4 }} transition={{ duration: 0.2, ease }}>{children}</motion.article>;
}

export function AnimatedImage({ children, className = "", hero = false }: { children: ReactNode; className?: string; hero?: boolean }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = scope.current;
    if (!hero || reduced !== false || !element) return;
    const controls = animate(scope.current, { opacity: [0.65, 1], scale: [1.025, 1] }, { duration: 0.75, ease });
    return () => { controls.stop(); element.style.opacity = "1"; element.style.transform = "none"; };
  }, [animate, hero, reduced, scope]);
  return <motion.div ref={scope} className={className} whileHover={!hero && !reduced ? { scale: 1.025 } : undefined} transition={{ duration: 0.45, ease }}>{children}</motion.div>;
}
