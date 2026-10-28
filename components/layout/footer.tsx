import Link from "next/link";
import type { CompanyId } from "@/data/ecosystem";
import { Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { GroupLogo } from "@/components/ui/brand";
import { site, companies, companyContact } from "@/data/site";

export function Footer({ company, compact = false }: { company?: CompanyId; compact?: boolean }) {
  const current = companies.find(c => c.id === company);
  const contact = current ? companyContact(current.contact) : site.whatsapp;
  return <footer id={compact ? "rodape" : "contato"} className="site-footer">
    <div className="container">
      {!compact && <div className="contact-heading">
        <div><p className="eyebrow">Vamos construir o próximo passo</p><h2>O seu projeto começa<br />com uma boa conversa.</h2></div>
        <ButtonLink href={contact} external>Falar pelo WhatsApp</ButtonLink>
      </div>}
      <div className="footer-grid">
        <div className="footer-brand"><Link href={company ? "/" : "#inicio"} aria-label="Cordeiro Group — voltar ao início"><GroupLogo light /></Link><p>Engenharia. Energia. Automação.<br />Soluções que se conectam à sua vida.</p></div>
        <div className="footer-contact"><h3>Fale com a equipe</h3><a href={`mailto:${site.email}`}><Mail size={17} aria-hidden="true" />{site.email}</a><a href={site.phoneHref}><Phone size={17} aria-hidden="true" />{site.phone}</a><a className="second-phone" href={site.secondPhoneHref}>{site.secondPhone}</a></div>
        <div className="footer-location"><h3>Onde estamos</h3><p><MapPin size={17} aria-hidden="true" /><span>{site.location}<small>{site.address}</small></span></p></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Cordeiro Group. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo ↑</a></div>
    </div>
  </footer>;
}
