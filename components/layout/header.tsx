"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CompanyId } from "@/data/ecosystem";
import { Menu, X } from "lucide-react";
import { navigation, site, companies, companyContact } from "@/data/site";
import { GroupLogo } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";

export function Header({ company }: { company?: CompanyId }) {
  const current = companies.find(c => c.id === company);
  const links = company ? [{ label: "O Grupo", href: "/#o-grupo" }, { label: "Nossas empresas", href: "/#nossas-empresas" }, { label: "Soluções", href: "#servicos" }, { label: "Contato", href: "#contato" }] : navigation;
  const contact = current ? companyContact(current.contact) : site.whatsapp;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return <header ref={header} className={`site-header${open ? " is-open" : ""}`}>
    <div className="container header-inner">
      <Link href={company ? "/" : "#inicio"} aria-label="Cordeiro Group — início" className="brand-link" onClick={() => setOpen(false)}><GroupLogo light={!company} /></Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <ButtonLink className="header-cta" href={contact} external>{company ? "Solicitar orçamento" : "Fale conosco"}</ButtonLink>
      <button ref={trigger} className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        {open ? <X aria-hidden="true" size={25} /> : <Menu aria-hidden="true" size={25} />}
      </button>
    </div>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Navegação no celular" hidden={!open}>
      <div className="container">
        {links.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <ButtonLink href={contact} external onClick={() => setOpen(false)}>Fale conosco</ButtonLink>
      </div>
    </nav>
  </header>;
}
