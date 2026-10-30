# Composição e movimento — revisão com emil-design-eng

29 de outubro de 2026 · CORDEIRO GROUP · Prévia local: http://127.0.0.1:3001/

## Direção e diagnóstico

Revisão das quatro páginas existentes, preservando conteúdo, logotipos, destinos de links, formulários e arquivos de marca. Stack confirmada: Next.js 16.4.3, React 19.3, TypeScript, Tailwind 4, Motion 14.7.1, Embla e Lucide. Sem novas dependências.

| Antes | Depois | Motivo |
|---|---|---|
| Entrada de 56px aplicada a quase todos os blocos | Quatro tratamentos por função, com a maior parte do conteúdo estática | Evitar repetição e manter a atenção no conteúdo |
| Opacidade do hero diminuía durante a leitura | Textos saem apenas ao atravessar a borda superior da tela; ações estáveis | Preservar legibilidade e acesso aos botões |
| Quebras manuais no título principal | Largura limitada e quebra equilibrada pelo navegador | Adaptar a composição às quatro larguras |
| Apresentação das empresas toda centralizada | Título à esquerda, apoio à direita e identificação visual de cada empresa | Organizar a leitura e evidenciar as marcas |
| Serviços da Engenharia em seis cartões iguais | Lista numerada com texto de contexto ao lado no desktop | Facilitar a leitura técnica sem outra grade de caixas |
| Cinco etapas da V3 comprimidas em colunas | Sequência vertical no desktop, com linhas de entrada | Dar espaço às explicações e comunicar ordem |
| Título escuro sobre o bloco azul da V3 | Variante clara do componente de título | Corrigir contraste |
| Blocos informativos se moviam no hover | Movimento de feedback reservado a controles e links | Diferenciar conteúdo de elementos clicáveis |
| Animação também em comandos de teclado | Carrossel, abas, foco e navegação por teclado imediatos | Manter resposta direta |

## Como as skills foram aplicadas

**emil-design-eng:** finalidade por animação; curva ease-out `(0.23, 1, 0.32, 1)`; entradas e saídas com tempos diferentes; intervalo de 60ms somente onde há sequência; pressão de botão em 140ms; hover condicionado a ponteiro fino; interrupção de efeitos anteriores; animação de `transform` completo e `opacity`; conteúdo estático em áreas de leitura e formulário. A implementação usa o Motion já instalado. A documentação oficial de [animate](https://motion.dev/docs/animate) confirma suporte às propriedades e aos controles de reprodução; aceleração depende do navegador, sem promessa de taxa de quadros.

**design:** manutenção da Manrope, grafite e laranja do grupo, azul da V3 e tons neutros da DreamHome; consistência de margens, tipografia, bordas e chamadas. Composição ajustada ao tipo de conteúdo, preservando os recursos existentes. Os módulos opcionais `brand`, `design-system` e `ui-styling` não estão instalados e não foram presumidos. Nenhum provedor de imagem foi necessário.

**ui-ux-pro-max:** pesquisa local validada sobre equilíbrio de linhas dos títulos, transições canceláveis e componentes cliente restritos às áreas interativas de Next.js. A primeira busca sobre interrupção trouxe resultados genéricos e foi refinada para “rapid animation interrupted”; o resultado específico orientou o tratamento de mudanças rápidas de estado. A preferência explícita do usuário por animações ativas prevaleceu sobre a recomendação genérica de seguir automaticamente o sistema.

## Distribuição de movimento

| Uso | Tratamento | Repetição |
|---|---|---|
| Títulos principais e abertura da empresa | Deslocamento de 24px, 650ms; saída de 12px em 200ms | Entrada, saída e retorno |
| Textos selecionados e título DreamHome | Opacidade, 400ms; saída em 200ms | Conforme o bloco |
| Cards de navegação entre empresas | Opacidade com intervalo de 60ms | Uma vez por montagem |
| Fotografias da galeria | Escala 1.045 → 1 e opacidade, 800ms | Uma vez por montagem |
| Linhas das etapas | Escala horizontal, 700ms; pequeno intervalo | Uma vez por montagem |
| Fundo do hero | Escala de 1 → 1.06 ligada à rolagem | Reversível |
| Parágrafos longos, serviços, segmentos, formulários e CTAs | Estáveis | Sem animação de rolagem |
| Cenas DreamHome | Iluminação em 280ms e conteúdo em 180ms | Ao escolher a cena; imediato pelo teclado |

Animações ativas por padrão, conforme solicitado. O botão “Reduzir animações” remove os efeitos e salva a preferência. Navegação continua funcional e o conteúdo aparece sem JavaScript, IntersectionObserver ou Web Animations API. Nenhuma animação bloqueia um link ou depende de seu término para atualizar um estado funcional.

## Validação

- Quatro rotas nas larguras 375, 768, 1024 e 1440px: capturas, limites de layout, cabeçalhos, CTAs, imagens e destinos de âncoras.
- Menu: abrir, fechar, Tab, Escape, saída de foco e seleção de destino.
- Carrossel: setas, indicadores, foco e acionamento pelo teclado.
- Formulários: validação obrigatória, geração do texto, foco no rascunho, destino correto do WhatsApp e descarte ao editar. Nenhuma mensagem enviada.
- DreamHome: setas, Home/End, seleção rápida de cenas e painel único visível.
- Entrada, saída e reentrada nas quatro páginas, rolagem em incrementos e inversões rápidas de direção.
- Preferência de animação persistente após recarregar; toque emulado sem hover de deslocamento.
- Conteúdo legível sem JavaScript nas quatro rotas. Falha simulada de suporte a IntersectionObserver e Web Animations API na página Engenharia.
- `npm run lint`, compilação de produção/TypeScript e `git diff --check` aprovados.

Evidências em `docs/emil-review/`: `layouts.json`, `validation.json`, `final-validation.json` e capturas. As validações foram feitas em Edge/Chromium e na prévia integrada. Dispositivos físicos, Safari/Firefox e leitor de tela não foram testados. Não foi feita medição formal de desempenho ou certificação de acessibilidade.

Permanece o aviso preexistente do Next.js sobre um `package-lock.json` na pasta pai, fora do repositório; a compilação terminou normalmente. O formulário continua preparando uma mensagem para envio manual no WhatsApp, sem integração nova de e-mail.

**Nenhuma publicação foi realizada.**
