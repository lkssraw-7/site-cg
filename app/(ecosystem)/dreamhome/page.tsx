import type { Metadata } from "next";
import { Armchair, Lightbulb, ShieldCheck, Smartphone } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactCTA, EcosystemNav, ProjectsGallery, SectionHeading, ServiceHero, ServicesGrid } from "@/components/ecosystem/shared";
import { SmartScenes } from "@/components/ecosystem/smart-scenes";
import { dreamServices } from "@/data/ecosystem";

const title = "DreamHome | Automação residencial e casa inteligente";
const description = "Iluminação, cortinas, climatização, segurança e entretenimento. Descubra a automação residencial DreamHome, parte do Cordeiro Group.";
export const metadata: Metadata = { title, description, openGraph: { title, description, type: "website", locale: "pt_BR" } };

export default function DreamHomePage() {
  return <div className="service-page dreamhome-page" id="inicio">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header company="dreamhome" />
    <main id="conteudo" tabIndex={-1}>
      <ServiceHero company="dreamhome" title="Sua casa, mais inteligente. Sua rotina, mais simples." description="Automação residencial que conecta conforto, praticidade e tecnologia. Ambientes que acompanham o seu jeito de viver." image="/images/dreamhome-hero.webp" alt="Conceito ilustrativo de sala contemporânea com iluminação integrada" secondary="Conhecer soluções" />
      <div className="service-benefit-strip"><div className="container">{[{ Icon: Armchair, title: "Conforto no dia a dia" }, { Icon: ShieldCheck, title: "Segurança integrada" }, { Icon: Smartphone, title: "Controle pelo smartphone" }, { Icon: Lightbulb, title: "Ambientes conectados" }].map(({ Icon, title }) => <div key={title}><Icon size={23} strokeWidth={1.4} /><span>{title}</span></div>)}</div></div>
      <section id="sobre" className="section-pad company-about"><div className="container about-grid"><SectionHeading motion="rise" eyebrow="DreamHome · Cordeiro Group" title="Tecnologia que você sente. Sem complicar a vida." /><div className="about-copy"><p className="lead-text">Mais do que conectar dispositivos, conectar a casa à sua rotina.</p><p>A DreamHome é a frente de automação residencial do Cordeiro Group. Integra funções e ambientes para tornar os comandos do dia a dia mais práticos.</p><p>Da iluminação às cortinas, do entretenimento ao controle de temperatura, cada solução parte da forma como você quer viver o seu espaço.</p></div></div></section>
      <section id="servicos" className="section-pad service-section"><div className="container"><SectionHeading eyebrow="Sua casa, suas possibilidades" title="Pequenos gestos. Uma nova experiência." text="Soluções que podem funcionar de forma integrada, conforme o projeto e a compatibilidade dos equipamentos." /><ServicesGrid services={dreamServices} visual /></div></section>
      <section className="scene-section section-pad" aria-labelledby="scenes-title"><div className="container"><SectionHeading motion="fade" eyebrow="Uma casa inteligente na prática" title="Um toque muda o momento." text="Selecione uma cena e descubra como diferentes funções podem trabalhar juntas." id="scenes-title" light /><SmartScenes /></div></section>
      <ProjectsGallery company="dreamhome" illustrative projects={[
        { image: "/images/dreamhome-hero.webp", title: "Sala de estar, do seu jeito", caption: "Conceito ilustrativo · iluminação, cortinas e entretenimento.", alt: "Conceito gerado por IA de sala de estar com luzes integradas" },
        { image: "/images/residencia-hero.webp", title: "Conforto além da porta", caption: "Conceito ilustrativo · ambientes e áreas externas.", alt: "Conceito gerado por IA de residência com varanda e área externa iluminadas" },
      ]} />
      <ContactCTA company="dreamhome" title="Transforme sua casa em um ambiente inteligente." text="Conte como você imagina viver. Vamos conversar sobre as possibilidades." label="Solicitar projeto" />
      <EcosystemNav current="dreamhome" />
    </main><Footer company="dreamhome" compact />
  </div>;
}
