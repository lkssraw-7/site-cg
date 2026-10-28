import Image from "next/image";
import { ArrowDown, HousePlug, Leaf, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/data/site";

const benefits = [
  { Icon: Zap, title: "Mais eficiência", detail: "para o seu dia a dia" },
  { Icon: Leaf, title: "Soluções sustentáveis", detail: "para o futuro" },
  { Icon: HousePlug, title: "Tecnologia que transforma", detail: "o seu jeito de viver" },
];

export function Hero() {
  return <section className="hero" id="o-grupo" aria-labelledby="hero-title">
    <Image src="/images/residencia-hero.webp" alt="Conceito ilustrativo de uma residência contemporânea com iluminação integrada e piscina ao entardecer" fill preload sizes="100vw" className="hero-image" quality={85} />
    <div className="hero-shade" />
    <div className="container hero-content">
      <p className="eyebrow hero-eyebrow"><span>Engenharia</span><i /><span>Energia</span><i /><span>Automação</span></p>
      <h1 id="hero-title">Soluções integradas<br className="desktop-break" /> para um futuro<br className="desktop-break" /> mais inteligente<span>.</span></h1>
      <p className="hero-description">O Cordeiro Group reúne engenharia, energia solar<br className="wide-break" /> e automação residencial para criar soluções<br className="wide-break" /> completas, seguras e sustentáveis.</p>
      <div className="hero-actions">
        <ButtonLink href="#nossas-empresas">Conheça nossas empresas</ButtonLink>
        <ButtonLink href={site.whatsapp} variant="outline" external>Fale com a equipe</ButtonLink>
      </div>
    </div>
    <div className="container hero-bottom">
      <div className="benefits">
        {benefits.map(({ Icon, title, detail }) => <div className="benefit" key={title}>
          <Icon aria-hidden="true" size={30} strokeWidth={1.35} />
          <p><strong>{title}</strong><span>{detail}</span></p>
        </div>)}
      </div>
      <a className="discover-link" href="#nossas-empresas" aria-label="Descubra nossas empresas"><ArrowDown size={20} aria-hidden="true" /></a>
    </div>
    <span className="image-caption">Imagem conceitual gerada por IA</span>
  </section>;
}
