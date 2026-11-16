"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { MotionToggle, useSiteReducedMotion } from "@/components/motion/motion-system";
import { GroupLogo } from "@/components/ui/brand";
import { companies, site } from "@/data/site";
import "./cinematic-footer.css";

const marqueeItems = ["Cordeiro Group", "Engenharia elétrica", "Energia solar", "Automação residencial"];

function MarqueeSequence() {
  return <span className="cinematic-footer__marquee-sequence">
    {marqueeItems.map((item) => <span className="cinematic-footer__marquee-item" key={item}>{item}<span aria-hidden="true">✦</span></span>)}
  </span>;
}

function MagneticLink({ href, children, primary = false, external = false, reduced = false }: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  external?: boolean;
  reduced?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const origin = useRef<DOMRect | null>(null);

  useEffect(() => {
    const element = ref.current;
    return () => { if (element) gsap.killTweensOf(element); };
  }, []);

  useEffect(() => {
    if (!reduced || !ref.current) return;
    origin.current = null;
    gsap.killTweensOf(ref.current);
    gsap.set(ref.current, { x: 0, y: 0, rotateX: 0, rotateY: 0 });
  }, [reduced]);

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const element = ref.current;
    if (!element) return;
    const rect = origin.current ?? element.getBoundingClientRect();
    origin.current = rect;
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(element, { x: x * 14, y: y * 10, rotateX: -y * 3, rotateY: x * 3, duration: .28, ease: "power2.out", overwrite: "auto" });
  };

  const reset = () => {
    origin.current = null;
    const element = ref.current;
    if (!element) return;
    if (reduced) gsap.set(element, { x: 0, y: 0, rotateX: 0, rotateY: 0 });
    else gsap.to(element, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: .45, ease: "power2.out", overwrite: "auto" });
  };

  return <a
    ref={ref}
    href={href}
    className={`cinematic-footer__pill ${primary ? "cinematic-footer__pill--primary" : "cinematic-footer__pill--secondary"}`}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    onPointerMove={move}
    onPointerLeave={reset}
    onBlur={reset}
  >{children}<ArrowUpRight size={19} strokeWidth={1.8} aria-hidden="true" /></a>;
}

export function CinematicFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const siteReduced = useSiteReducedMotion();
  const systemReduced = useReducedMotion();
  const reduced = siteReduced === true || systemReduced === true;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(wordRef.current, { y: 72, opacity: 0 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: .4 },
      });
      gsap.fromTo(calloutRef.current, { y: 34, opacity: .45 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: root, start: "top 85%", end: "top 42%", scrub: .35 },
      });
      const columns = detailsRef.current?.querySelectorAll(".cinematic-footer__column");
      if (columns?.length) gsap.fromTo(columns, { y: 25, opacity: .35 }, {
        y: 0, opacity: 1, stagger: .06, ease: "none",
        scrollTrigger: { trigger: detailsRef.current, start: "top 90%", end: "top 60%", scrub: .35 },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return <footer ref={rootRef} id="contato" className="cinematic-footer" aria-labelledby="cinematic-footer-title">
    <div className="cinematic-footer__ambient" aria-hidden="true" />
    <div className="cinematic-footer__grid-texture" aria-hidden="true" />
    <div ref={wordRef} className="cinematic-footer__wordmark" aria-hidden="true">CORDEIRO</div>

    <div className="cinematic-footer__marquee" aria-hidden="true">
      <div className="cinematic-footer__marquee-track"><MarqueeSequence /><MarqueeSequence /></div>
    </div>

    <div className="cinematic-footer__stage">
      <div ref={calloutRef} className="cinematic-footer__callout">
        <p className="cinematic-footer__eyebrow">O seu projeto começa com uma boa conversa.</p>
        <h2 id="cinematic-footer-title">Vamos dar o<br />primeiro passo?</h2>
        <div className="cinematic-footer__actions">
          <MagneticLink href={site.whatsapp} primary external reduced={reduced}>Falar pelo WhatsApp</MagneticLink>
          <MagneticLink href={`mailto:${site.email}`} reduced={reduced}>Enviar um e-mail</MagneticLink>
        </div>
      </div>
    </div>

    <div ref={detailsRef} className="cinematic-footer__details">
      <div className="cinematic-footer__column cinematic-footer__brand">
        <Link href="#inicio" aria-label="Cordeiro Group — voltar ao início"><GroupLogo light /></Link>
        <p>Engenharia elétrica, energia solar e automação residencial.<br />Soluções que se conectam à sua vida.</p>
      </div>
      <nav className="cinematic-footer__column cinematic-footer__companies" aria-label="Empresas do grupo">
        <h3>Nossas empresas</h3>
        {companies.map((company) => <Link href={company.href} key={company.id}>{company.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}
      </nav>
      <div className="cinematic-footer__column cinematic-footer__contact">
        <h3>Fale com a equipe</h3>
        <a href={`mailto:${site.email}`}><Mail size={17} aria-hidden="true" />{site.email}</a>
        <a href={site.phoneHref}><Phone size={17} aria-hidden="true" />{site.phone}</a>
        <a href={site.secondPhoneHref}><Phone size={17} aria-hidden="true" />{site.secondPhone}</a>
      </div>
      <div className="cinematic-footer__column cinematic-footer__location">
        <h3>Onde estamos</h3>
        <p><MapPin size={18} aria-hidden="true" /><span>{site.location}<small>{site.address}</small></span></p>
      </div>
    </div>

    <div className="cinematic-footer__bottom">
      <span>© {new Date().getFullYear()} Cordeiro Group. Todos os direitos reservados.</span>
      <div className="cinematic-footer__utilities"><MotionToggle /><a href="#inicio">Voltar ao topo <ArrowUp size={16} aria-hidden="true" /></a></div>
    </div>
  </footer>;
}
