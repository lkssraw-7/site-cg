"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteReducedMotion } from "@/components/motion/motion-system";
import { createVideoScrubber } from "@/components/home/video-scrubbing";
import "./v3-cinema-hero.css";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function V3CinemaHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const siteReduced = useSiteReducedMotion();
  const systemReduced = useReducedMotion();
  const animated = siteReduced === false && systemReduced !== true;

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = track?.querySelector<HTMLElement>(".v3-cinema-stage");
    const video = stage?.querySelector<HTMLVideoElement>(".v3-cinema-video");
    const arrival = stage?.querySelector<HTMLElement>(".v3-cinema-arrival");
    if (!animated || !track || !stage || !video || !arrival) return;

    gsap.registerPlugin(ScrollTrigger);
    const scheduler = {
      request: (callback: () => void) => requestAnimationFrame(callback),
      cancel: (id: number) => cancelAnimationFrame(id),
    };
    const scrubber = createVideoScrubber(video, scheduler, {
      framesPerSecond: 24,
      onReady: () => { video.dataset.ready = "true"; },
      onError: () => { delete video.dataset.ready; },
    });
    const clock = { progress: 0 };
    let trigger: ScrollTrigger | undefined;

    const render = () => {
      const p = clamp(clock.progress);
      const introExit = smoothstep(.08, .3, p);
      const arrivalEnter = smoothstep(.78, .96, p);
      stage.style.setProperty("--v3-intro-opacity", String(1 - introExit));
      stage.style.setProperty("--v3-intro-y", `${-28 * introExit}px`);
      stage.style.setProperty("--v3-hint-opacity", String(1 - smoothstep(.01, .13, p)));
      stage.style.setProperty("--v3-arrival-opacity", String(arrivalEnter));
      stage.style.setProperty("--v3-arrival-y", `${24 * (1 - arrivalEnter)}px`);
      arrival.inert = p < .78;
      scrubber.update(p);
      scrubber.setActive(!document.hidden && (trigger?.isActive ?? true));
    };

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          pin: stage,
          start: "top top",
          end: () => `+=${Math.round(stage.clientHeight * 2.7)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: render,
        },
      });
      timeline.to(clock, { progress: 1, duration: 1, ease: "none", onUpdate: render });
      trigger = timeline.scrollTrigger;
    }, track);
    render();
    document.addEventListener("visibilitychange", render);

    return () => {
      document.removeEventListener("visibilitychange", render);
      scrubber.dispose();
      context.revert();
      arrival.inert = false;
      stage.removeAttribute("style");
    };
  }, [animated]);

  return <div ref={trackRef} className="v3-cinema-track" data-animated={animated || undefined}>
    <section className="service-hero v3-cinema-stage" aria-labelledby="service-title">
      <div className="service-hero-photo v3-cinema-poster" aria-hidden="true">
        <Image src="/images/v3-clouds-poster.jpg" alt="" fill preload sizes="100vw" quality={90} />
      </div>
      {animated && <video
        className="v3-cinema-video"
        src="/video/v3-clouds-scrub.mp4"
        poster="/images/v3-clouds-poster.jpg"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        aria-hidden="true"
      />}
      <div className="v3-cinema-shade" aria-hidden="true" />
      <div className="container v3-cinema-content">
        <div className="v3-cinema-intro">
          <p className="v3-cinema-eyebrow">V3 Energia Solar · Cordeiro Group</p>
          <h1 id="service-title">O futuro começa com a energia do sol.</h1>
          <p className="v3-cinema-description">Transformamos a energia que você consome em novas possibilidades. Sistemas fotovoltaicos para sua casa ou empresa, do projeto à instalação.</p>
          <p className="v3-cinema-hint" aria-hidden="true"><span>↓</span> Role para descobrir</p>
        </div>
        <div className="v3-cinema-arrival">
          <p>A energia do sol, mais perto da sua realidade.</p>
          <ButtonLink href="#servicos">Conhecer soluções</ButtonLink>
        </div>
      </div>
      <span className="image-caption">Imagem conceitual gerada por IA</span>
    </section>
  </div>;
}
