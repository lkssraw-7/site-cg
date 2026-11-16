"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useSiteReducedMotion } from "./motion-system";
import "./company-route-transition.css";

type Destination = { href: string; image: string; imagePosition: string };
type Bounds = { top: number; left: number; width: number; height: number };
type Overlay = Destination & { id: number; from: Bounds; viewport: { width: number; height: number }; phase: "expanding" | "waiting" | "revealing" };
type Navigate = (event: MouseEvent<HTMLAnchorElement>, destination: Destination) => void;

const CompanyRouteContext = createContext<Navigate | null>(null);

export function useCompanyRouteTransition() {
  const navigate = useContext(CompanyRouteContext);
  if (!navigate) throw new Error("CompanyRouteTransitionProvider is missing.");
  return navigate;
}

export function CompanyRouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const siteReduced = useSiteReducedMotion();
  const systemReduced = useReducedMotion();
  const reduced = siteReduced === true || systemReduced === true;
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const busy = useRef(false);
  const pushed = useRef(false);
  const sequence = useRef(0);

  useLayoutEffect(() => {
    if (!overlay || overlay.phase !== "waiting" || pathname !== overlay.href) return;
    // The cover is still opaque here. Reset the new page before revealing it;
    // otherwise the Home card's scroll position can carry into a pinned Hero.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, [overlay, pathname]);

  const navigate = useCallback<Navigate>((event, destination) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced) return;
    const card = event.currentTarget.closest<HTMLElement>(".company-card");
    const face = card?.querySelector<HTMLElement>(".tilted-card__front");
    if (!face) return;
    event.preventDefault();
    if (busy.current) return;
    const rect = face.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      router.push(destination.href);
      return;
    }
    busy.current = true;
    pushed.current = false;
    setOverlay({
      ...destination,
      id: ++sequence.current,
      from: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      phase: "expanding",
    });
  }, [reduced, router]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "waiting" || pathname !== overlay.href) return;
    let frame = 0;
    let timer = 0;
    let image: HTMLImageElement | null = null;
    const reveal = () => setOverlay(current => current?.id === overlay.id && current.phase === "waiting" ? { ...current, phase: "revealing" } : current);
    frame = requestAnimationFrame(() => {
      image = document.querySelector<HTMLImageElement>(".service-hero-photo img");
      if (image?.complete && image.naturalWidth > 0) reveal();
      else {
        image?.addEventListener("load", reveal, { once: true });
        image?.addEventListener("error", reveal, { once: true });
        timer = window.setTimeout(reveal, 1500);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      image?.removeEventListener("load", reveal);
      image?.removeEventListener("error", reveal);
    };
  }, [overlay, pathname]);

  useEffect(() => {
    if (!overlay || overlay.phase !== "waiting" || pathname === overlay.href) return;
    const timeout = window.setTimeout(() => window.location.assign(overlay.href), 8000);
    return () => window.clearTimeout(timeout);
  }, [overlay, pathname]);

  const finishAnimation = () => {
    if (!overlay) return;
    if (overlay.phase === "expanding" && !pushed.current) {
      pushed.current = true;
      setOverlay(current => current?.id === overlay.id ? { ...current, phase: "waiting" } : current);
      router.push(overlay.href, { scroll: false });
    } else if (overlay.phase === "revealing") {
      setOverlay(null);
      busy.current = false;
      pushed.current = false;
      requestAnimationFrame(() => {
        const title = document.getElementById("service-title");
        if (title) {
          title.setAttribute("tabindex", "-1");
          title.focus({ preventScroll: true });
        }
      });
    }
  };

  return <CompanyRouteContext.Provider value={navigate}>
    {children}
    {overlay && <motion.div
      key={overlay.id}
      className="company-route-transition"
      aria-hidden="true"
      initial={{ ...overlay.from, borderRadius: 37, opacity: 1 }}
      animate={{
        top: 0,
        left: 0,
        width: overlay.viewport.width,
        height: overlay.viewport.height,
        borderRadius: 0,
        opacity: overlay.phase === "revealing" ? 0 : 1,
      }}
      transition={overlay.phase === "revealing"
        ? { duration: .38, ease: "easeOut" }
        : { duration: .62, ease: [.22, 1, .36, 1] }}
      onAnimationComplete={finishAnimation}
      style={{ backgroundImage: `url("${overlay.image}")`, backgroundPosition: overlay.imagePosition }}
    />}
  </CompanyRouteContext.Provider>;
}
