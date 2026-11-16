"use client";

import Image from "next/image";
import { cubicBezier, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { GroupLogo } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { ease as easingControlPoints } from "@/components/motion/motion-system";
import { useHeroScroll } from "./scroll-video-sequence";
import { bindHeroSkipLink } from "./hero-skip-link";
import { HERO_TIMELINE as timing, HERO_EXIT as exit, heroVisibility, staggerWindow, logoStartPose, logoRenderPose } from "./hero-timeline";

const ease = cubicBezier(...easingControlPoints);

const titleLines = [["Soluções", "integradas"], ["para", "um", "futuro"], ["mais", "inteligente."]];
const mobileTitleLines = [["Soluções"], ["integradas"], ["para", "um", "futuro"], ["mais", "inteligente."]];
const mobileTitleQuery = "(max-width: 540px)";
function subscribeMobileTitle(notify: () => void) {
  const query = window.matchMedia(mobileTitleQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
const readMobileTitle = () => window.matchMedia(mobileTitleQuery).matches;
const serverMobileTitle = () => false;
const description = "Engenharia, energia e tecnologia conectadas para transformar o amanhã.";
const descriptionWords = description.split(" ");
const benefits = [
  { title: "Engenharia elétrica", detail: "Segurança e precisão para cada projeto." },
  { title: "Energia solar", detail: "Geração própria e eficiência energética." },
  { title: "Automação residencial", detail: "Conforto e tecnologia integrados." },
];

function HeroArrow({ down = false }: { down?: boolean }) {
  return <Image src={`/images/hero-motion/arrow-${down ? "down" : "dark"}.svg`} width={down ? 16 : 18} height={down ? 16 : 18} alt="" aria-hidden="true" />;
}

function ScrollReveal({ children, range, distance, exitRange = [2, 3], exitDistance = 0, className = "", nodeId, hidden }: { children: ReactNode; range: readonly [number, number]; distance: number; exitRange?: readonly [number, number]; exitDistance?: number; className?: string; nodeId?: string; hidden?: boolean }) {
  const { progress, sceneProgress, enabled } = useHeroScroll();
  const entranceOpacity = useTransform(progress, [...range], [0, 1], { ease });
  const leavingOpacity = useTransform(sceneProgress, [...exitRange], [1, 0], { ease });
  const opacity = useTransform(() => entranceOpacity.get() * leavingOpacity.get());
  const entranceY = useTransform(progress, [...range], [Math.min(distance, 18), 0], { ease });
  const leavingY = useTransform(sceneProgress, [...exitRange], [0, -exitDistance], { ease });
  const transform = useTransform(() => `translateY(${entranceY.get() + leavingY.get()}px)`);
  return <motion.div className={className} aria-hidden={hidden || undefined} data-node-id={nodeId} style={enabled ? { opacity, transform } : { opacity: 1, transform: "none" }}>{children}</motion.div>;
}

function ScrollExit({ children, range, distance = 20, className = "" }: { children: ReactNode; range: readonly [number, number]; distance?: number; className?: string }) {
  const { sceneProgress, enabled } = useHeroScroll();
  const opacity = useTransform(sceneProgress, [...range], [1, 0], { ease });
  const y = useTransform(sceneProgress, [...range], [0, -distance], { ease });
  return <motion.span className={className} style={enabled ? { opacity, y } : { opacity: 1, transform: "none" }}>{children}</motion.span>;
}

function TitleLines() {
  const lines = useSyncExternalStore(subscribeMobileTitle, readMobileTitle, serverMobileTitle) ? mobileTitleLines : titleLines;
  let wordIndex = 0;
  return <span className="hero-title-visual" aria-hidden="true">{lines.map((line, lineIndex) => {
    const window = staggerWindow(exit.title[0], exit.title[1], lines.length - 1 - lineIndex, lines.length);
    return <ScrollExit className="hero-title-line" range={window} distance={22} key={lineIndex}>
      {line.map(word => <span key={word}><ScrollWord range={timing.title} index={wordIndex++} count={7} distance={72}>{word}</ScrollWord>{" "}</span>)}
    </ScrollExit>;
  })}</span>;
}

function ScrollWord({ children, range, index, count, distance }: { children: ReactNode; range: readonly [number, number]; index: number; count: number; distance: number }) {
  const { progress, enabled } = useHeroScroll();
  const window = staggerWindow(range[0], range[1], index, count);
  const opacity = useTransform(progress, [...window], [0, 1], { ease });
  const transform = useTransform(progress, [...window], [`translateY(calc(${Math.min(distance, 20)}px * var(--hero-text-travel)))`, "translateY(calc(0px * var(--hero-text-travel)))"], { ease });
  return <motion.span className="hero-word" style={enabled ? { opacity, transform } : { opacity: 1, transform: "none" }}>{children}</motion.span>;
}

/** The header's own logo moves; no clone or opacity handoff is needed. */
function TravelingLogo() {
  const { progress, enabled } = useHeroScroll();
  const anchor = useRef<HTMLSpanElement>(null);
  const ruler = useRef<HTMLSpanElement>(null);
  const startX = useMotionValue(0);
  const startY = useMotionValue(0);
  const startScale = useMotionValue(1);
  const renderWidth = useMotionValue(226);
  const transform = useTransform(() => {
    const pose = logoRenderPose(progress.get(), { x: startX.get(), y: startY.get(), scale: startScale.get() });
    return `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`;
  });

  useLayoutEffect(() => {
    const slot = anchor.current;
    const size = ruler.current;
    const stage = slot?.closest<HTMLElement>(".hero-sequence__sticky");
    if (!enabled || !slot || !size || !stage) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      // Both rectangles share the same scroll offset, even after the sticky stage releases.
      const destination = slot.getBoundingClientRect();
      const start = logoStartPose(stage.getBoundingClientRect(), destination, size.getBoundingClientRect().width);
      renderWidth.set(destination.width * Math.max(1, start.scale));
      startX.set(start.x);
      startY.set(start.y);
      startScale.set(start.scale);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot);
    observer.observe(size);
    observer.observe(stage);
    window.addEventListener("resize", measure, { passive: true });
    document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [enabled, startX, startY, startScale, renderWidth]);

  return <span ref={anchor} className="hero-brand-anchor">
    <span className="hero-brand-slot group-logo" aria-hidden="true" />
    <span ref={ruler} className="hero-logo-ruler" aria-hidden="true" />
    <motion.span className="hero-traveling-logo" style={{ width: enabled ? renderWidth : "100%", transform: enabled ? transform : "none", transformOrigin: "0 0" }}>
      <GroupLogo light sizes="671px" />
    </motion.span>
  </span>;
}

export function HeroChoreography() {
  const { progress, sceneProgress, enabled, seek } = useHeroScroll();
  const title = useRef<HTMLHeadingElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLAnchorElement>(null);
  const lastGate = useRef(heroVisibility(0));
  const [gate, setGate] = useState(() => heroVisibility(0));
  const welcomeOpacity = useTransform(progress, [...timing.welcome], [1, 0], { ease });
  const headerOpacity = useTransform(progress, [...timing.header], [0, 1], { ease });
  const hintOpacity = useTransform(progress, [...timing.hint], [1, 0], { ease });
  const contentOpacity = useTransform(progress, [...timing.content], [0, 1], { ease });

  const syncGate = () => {
    const next = heroVisibility(progress.get(), sceneProgress.get());
    if (next.header === lastGate.current.header && next.content === lastGate.current.content && next.actions === lastGate.current.actions && next.hint === lastGate.current.hint && next.benefits === lastGate.current.benefits) return;
    const focused = document.activeElement;
    if ((!next.content && title.current?.parentElement?.contains(focused)) || (!next.actions && actions.current?.contains(focused)) || (!next.header && header.current?.contains(focused)) || (!next.hint && hint.current === focused)) {
      // The skip link stays visible on focus even throughout the logo journey.
      document.querySelector<HTMLAnchorElement>(".skip-link")?.focus({ preventScroll: true });
    }
    lastGate.current = next;
    setGate(next);
  };
  useMotionValueEvent(progress, "change", syncGate);
  useMotionValueEvent(sceneProgress, "change", syncGate);

  const revealContent = () => {
    seek(1);
    requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
  };
  useEffect(() => {
    if (!enabled) return;
    const link = document.querySelector<HTMLAnchorElement>(".skip-link");
    if (!link) return;
    return bindHeroSkipLink(link, () => {
      seek(1);
      requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
    });
  }, [enabled, seek]);

  return <>
    <motion.div ref={header} className="hero-header-reveal" inert={enabled && !gate.header ? true : undefined} aria-hidden={enabled && !gate.header ? true : undefined} style={{ "--hero-nav-opacity": enabled ? headerOpacity : 1, pointerEvents: enabled && !gate.header ? "none" : "auto" } as CSSProperties}>
      <Header hero heroBrand={<TravelingLogo />} ctaIcon={<HeroArrow />} />
    </motion.div>
    <motion.div className="hero-welcome" aria-hidden="true" style={{ opacity: enabled ? welcomeOpacity : 0 }}>
      <div className="hero-welcome-layout"><p className="hero-welcome-title">Seja bem-vindo ao futuro.</p></div>
    </motion.div>
    <motion.div className="container hero-content hero-institutional" aria-hidden={enabled && !gate.content ? true : undefined} style={enabled ? { opacity: contentOpacity } : { opacity: 1 }} data-node-id="26:149">
      <h1 ref={title} id="hero-title" tabIndex={-1} data-node-id="26:153"><span className="sr-only">Soluções integradas para um futuro mais inteligente.</span><TitleLines /></h1>
      <ScrollExit range={exit.description} distance={20} className="hero-description-exit"><p className="hero-description" data-node-id="26:154"><span className="sr-only">{description}</span><span aria-hidden="true">{descriptionWords.map((word, index) => <span key={index}><ScrollWord range={timing.description} index={index} count={descriptionWords.length} distance={34}>{word}</ScrollWord>{" "}</span>)}</span></p></ScrollExit>
      <div ref={actions} inert={enabled && !gate.actions ? true : undefined} aria-hidden={enabled && !gate.actions ? true : undefined}>
        <ScrollReveal range={timing.actions} distance={48} exitRange={exit.actions} exitDistance={20} className="hero-actions" nodeId="26:155">
          <ButtonLink href="#nossas-empresas" icon={<HeroArrow />}>Conheça nossas empresas</ButtonLink>
        </ScrollReveal>
      </div>
    </motion.div>
    <ScrollReveal range={timing.benefits} distance={40} exitRange={exit.benefits} exitDistance={22} className="container hero-bottom" hidden={enabled && !gate.benefits} nodeId="26:164">
      <div className="benefits">{benefits.map(({ title, detail }) => <div className="benefit" key={title}><p><strong>{title}</strong><span>{detail}</span></p></div>)}</div>
    </ScrollReveal>
    <motion.a ref={hint} href="#hero-title" className="hero-scroll-invitation" aria-label="Role para explorar ou clique para ir ao conteúdo" tabIndex={enabled && gate.hint ? 0 : -1} aria-hidden={!enabled || !gate.hint ? true : undefined} onClick={event => { event.preventDefault(); revealContent(); }} style={enabled ? { opacity: hintOpacity, pointerEvents: gate.hint ? "auto" : "none" } : { opacity: 0, pointerEvents: "none" }}>
      <HeroArrow down />Role para explorar
    </motion.a>
    <span className="image-caption">Imagem conceitual gerada por IA</span>
  </>;
}
