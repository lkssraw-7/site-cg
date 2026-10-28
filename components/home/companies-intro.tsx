"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CompanyLogo } from "@/components/ui/brand";
import { companies } from "@/data/site";

export function CompaniesIntro() {
  const reduced = useReducedMotion();
  const [ref, api] = useEmblaCarousel({ align: "start", loop: false, duration: reduced ? 0 : 24, breakpoints: { "(min-width: 801px)": { active: false } } });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const sync = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap()); setCanPrev(api.canScrollPrev()); setCanNext(api.canScrollNext());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    api.on("select", sync).on("reInit", sync);
    const frame = requestAnimationFrame(sync);
    return () => { cancelAnimationFrame(frame); api.off("select", sync).off("reInit", sync); };
  }, [api, sync]);
  return <section id="nossas-empresas" className="companies-section" aria-labelledby="companies-title">
    <div className="container">
      <div className="section-heading">
        <p className="eyebrow orange">Nosso ecossistema</p>
        <h2 id="companies-title">Três especialidades.<br className="mobile-break" /> Uma visão em comum.</h2>
        <p>Integramos tecnologia, eficiência e bem-estar para transformar espaços e vidas.</p>
      </div>
      <div ref={ref} className="companies-viewport" role="region" aria-roledescription="carrossel" aria-label="Empresas do Cordeiro Group">
        <div className="companies-grid">
          {companies.map((company, index) => <article className={`company company--${company.id}`} key={company.id} aria-label={`${index + 1} de ${companies.length}: ${company.name}`}>
            <Link href={company.href} className="company-link" onFocus={() => api?.scrollTo(index, true)}>
              <h3 className="sr-only">{company.name}</h3>
              <div aria-hidden="true"><CompanyLogo company={company.id} /></div>
              <p>{company.description}</p>
              <motion.span className="company-discover" whileHover={reduced ? undefined : { x: 3 }}>Conhecer <ArrowRight size={17} aria-hidden="true" /></motion.span>
            </Link>
          </article>)}
        </div>
      </div>
      <div className="carousel-controls">
        <motion.button type="button" aria-label="Empresa anterior" disabled={!canPrev} onClick={() => api?.scrollPrev(Boolean(reduced))} whileTap={reduced ? undefined : { scale: 0.92 }}><ArrowLeft size={18} /></motion.button>
        <div className="carousel-dots">{companies.map((c, i) => <motion.button key={c.id} type="button" aria-label={`Mostrar ${c.name}`} aria-current={selected === i ? "true" : undefined} onClick={() => api?.scrollTo(i, Boolean(reduced))} whileTap={reduced ? undefined : { scale: 0.9 }}><span /></motion.button>)}</div>
        <motion.button type="button" aria-label="Próxima empresa" disabled={!canNext} onClick={() => api?.scrollNext(Boolean(reduced))} whileTap={reduced ? undefined : { scale: 0.92 }}><ArrowRight size={18} /></motion.button>
        <span className="sr-only" aria-live="polite">{companies[selected]?.name}</span>
      </div>
    </div>
  </section>;
}
