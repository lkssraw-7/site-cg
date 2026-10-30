import Image from "next/image";
import { ContactForm } from "./contact-form";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BatteryCharging, Building2, Cable, CircuitBoard, Cpu, DraftingCompass, Factory, House, Lightbulb, PanelsTopLeft, PlugZap, ShieldCheck, Smartphone, Sun, Thermometer, Volume2, Wrench } from "lucide-react";
import { CompanyLogo } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { AnimatedImage, HeroContent, Reveal, type RevealVariant } from "@/components/motion/motion-system";
import { companies, companyContact } from "@/data/site";
import type { CompanyId, Project, Service } from "@/data/ecosystem";

const icons = { draft: DraftingCompass, plug: PlugZap, panel: CircuitBoard, cpu: Cpu, shield: ShieldCheck, tool: Wrench, grid: Cable, battery: BatteryCharging, sun: Sun, light: Lightbulb, curtain: PanelsTopLeft, audio: Volume2, climate: Thermometer, phone: Smartphone };

export function SectionHeading({ eyebrow, title, text, id, light = false, motion: variant }: { eyebrow: string; title: string; text?: string; id?: string; light?: boolean; motion?: RevealVariant }) {
  const content = <><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>{text && <p>{text}</p>}</>;
  const className = `service-heading${light ? " service-heading--light" : ""}`;
  return variant ? <Reveal className={className} variant={variant}>{content}</Reveal> : <div className={className}>{content}</div>;
}

export function ServiceHero({ company, title, description, image, alt, secondary = "Conhecer serviços" }: { company: CompanyId; title: string; description: string; image: string; alt: string; secondary?: string }) {
  const current = companies.find(c => c.id === company)!;
  return <section className="service-hero" aria-labelledby="service-title">
    <AnimatedImage className="service-hero-photo" hero><Image src={image} alt={alt} fill preload sizes="100vw" quality={85} /></AnimatedImage>
    <div className="service-hero-shade" />
    <HeroContent className="container service-hero-content">
      <Link className="back-to-group" href="/"><ArrowLeft size={14} aria-hidden="true" /> Um ecossistema. Mais possibilidades.</Link>
      <div className="hero-company-brand" aria-label={current.name}><CompanyLogo company={company} /></div>
      <Reveal mode="load" variant={company === "dreamhome" ? "fade" : "rise"}><h1 id="service-title">{title}</h1></Reveal>
      <Reveal mode="load" variant="fade" delay={.06}><p className="service-hero-description">{description}</p></Reveal>
      <div className="service-hero-actions">
        <ButtonLink href={companyContact(current.contact)} external>{company === "dreamhome" ? "Falar com um especialista" : "Solicitar orçamento"}</ButtonLink>
        <ButtonLink href="#servicos" variant="outline">{secondary}</ButtonLink>
      </div>
    </HeroContent>
    <span className="image-caption">Imagem conceitual gerada por IA</span>
  </section>;
}

export function ServicesGrid({ services, visual = false, listed = false }: { services: Service[]; visual?: boolean; listed?: boolean }) {
  return <div className={`services-grid${visual ? " services-grid--visual" : ""}${listed ? " services-grid--listed" : ""}`}>
    {services.map((service, i) => {
      const Icon = icons[service.icon as keyof typeof icons] ?? PlugZap;
      return <article className={`service-card${service.image ? " service-card--image" : ""}`} key={service.title}>
        {service.image && <div className="service-card-image"><AnimatedImage className="image-fill"><Image src={service.image} alt={`Conceito ilustrativo para ${service.title.toLowerCase()}`} fill sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 700px" style={{ objectPosition: service.position }} /></AnimatedImage><span>Conceito ilustrativo</span></div>}
        <div className="service-card-body"><div className="service-card-top"><Icon size={27} strokeWidth={1.4} aria-hidden="true" /><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.text}</p></div>
      </article>;
    })}
  </div>;
}

