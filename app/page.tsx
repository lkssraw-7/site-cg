import { Hero } from "@/components/home/hero";
import { EcosystemJourney } from "@/components/home/ecosystem-journey";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div id="inicio" className="hero-shell home-curtain-content">
      <main id="conteudo" tabIndex={-1}><Hero /><EcosystemJourney /></main>
    </div>
    <Footer />
  </>;
}
