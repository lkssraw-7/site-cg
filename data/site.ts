// Conteúdo e contatos conferidos em https://www.cordeirogroup.com.br em 28/10/2026.
export const site = {
  name: "Cordeiro Group",
  description: "Engenharia elétrica, energia solar e automação residencial. Três especialidades conectadas para transformar espaços e facilitar sua vida.",
  email: "contato@cordeirogroup.com.br",
  phone: "(11) 97680-7021",
  phoneHref: "tel:+5511976807021",
  secondPhone: "(11) 97108-9767",
  secondPhoneHref: "tel:+5511971089767",
  location: "Indaiatuba, São Paulo",
  address: "Rua Maria Izabel Garcia Squilant · Colinas de Indaiatuba II",
  whatsapp: "https://wa.me/5511976807021?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20o%20Cordeiro%20Group.",
} as const;

export const navigation = [
  { label: "O Grupo", href: "#o-grupo" },
  { label: "Nossas empresas", href: "#nossas-empresas" },
  { label: "Contato", href: "#contato" },
] as const;

export const companies = [
  { id: "engenharia", href: "/cordeiro-engenharia", name: "Cordeiro Engenharia", category: "Engenharia elétrica", description: "Projetos, instalações e soluções elétricas para residências, comércios e indústrias.", contact: "engenharia elétrica" },
  { id: "solar", href: "/v3-energia-solar", name: "V3 Energia Solar", category: "Energia solar", description: "Soluções em energia solar fotovoltaica para sua casa ou empresa.", contact: "energia solar" },
  { id: "dreamhome", href: "/dreamhome", name: "DreamHome", category: "Automação residencial", description: "Tecnologia e automação para uma casa mais conectada, confortável e prática.", contact: "automação residencial" },
] as const;

export function companyContact(interest: string) {
  const number = interest === "energia solar" ? "5519995682380" : "5511976807021";
  return `https://wa.me/${number}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${interest} no Cordeiro Group.`)}`;
}
