"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type CSSProperties } from "react";
import TiltedCard, { TiltedCardLayer } from "@/components/ui/tilted-card";
import { useSiteReducedMotion } from "@/components/motion/motion-system";
import { useCompanyRouteTransition } from "@/components/motion/company-route-transition";
import { journeyChapters } from "@/data/home-journey";
import "./company-showcase.css";

const imageAlts = [
  "Sol nascente acima das nuvens, início da experiência V3 Energia Solar",
  "Instalações e infraestrutura de engenharia elétrica",
  "Ambiente residencial com tecnologia integrada",
];

export function EcosystemJourney() {
  const navigate = useCompanyRouteTransition();
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = useSiteReducedMotion() === true || systemReducedMotion === true;

  return (
    <section id="nossas-empresas" className="company-showcase" aria-labelledby="company-showcase-title">
      <div className="company-showcase__inner">
        <p className="company-showcase__eyebrow">Nossas empresas</p>
        <h2 id="company-showcase-title">Três frentes, um só propósito.</h2>

        <div className="company-showcase__grid">
          {journeyChapters.map((chapter, index) => {
            const cardImage = chapter.company === "solar" ? "/images/v3-clouds-poster.jpg" : chapter.image;
            const cardPosition = chapter.company === "solar" ? "70% center" : chapter.imagePosition;
            const destination = { href: chapter.href, image: cardImage, imagePosition: cardPosition };
            return (
              <article
                key={chapter.id}
                id={chapter.id}
                className={`company-card company-card--${chapter.company}`}
                style={{ "--card-position": cardPosition } as CSSProperties}
              >
                <TiltedCard
                  imageSrc={cardImage}
                  altText={imageAlts[index]}
                  captionText={chapter.name}
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  perspective={2000}
                  radius={37}
                  glare={reducedMotion ? 0 : 0.3}
                  parallax={reducedMotion ? 0 : 1.4}
                  trackWindow={!reducedMotion}
                  floating={!reducedMotion}
                  scaleOnHover={reducedMotion ? 1 : 1.08}
                  rotateAmplitude={reducedMotion ? 0 : 9}
                  gyroscope={false}
                  intro={!reducedMotion}
                >
                  <TiltedCardLayer depth={24}>
                    <span className="company-card__shade" aria-hidden="true" />
                    <Link
                      href={chapter.href}
                      className="company-card__trigger"
                      aria-label={`Conheça ${chapter.name}`}
                      onClick={(event) => navigate(event, destination)}
                    >
                      <span className="company-card__heading">
                        <span className="company-card__number">0{index + 1}</span>
                        <strong>{chapter.name}</strong>
                        <small>{chapter.category.split(" / ")[1]}</small>
                      </span>
                      <span className="company-card__toggle" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.7} /></span>
                    </Link>
                    <div className="company-card__details">
                      <p>{chapter.summary}</p>
                      <Link href={chapter.href} aria-label={`${chapter.cta} — abrir página`} onClick={(event) => navigate(event, destination)}>
                        {chapter.cta} <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
                      </Link>
                    </div>
                  </TiltedCardLayer>
                </TiltedCard>
              </article>
            );
          })}
        </div>

        <p className="company-showcase__description">
          Energia solar, engenharia elétrica e automação residencial. Três áreas conectadas pela inovação.
        </p>
      </div>
    </section>
  );
}
