import type { Metadata } from "next";
import { BatteryCharging, ChartNoAxesCombined, Leaf, Sun } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactCTA, EcosystemNav, ProcessTimeline, ProjectsGallery, SectionHeading, Segments, ServiceHero, ServicesGrid } from "@/components/ecosystem/shared";
import { solarProjects, solarServices, solarSteps } from "@/data/ecosystem";

const title = "V3 Energia Solar | Sistemas fotovoltaicos";
const description = "Energia solar para sua casa ou empresa. Conheça as soluções on-grid, off-grid e híbridas da V3 Energia Solar, parte do Cordeiro Group.";
export const metadata: Metadata = { title, description, openGraph: { title, description, type: "website", locale: "pt_BR" } };

export default function SolarPage() {
  return <div className="service-page solar-page" id="inicio">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header company="solar" />
    <main id="conteudo" tabIndex={-1}>
      <ServiceHero company="solar" title="A energia do sol. Um novo futuro para você." description="Transforme a energia que você consome em novas possibilidades. Sistemas fotovoltaicos para sua casa ou empresa, do projeto à instalação." image="/images/solar-hero.webp" alt="Conceito ilustrativo de painéis fotovoltaicos no telhado de uma residência" secondary="Conhecer soluções" />
      <section className="solar-benefits section-pad" aria-labelledby="solar-benefits-title"><div className="container">
        <SectionHeading eyebrow="Por que energia solar?" title="Uma escolha que olha para a frente." id="solar-benefits-title" />
        <div className="solar-benefits-grid">{[
          { Icon: ChartNoAxesCombined, title: "Potencial de economia", text: "Geração própria para reduzir a energia comprada da rede, conforme o projeto e o consumo." },
          { Icon: Sun, title: "Mais previsibilidade", text: "Conheça o potencial de geração e planeje o uso de energia ao longo do tempo." },
          { Icon: Leaf, title: "Fonte renovável", text: "Aproveite a luz do sol como parte de uma rotina com energia renovável." },
          { Icon: BatteryCharging, title: "Novas possibilidades", text: "Soluções com armazenamento conforme a necessidade e a tecnologia escolhida." },
        ].map(({ Icon, title, text }) => <article className="solar-benefit" key={title}><Icon size={30} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>
      <section id="sobre" className="company-about solar-about section-pad"><div className="container about-grid"><SectionHeading motion="rise" light eyebrow="V3 Energia Solar · Cordeiro Group" title="Da luz do sol à energia do seu dia." /><div className="about-copy"><p className="lead-text">Tecnologia fotovoltaica, com uma solução pensada para o seu consumo.</p><p>A V3 é a frente de energia solar do Cordeiro Group. Atua com sistemas fotovoltaicos e soluções on-grid, off-grid e híbridas, conectando projeto, equipamentos e instalação.</p><p>O primeiro passo é entender o local e a sua necessidade. Economia e desempenho dependem do dimensionamento, da incidência solar e das condições de uso.</p></div></div></section>
      <section id="servicos" className="service-section section-pad"><div className="container"><SectionHeading eyebrow="Nossas soluções" title="O sistema certo começa com a sua necessidade." text="Três configurações de geração. Uma análise técnica para encontrar a mais adequada." /><ServicesGrid services={solarServices} /></div></section>
      <Segments title="Energia para viver. Energia para produzir." /><ProcessTimeline steps={solarSteps} solar /><ProjectsGallery company="solar" projects={solarProjects} />
      <ContactCTA company="solar" title="Comece a produzir sua própria energia." text="Converse com a V3 e solicite uma análise para o seu imóvel." label="Solicitar análise" />
      <EcosystemNav current="solar" />
    </main><Footer company="solar" compact />
  </div>;
}
