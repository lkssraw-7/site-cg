"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { companies, companyContact } from "@/data/site";
import type { CompanyId } from "@/data/ecosystem";

export function ContactForm({ company }: { company: CompanyId }) {
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState<{ text: string; href: string } | null>(null);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (name: string) => String(data.get(name) ?? "").trim();
    const name = read("name"), message = read("message");
    const nameField = form.elements.namedItem("name") as HTMLInputElement;
    const messageField = form.elements.namedItem("message") as HTMLTextAreaElement;
    nameField.setCustomValidity(name.length < 2 ? "Informe seu nome." : "");
    messageField.setCustomValidity(message.length < 10 ? "Descreva seu projeto em pelo menos 10 caracteres." : "");
    if (!form.reportValidity()) return;
    const selected = companies.find(c => c.id === read("company")) ?? companies.find(c => c.id === company)!;
    const text = [`Olá! Gostaria de conversar com a ${selected.name}.`, `Nome: ${name}`, `E-mail: ${read("email")}`, read("phone") && `Telefone: ${read("phone")}`, read("city") && `Cidade: ${read("city")}`, "", message].join("\n");
    const url = new URL(companyContact(selected.contact)); url.searchParams.set("text", text);
    setDraft({ text, href: url.toString() });
  }
  return <details className="contact-details">
    <summary>Prefere detalhar o seu projeto?</summary>
    <div className="contact-form-intro"><h3>Conte o que você tem em mente.</h3><p>Preencha os dados e revise a mensagem antes de continuar no WhatsApp.</p></div>
    <form onSubmit={prepare} onInput={event => { const el = event.target as HTMLInputElement; if (typeof el.setCustomValidity === "function") el.setCustomValidity(""); setDraft(null); }} className="contact-form">
      <label>Empresa de interesse<select name="company" defaultValue={company}>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Nome completo<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={150} /></label>
      <label>Telefone / WhatsApp (opcional)<input name="phone" type="tel" autoComplete="tel" maxLength={25} /></label>
      <label>Cidade (opcional)<input name="city" autoComplete="address-level2" maxLength={100} /></label>
      <label className="form-message">Sobre o seu projeto<textarea name="message" required minLength={10} maxLength={2000} rows={4} /></label>
      <motion.button className="button button--primary" type="submit" whileTap={reduced ? undefined : { scale: 0.985 }}>Preparar mensagem <ArrowRight size={18} /></motion.button>
      <p className="form-note">O envio é concluído por você no WhatsApp. Este formulário não envia e-mail.</p>
    </form>
    {draft && <motion.div className="contact-draft" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
      <p role="status">Sua mensagem está pronta. Revise os dados e continue no WhatsApp para enviar.</p><pre>{draft.text}</pre><ButtonLink href={draft.href} external>Continuar no WhatsApp</ButtonLink>
    </motion.div>}
  </details>;
}