export function Segments({ title = "Da sua casa à sua operação." }: { title?: string }) {
  return <section className="segments-section section-pad" aria-labelledby="segments-title"><div className="container">
    <SectionHeading eyebrow="Áreas de atuação" title={title} id="segments-title" text="Soluções que consideram o uso, a escala e as necessidades de cada espaço." />
    <div className="segments-grid">{[{ title: "Residencial", text: "Casas e ambientes para viver melhor.", Icon: House }, { title: "Comercial", text: "Espaços preparados para o seu negócio.", Icon: Building2 }, { title: "Industrial", text: "Infraestrutura para a sua operação.", Icon: Factory }].map(({ title, text, Icon }) => <article className="segment" key={title}><Icon size={35} strokeWidth={1.25} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
  </div></section>;
}

export function ProcessTimeline({ steps, solar = false }: { steps: { title: string; text: string }[]; solar?: boolean }) {
  return <section className={`process-section section-pad${solar ? " process-section--solar" : ""}`} aria-labelledby="process-title"><div className="container">
    <SectionHeading eyebrow={solar ? "Como funciona" : "Do primeiro contato à solução"} title={solar ? "Um caminho claro até a sua geração." : "Cada etapa tem um propósito."} id="process-title" light={!solar} />
    <div className={`process-grid${solar ? " process-grid--five" : ""}`}>{steps.map((step, index) => <article className="process-step" key={step.title}><div className="process-track" aria-hidden="true"><Reveal variant="line" once delay={index * .06} className="process-rule" /></div><span className="process-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    <p className="process-note">Etapas de referência. Escopo, prazos e acompanhamento são definidos na avaliação e na proposta do seu projeto.</p>
  </div></section>;
}

export function ProjectsGallery({ projects = [], company, illustrative = false }: { projects?: Project[]; company: CompanyId; illustrative?: boolean }) {
  const c = companies.find(c => c.id === company)!;
  return <section id="projetos" className="projects-section section-pad" aria-labelledby="projects-title"><div className="container">
    <SectionHeading motion="fade" eyebrow={illustrative ? "Ambientes & possibilidades" : "Projetos e realizações"} title={illustrative ? "Inspire-se no seu próximo ambiente." : projects.length ? "Soluções que saem do papel." : "Seu próximo projeto merece atenção."} id="projects-title" text={illustrative ? "Demonstrações visuais de interiores e áreas externas. Imagens conceituais, sem atribuição a trabalhos executados." : projects.length ? "Registros de serviços realizados, publicados no portfólio oficial da V3 Energia Solar." : "Conheça com a equipe as referências de trabalhos que se aproximam do que você precisa."} />
    {projects.length ? <div className={`projects-grid${projects.length === 2 ? " projects-grid--two" : ""}`}>{projects.map(project => <article className="project-card" key={project.image}><figure><div className="project-image"><Reveal variant="settle" once className="image-fill"><Image src={project.image} alt={project.alt} fill sizes="(max-width: 600px) 90vw, 45vw" /></Reveal></div><figcaption><h3>{project.title}</h3><p>{project.caption}</p></figcaption></figure></article>)}</div> : <div className="project-reference"><CircuitBoard size={42} strokeWidth={1.1} aria-hidden="true" /><div><h3>Uma referência para a sua necessidade.</h3><p>Converse sobre projetos elétricos, painéis e automação industrial. Solicite à equipe exemplos e informações sobre trabalhos executados.</p></div><ButtonLink href={companyContact("referências de projetos realizados pela Cordeiro Engenharia")} external>Solicitar referências</ButtonLink></div>}
    {company === "solar" && <a className="source-link" href="https://www.v3energiasolar.com.br/" target="_blank" rel="noopener noreferrer">Fonte das imagens: portfólio oficial V3 <ArrowUpRight size={14} /><span className="sr-only"> (nova aba)</span></a>}
    {!projects.length && <p className="portfolio-note">A seleção de imagens e informações dos projetos para esta galeria está em preparação.</p>}
    <span className="sr-only">{c.name}</span>
  </div></section>;
}

export function ContactCTA({ company, title, text, label }: { company: CompanyId; title: string; text: string; label: string }) {
  const c = companies.find(c => c.id === company)!;
  return <section id="contato" className="company-cta section-pad" aria-labelledby="cta-title"><div className="container company-cta-inner"><Reveal variant="fade" once><p className="eyebrow">Vamos falar sobre o seu projeto</p><h2 id="cta-title">{title}</h2><p>{text}</p></Reveal><ButtonLink href={companyContact(c.contact)} external>{label}</ButtonLink></div><div className="container"><ContactForm company={company} /></div></section>;
}

export function EcosystemNav({ current }: { current: CompanyId }) {
  return <nav className="ecosystem-nav" aria-label="Explore o ecossistema"><div className="container"><Link href="/">← Voltar ao Cordeiro Group</Link><div>{companies.filter(c => c.id !== current).map(c => <Link key={c.id} href={c.href}>{c.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div></div></nav>;
}
