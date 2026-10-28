import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { CompaniesIntro } from "@/components/home/companies-intro";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div id="inicio" className="hero-shell">
      <Header />
      <main id="conteudo"><Hero /><CompaniesIntro /></main>
    </div>
    <Footer />
  </>;
}
