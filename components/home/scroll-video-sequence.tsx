"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useRef, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CINEMA, cinemaFrame, earthLimb, earthPlacement, easeRange, type StageGeometry } from "./cinema-timeline";
import { GlobalPresence } from "./global-presence";
import { GLOBE_SCALE } from "./globe-geometry";
import { createVideoScrubber } from "./video-scrubbing";
import { useHeroPresentation } from "./use-hero-presentation";
import "./cinema.css";

type HeroScrollState = { progress: MotionValue<number>; sceneProgress: MotionValue<number>; enabled: boolean; seek: (progress: number) => void };
const HeroScrollContext = createContext<HeroScrollState | null>(null);
export function useHeroScroll() {
  const value = useContext(HeroScrollContext);
  if (!value) throw new Error("Hero choreography requires ScrollVideoSequence.");
  return value;
}

export function ScrollVideoSequence({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const progress = useMotionValue(0);
  const sceneProgress = useMotionValue(1);
  const { enabled, prefersReducedMotion } = useHeroPresentation();
  const seek = useCallback((value: number) => {
    const st = trigger.current;
    if (st) window.scrollTo({ top: st.start + (st.end - st.start) * CINEMA.heroEnd * value, behavior: "instant" });
  }, []);

  useLayoutEffect(() => {
    const track = root.current;
    if (!enabled || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    const stage = track.querySelector<HTMLElement>(".cinema-stage")!;
    const media = stage.querySelector<HTMLElement>(".cinema-film")!;
    const house = media.querySelector<HTMLVideoElement>(".cinema-house video")!;
    const cloud = media.querySelector<HTMLVideoElement>(".cinema-orbit video")!;
    const orbit = cloud.parentElement!;
    const hero = stage.querySelector<HTMLElement>(".hero-presentation")!;
    const presence = stage.querySelector<HTMLElement>(".global-presence")!;
    const globe = presence.querySelector<HTMLElement>("#presence-globe")!;
    const anchor = track.querySelector<HTMLElement>(".cinema-anchor")!;
    const clock = { p: 0 };
    let geometry: StageGeometry;
    let shiftY = 0;
    let decodedCloudFrame = -1;
    let disposed = false;
    let refreshFrame = 0;

    function measure() {
      const stageBox = stage.getBoundingClientRect();
      const box = globe.getBoundingClientRect();
      geometry = {
        width: media.clientWidth, height: media.clientHeight,
        globeX: box.left + box.width / 2 - stageBox.left,
        globeY: box.top + box.height / 2 - stageBox.top - shiftY,
        globeRadius: box.width * .4 * GLOBE_SCALE,
      };
      anchor.style.top = String(geometry.height * CINEMA.scrollScreens) + "px";
    }

    function placeOrbit() {
      if (!geometry || clock.p < CINEMA.cloudIn) return;
      const p = clock.p;
      const frame = cinemaFrame(p);
      // During a long jump the decoder may still contain clouds. Use the actual
      // final source frame until a registered Earth frame has reached the decoder.
      const useStill = p >= CINEMA.orbitStart && decodedCloudFrame < 170;
      orbit.toggleAttribute("data-still", useStill);
      const limb = earthLimb(useStill ? 238 : decodedCloudFrame < 0 ? frame.cloudFrame : decodedCloudFrame);
      const pose = earthPlacement(p, geometry, frame, limb);
      shiftY = pose.globeShift;
      stage.style.setProperty("--globe-shift", String(shiftY) + "px");
      orbit.style.transform = "translate3d(" + pose.x + "px," + pose.y + "px,0) scale(" + pose.scale + ")";
      // First dissolve space outside the disk. The photographed limb stays solid
      // until its centre and radius coincide with the measured COBE sphere.
      orbit.style.maskImage = p <= CINEMA.orbitStart ? "none" :
        "radial-gradient(circle at " + limb.x + "px " + limb.y + "px, black " + limb.r * .984 +
        "px, rgba(0,0,0," + frame.outsideLimb + ") " + limb.r * 1.043 + "px)";
    }

    const scheduler = {
      request: (callback: () => void) => window.requestAnimationFrame(callback),
      cancel: (id: number) => window.cancelAnimationFrame(id),
    };
    const driver = (video: HTMLVideoElement) => createVideoScrubber(video, scheduler, {
      framesPerSecond: 24,
      onReady: () => {
        video.dataset.ready = "true";
        if (video === cloud) {
          const decoded = Math.floor(cloud.currentTime * 24);
          if (decoded !== decodedCloudFrame) { decodedCloudFrame = decoded; placeOrbit(); }
        }
      },
      onError: () => {
        delete video.dataset.ready;
        if (video === cloud) { decodedCloudFrame = -1; placeOrbit(); }
      },
    });
    const first = driver(house), second = driver(cloud);
    function render() {
      const p = clock.p;
      const f = cinemaFrame(p);
      progress.set(f.hero);
      sceneProgress.set(p);
      if (p >= .17 && cloud.preload !== "auto") cloud.preload = "auto";
      first.update(f.houseTime);
      second.update(f.cloudTime);
      first.setActive(!document.hidden && p < CINEMA.cloudOut);
      second.setActive(!document.hidden && p > CINEMA.cloudIn - .06 && p < CINEMA.globeComplete + .01);
      hero.inert = f.heroOpacity <= .01;
      presence.inert = p < .967;
      stage.style.setProperty("--hero-alpha", String(f.heroOpacity));
      stage.style.setProperty("--house-alpha", p < CINEMA.cloudOut ? "1" : "0");
      stage.style.setProperty("--film-alpha", String(f.clouds * (1 - f.dissolve)));
      stage.style.setProperty("--fallback-orbit", String(easeRange(p, .58, .80)));
      stage.style.setProperty("--space-alpha", String(f.space));
      stage.style.setProperty("--globe-alpha", String(f.globe));
      stage.style.setProperty("--detail-alpha", String(f.details));
      stage.style.setProperty("--heading-alpha", String(f.heading));
      stage.style.setProperty("--body-alpha", String(f.description));
      stage.style.setProperty("--stat-alpha", String(f.overview));
      placeOrbit();
    }

    measure();
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track, pin: stage, start: "top top",
          end: () => "+=" + media.clientHeight * CINEMA.scrollScreens,
          scrub: true, invalidateOnRefresh: true,
          onRefresh: () => { measure(); render(); },
        },
      });
      timeline.to(clock, { p: 1, duration: 1, ease: "none", onUpdate: render });
      trigger.current = timeline.scrollTrigger!;
    }, track);
    render();

    // Recalculate the actual sphere after fonts, rotation or breakpoint changes.
    const scheduleRefresh = () => {
      if (disposed || refreshFrame) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        trigger.current?.refresh();
      });
    };
    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(globe);
    observer.observe(media);
    observer.observe(presence);
    void document.fonts.ready.then(scheduleRefresh);
    document.addEventListener("visibilitychange", render);
    // Native fragment navigation may have run before the enhanced pin spacer existed.
    const initialHash = window.location.hash;
    const initialScroll = window.scrollY;
    const restore = requestAnimationFrame(() => {
      if (initialHash && location.hash === initialHash && Math.abs(window.scrollY - initialScroll) < 2) {
        const target = document.getElementById(initialHash.slice(1));
        if (target && [anchor.id, "contato", "nossas-empresas"].includes(target.id)) target.scrollIntoView({ behavior: "instant" });
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(restore);
      cancelAnimationFrame(refreshFrame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", render);
      first.dispose(); second.dispose();
      ctx.revert();
      trigger.current = null;
      presence.inert = false; hero.inert = false;
      sceneProgress.set(1); progress.set(0);
      stage.removeAttribute("style");
    };
  }, [enabled, progress, sceneProgress]);

  return <div ref={root} id="o-grupo" className="cinema-track" data-cinema={enabled || undefined}>
    {enabled && <span id="presenca-internacional" className="cinema-anchor" aria-hidden="true" />}
    <div className="cinema-stage">
      {enabled && <>
        <div className="cinema-space" aria-hidden="true" />
        <div className="cinema-film" aria-hidden="true">
          <div className="cinema-house"><video src="/video/house-scrub.mp4" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} /></div>
          <div className="cinema-orbit">
            <div className="cinema-earth-still" />
            <video src="/video/cloud-scrub.mp4" muted playsInline preload="metadata" disablePictureInPicture tabIndex={-1} />
          </div>
        </div>
      </>}
      <section className="hero-sequence hero-presentation" data-animated={enabled || undefined} data-reduced-motion={!enabled || undefined} aria-labelledby="hero-title">
        <div className="hero hero-sequence__sticky">
          <div className="hero-background-shade" aria-hidden="true" />
          <HeroScrollContext.Provider value={{ progress, sceneProgress, enabled, seek }}>{children}</HeroScrollContext.Provider>
        </div>
      </section>
      <GlobalPresence animated={enabled} reduced={prefersReducedMotion} sceneProgress={sceneProgress} />
    </div>
  </div>;
}
