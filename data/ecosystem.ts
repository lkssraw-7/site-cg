export type CompanyId = "engenharia" | "solar" | "dreamhome";
export type Service = { title: string; text: string; icon: string; image?: string; position?: string };
export type Project = { image: string; title: string; caption: string; alt: string };

export const engineeringServices: Service[] = [
  { title: "Projetos elétricos", text: "Planejamento e documentação elétrica para empreendimentos residenciais, comerciais e industriais.", icon: "draft" },
  { title: "Instalações e reformas", text: "Infraestrutura elétrica e adequação de instalações às necessidades de cada espaço.", icon: "plug" },
  { title: "Painéis elétricos", text: "Montagem de painéis de comando e distribuição para diferentes aplicações.", icon: "panel" },
  { title: "Automação industrial", text: "Programação de CLP e automação de máquinas e processos.", icon: "cpu" },
  { title: "Adequação de máquinas", text: "Soluções de adequação à NR-12 conforme avaliação técnica do equipamento.", icon: "shield" },
  { title: "Montagem e manutenção", text: "Montagem, startup e manutenção elétrica de máquinas nacionais e importadas.", icon: "tool" },
];

export const solarServices: Service[] = [
  { title: "On-grid", text: "Geração fotovoltaica conectada à rede elétrica. Uma solução dimensionada a partir do seu perfil de consumo.", icon: "grid" },
  { title: "Off-grid", text: "Sistemas independentes da rede, com armazenamento dimensionado para a demanda e as condições do local.", icon: "battery" },
  { title: "Híbrido", text: "Integração entre geração solar, rede e armazenamento, conforme os equipamentos e o projeto escolhido.", icon: "sun" },
];

export const dreamServices: Service[] = [
  { title: "Iluminação inteligente", text: "Cenas de luz que acompanham cada momento do dia.", icon: "light", image: "/images/dreamhome-hero.webp", position: "70% 20%" },
  { title: "Cortinas automatizadas", text: "Mais praticidade para controlar luz natural e privacidade.", icon: "curtain", image: "/images/dreamhome-hero.webp", position: "95% 50%" },
  { title: "Segurança e monitoramento", text: "Integração de monitoramento e fechaduras biométricas.", icon: "shield", image: "/images/residencia-hero.webp", position: "80% 50%" },
  { title: "Áudio e entretenimento", text: "Som e imagem integrados à experiência do ambiente.", icon: "audio", image: "/images/dreamhome-hero.webp", position: "65% 75%" },
  { title: "Controle de climatização", text: "Ajustes de temperatura para deixar a casa mais confortável.", icon: "climate" },
  { title: "Ambientes e cenas", text: "Diferentes funções reunidas em comandos pelo smartphone.", icon: "phone" },
];

export const engineeringSteps = [
  { title: "Entender", text: "Conte sobre o espaço, o equipamento e o resultado que você precisa." },
  { title: "Planejar", text: "O levantamento técnico orienta o escopo e a proposta para o projeto." },
  { title: "Executar", text: "Projetos, montagens e instalações seguem o escopo contratado." },
  { title: "Entregar", text: "Verificação e orientações de uso conforme a solução desenvolvida." },
];
export const solarSteps = [
  { title: "Consumo", text: "Leitura da conta de energia e das necessidades do imóvel." },
  { title: "Dimensionamento", text: "Avaliação do local e da capacidade de geração necessária." },
  { title: "Projeto", text: "Definição do sistema, dos equipamentos e dos requisitos técnicos." },
  { title: "Instalação", text: "Montagem e integração dos componentes previstos no projeto." },
  { title: "Entrega", text: "Verificação do sistema e orientações para acompanhar a geração." },
];

export const solarProjects: Project[] = [
  { image: "/images/v3-project-01.webp", title: "Energia solar na prática", caption: "Registro publicado pela V3 Energia Solar.", alt: "Registro de serviço realizado publicado no portfólio oficial da V3, imagem 1" },
  { image: "/images/v3-project-02.webp", title: "Tecnologia em operação", caption: "Registro publicado pela V3 Energia Solar.", alt: "Registro de serviço realizado publicado no portfólio oficial da V3, imagem 2" },
  { image: "/images/v3-project-03.webp", title: "Geração que acontece", caption: "Registro publicado pela V3 Energia Solar.", alt: "Registro de serviço realizado publicado no portfólio oficial da V3, imagem 3" },
];
