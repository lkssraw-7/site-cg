"use client";
import { useSiteReducedMotion } from "@/components/motion/motion-system";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CompanyLogo } from "@/components/ui/brand";
import { companies } from "@/data/site";
import { Reveal } from "@/components/motion/motion-system";

export function CompaniesIntro() {
  const reduced = useSiteReducedMotion();
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
      <Reveal className="section-heading" variant="rise">
        <p className="eyebrow orange">Nosso ecossistema</p>
        <h2 id="companies-title">Três especialidades.<br className="mobile-break" /> Uma visão em comum.</h2>
        <p>Integramos tecnologia, eficiência e bem-estar para transformar espaços e vidas.</p>
      </Reveal>
      <div ref={ref} className="companies-viewport" role="region" aria-roledescription="carrossel" aria-label="Empresas do Cordeiro Group">
        <div className="companies-grid">
          {companies.map((company, index) => <article className={`company company--${company.id}`} key={company.id} aria-label={`${index + 1} de ${companies.length}: ${company.name}`}>
            <Reveal className="company-reveal" variant="fade" once delay={index * .06}><Link href={company.href} className="company-link" aria-label={`Conhecer ${company.name}`} onFocus={() => api?.scrollTo(index, true)}>
              <span className="company-index" aria-hidden="true">0{index + 1}</span>
              <h3 className="sr-only">{company.name}</h3>
              <div aria-hidden="true"><CompanyLogo company={company.id} /></div>
              <p>{company.description}</p>
              <span className="company-discover">Explorar soluções <ArrowRight size={17} aria-hidden="true" /></span>
            </Link></Reveal>
          </article>)}
        </div>
      </div>
      <div className="carousel-controls">
        <button type="button" aria-label="Empresa anterior" disabled={!canPrev} onClick={event => api?.scrollPrev(Boolean(reduced) || event.detail === 0)}><ArrowLeft size={18} aria-hidden="true" /></button>
        <div className="carousel-dots">{companies.map((c, i) => <button key={c.id} type="button" aria-label={`Mostrar ${c.name}`} aria-current={selected === i ? "true" : undefined} onClick={event => api?.scrollTo(i, Boolean(reduced) || event.detail === 0)}><span /></button>)}</div>
        <button type="button" aria-label="Próxima empresa" disabled={!canNext} onClick={event => api?.scrollNext(Boolean(reduced) || event.detail === 0)}><ArrowRight size={18} aria-hidden="true" /></button>
        <span className="sr-only" aria-live="polite">{companies[selected]?.name}</span>
      </div>
    </div>
  </section>;
}
