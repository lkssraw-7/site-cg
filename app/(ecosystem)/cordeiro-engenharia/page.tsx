import type { Metadata } from "next";
import { CircuitBoard, Cpu, DraftingCompass, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactCTA, EcosystemNav, ProcessTimeline, ProjectsGallery, SectionHeading, Segments, ServiceHero, ServicesGrid } from "@/components/ecosystem/shared";
import { Reveal } from "@/components/motion/motion-system";
import { engineeringServices, engineeringSteps } from "@/data/ecosystem";

const title = "Cordeiro Engenharia | Projetos elétricos e automação";
const description = "Projetos elétricos, painéis, instalações e automação industrial. Conheça a Cordeiro Engenharia, empresa do Cordeiro Group em Indaiatuba/SP.";
export const metadata: Metadata = { title, description, openGraph: { title, description, type: "website", locale: "pt_BR" } };

export default function EngineeringPage() {
  return <div className="service-page engineering-page" id="inicio">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header company="engenharia" />
    <main id="conteudo">
      <ServiceHero company="engenharia" title="Engenharia elétrica para projetos que exigem segurança e eficiência." description="Do projeto à instalação, soluções técnicas para residências, comércios e indústrias. Precisão em cada detalhe. Propósito em cada conexão." image="/images/engenharia-hero.webp" alt="Conceito ilustrativo de um engenheiro inspecionando painéis elétricos" />
      <div className="service-benefit-strip"><div className="container">{[{ Icon: DraftingCompass, title: "Projetos elétricos" }, { Icon: CircuitBoard, title: "Montagem de painéis" }, { Icon: Cpu, title: "Automação industrial" }, { Icon: ShieldCheck, title: "Soluções técnicas" }].map(({ Icon, title }) => <div key={title}><Icon size={23} strokeWidth={1.4} /><span>{title}</span></div>)}</div></div>
      <section id="sobre" className="section-pad company-about"><div className="container about-grid">
        <SectionHeading eyebrow="Cordeiro Engenharia · Cordeiro Group" title="A base técnica de grandes possibilidades." />
        <Reveal delay={0.1}><p className="lead-text">Uma instalação bem planejada conecta segurança, funcionalidade e eficiência.</p><p>A Cordeiro Engenharia atua em projetos elétricos, instalações, montagem de painéis e automação. Sediada em Indaiatuba, integra o Cordeiro Group com soluções para ambientes residenciais, comerciais e industriais.</p><p>Uma frente dedicada a entender o que o seu espaço ou processo precisa — e transformar essa necessidade em uma solução elétrica.</p></Reveal>
      </div></section>
      <section id="servicos" className="section-pad service-section"><div className="container"><SectionHeading eyebrow="Soluções completas" title="Técnica aplicada ao que você precisa." text="Serviços elétricos e de automação para diferentes momentos de um projeto." id="services-title" /><ServicesGrid services={engineeringServices} /></div></section>
      <Segments /><ProcessTimeline steps={engineeringSteps} /><ProjectsGallery company="engenharia" />
      <ContactCTA company="engenharia" title="Precisa de uma solução em engenharia elétrica?" text="Conte sobre a sua necessidade e converse com a nossa equipe." label="Fale com nossa equipe" />
      <EcosystemNav current="engenharia" />
    </main><Footer company="engenharia" compact />
  </div>;
}
