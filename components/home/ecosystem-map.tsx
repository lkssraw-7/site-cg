"use client";

import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { CompanyLogo } from "@/components/ui/brand";
import { ease, useSiteReducedMotion } from "@/components/motion/motion-system";
import { journeyChapters, type JourneyChapter } from "@/data/home-journey";

type VisitChapter = (event: MouseEvent<HTMLAnchorElement>, index: number) => void;
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function MapStep({ chapter, index, progress, animated, previewing, onVisit, onHover, onFocus }: {
  chapter: JourneyChapter;
  index: number;
  progress: MotionValue<number>;
  animated: boolean;
  previewing: boolean;
  onVisit: VisitChapter;
  onHover: (index: number | null) => void;
  onFocus: (index: number | null) => void;
}) {
  const start = Math.max(0, index * .26 - .05);
  const end = index * .26 + .22;
  const opacity = useTransform(progress, [start, end], [.76, 1]);
  const transform = useTransform(progress, [start, end], ["translateY(12px)", "translateY(0px)"]);
  const nodeOpacity = useTransform(progress, [Math.max(0, index * .425 - .1), index * .425 + .08], [.18, 1]);

  return <a
    className="journey-map-link"
    href={`#${chapter.id}`}
    aria-labelledby={`${chapter.id}-map-title ${chapter.id}-map-name`}
    aria-describedby={`${chapter.id}-map-summary`}
    data-previewing={previewing || undefined}
    onClick={event => onVisit(event, index)}
    onPointerEnter={event => { if (event.pointerType === "mouse") onHover(index); }}
    onPointerLeave={() => onHover(null)}
    onPointerCancel={() => onHover(null)}
    onFocus={() => onFocus(index)}
    onBlur={() => onFocus(null)}
  >
    <span className="journey-map-node" aria-hidden="true"><motion.span style={{ opacity: animated ? nodeOpacity : 1 }} /></span>
    <motion.div className="journey-map-content" style={animated ? { opacity, transform } : { opacity: 1, transform: "none" }}>
      <span className="journey-map-step"><span className="journey-map-number" aria-hidden="true">0{index + 1}</span><strong id={`${chapter.id}-map-title`}>{chapter.verb}</strong></span>
      <span className="sr-only" id={`${chapter.id}-map-name`}>{chapter.name}</span>
      <span className="journey-map-brand" aria-hidden="true"><CompanyLogo company={chapter.company} /></span>
      <p className="journey-map-summary" id={`${chapter.id}-map-summary`}>{chapter.summary}</p>
      <span className="journey-map-open" aria-hidden="true">Explorar ambiente <ArrowDownRight size={18} /></span>
    </motion.div>
  </a>;
}

/** A normal anchor navigation first; scroll and background previews are optional. */
export function EcosystemMap({ onVisit }: { onVisit: VisitChapter }) {
  const map = useRef<HTMLElement>(null);
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
  const systemReduced = useReducedMotion();
  const siteReduced = useSiteReducedMotion();
  const animated = hydrated && !systemReduced && !siteReduced;
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  // Keyboard focus owns the preview while the pointer is parked over another link.
  const preview = focused ?? hovered;
  const { scrollYProgress } = useScroll({ target: map, offset: ["start 0.9", "end 0.55"] });
  const lineX = useTransform(scrollYProgress, [0, .85], ["scaleX(0)", "scaleX(1)"]);
  const lineY = useTransform(scrollYProgress, [0, .85], ["scaleY(0)", "scaleY(1)"]);

  return <section className="journey-intro" id="nossas-empresas" aria-labelledby="journey-title" data-map-motion={animated || undefined}>
    <div className="journey-intro-previews" aria-hidden="true">
      {journeyChapters.map((chapter, index) => <motion.div
        key={chapter.id}
        className="journey-intro-preview"
        initial={false}
        animate={{ opacity: preview === index ? .17 : 0 }}
        transition={{ duration: animated ? .35 : 0, ease }}
      >
        <Image src={chapter.image} alt="" fill sizes="100vw" quality={85} style={{ objectPosition: chapter.imagePosition }} />
      </motion.div>)}
    </div>
    <div className="container journey-intro-content">
      <div className="journey-intro-heading">
        <div><p className="eyebrow orange">Um grupo. Possibilidades conectadas.</p><h2 id="journey-title">Da energia que geramos<br />à vida que transformamos.</h2></div>
        <p>Três especialidades, uma visão em comum. Percorra o nosso ecossistema e descubra como cada solução se conecta ao seu projeto.</p>
      </div>
      <nav ref={map} className="journey-map" aria-label="Explorar as empresas" onKeyDown={event => {
        if (event.key === "Escape") { setHovered(null); setFocused(null); }
      }}>
        <span className="journey-map-rail" aria-hidden="true">
          <motion.span className="journey-map-rail-horizontal" style={{ transform: animated ? lineX : "none" }} />
          <motion.span className="journey-map-rail-vertical" style={{ transform: animated ? lineY : "none" }} />
        </span>
        {journeyChapters.map((chapter, index) => <MapStep
          key={chapter.id} chapter={chapter} index={index} progress={scrollYProgress}
          animated={animated} previewing={preview === index} onVisit={onVisit}
          onHover={setHovered} onFocus={setFocused}
        />)}
      </nav>
      <p className="journey-map-caption" aria-hidden="true" data-visible={preview !== null || undefined}>
        {preview !== null ? `Prévia de ${journeyChapters[preview].name} · Imagem conceitual gerada por IA` : "\u00a0"}
      </p>
    </div>
  </section>;
}
