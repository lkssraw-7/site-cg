# Ecossistema Cordeiro Group — páginas e Motion

Implementação local sobre o projeto existente. A Home mantém seu Hero, tipografia, cores e composição no desktop. Os três cards agora levam às páginas com `next/link`; no celular, funcionam como carrossel Embla sem reprodução automática, com gesto, setas, indicadores e navegação por teclado.

## Rotas

- `/cordeiro-engenharia`: engenharia, serviços técnicos confirmados, segmentos, processo de referência e solicitação de referências de trabalhos.
- `/v3-energia-solar`: sistemas on-grid, off-grid e híbridos, benefícios, segmentos, processo de referência e galeria da fonte oficial.
- `/dreamhome`: automação, cards de soluções e cenas interativas com tabs acessíveis; ambientes conceituais identificados.

Header, Footer, logos, contatos e botões são compartilhados. As páginas possuem metadata individual e atalhos para a Home e para as outras empresas. A indexação continua desativada até a etapa de publicação.

## Motion

- `components/motion/motion-system.tsx` centraliza a preferência e quatro tratamentos seletivos: títulos com deslocamento de 24px/650ms, opacidade em 400ms, fotografias com escala 1.045 → 1 em 800ms e linhas de processo em 700ms. Saídas em 200ms; intervalos de 60ms apenas onde há sequência.
- O HTML é visível por padrão: a animação progressiva inicia depois da hidratação. Não há conteúdo oculto dependente do carregamento de JavaScript.
- Heroes coordenam título e descrição com intervalo de 60ms. Marcas, navegação e CTAs ficam estáveis.
- Títulos selecionados entram e saem nas bordas da área visível, repetindo ao retornar. A opacidade geral do hero permanece estável durante a leitura; a imagem de fundo cresce até 1.06. Fotografias da galeria e linhas do processo entram uma vez. Apenas `opacity` e `transform` são animados.
- Conforme escolha explícita do usuário em 29/10/2026, as animações ficam ativas por padrão, inclusive quando o sistema informa movimento reduzido. O botão “Reduzir animações” no rodapé desativa deslocamentos, escala, sequência e transições, e salva a escolha localmente. “Ativar animações” restaura os efeitos. Sem armazenamento disponível, a escolha vale durante a visita.
- Conteúdos com foco de teclado aparecem imediatamente. A navegação por foco no carrossel é sempre instantânea. Não há saída que atrase navegação entre páginas nem dependência de APIs experimentais do App Router.
- A demonstração DreamHome usa tabs com setas, Home/End, foco visível, painéis semânticos e anúncio da cena. Não controla aparelhos reais.

## Validação das animações — 29/10/2026

- Entrada, saída e reentrada dos textos nas quatro rotas; leitura do hero estável durante a rolagem.
- Conteúdo visível ao receber foco, carrossel no celular e conteúdo legível sem JavaScript.
- Botão de redução de movimento e persistência da preferência após recarregar.
- Layouts em 375, 768, 1024 e 1440px, menus, links internos, formulários e cenas DreamHome conferidos localmente. Nenhum formulário foi enviado.
- Revisão atual e decisões em `docs/REVISAO-EMIL.md`; evidências em `docs/emil-review/`. Os arquivos de `docs/design-review/` registram a revisão anterior. Prévia local em http://127.0.0.1:3001/; sem publicação.

## Fontes verificadas em 28/10/2026

- https://www.cordeirogroup.com.br/cordeiroengenharia — projetos, instalações, reformas, painéis, CLP, automação, adequação NR-12, montagem/startup/manutenção e segmentos residencial, comercial e industrial. Conteúdo lido diretamente no HTML público.
- https://www.cordeirogroup.com.br/energia-solar — sistemas on-grid, off-grid e híbridos.
- https://www.v3energiasolar.com.br/ — projeto/instalação, benefícios gerais, telefone (19) 99568-2380 e seção de serviços realizados.
- https://www.cordeirogroup.com.br/c%C3%B3pia-power-sistem-solar — iluminação, temperatura, cortinas, integrações, tranca biométrica, cenas, som/imagem e monitoramento.
- https://motion.dev/docs/react-accessibility e https://motion.dev/docs/react-scroll-animations — implementação e acessibilidade Motion.

CTAs V3 usam o contato V3 confirmado; as outras frentes usam o contato institucional já configurado. Nenhum envio foi efetuado durante a validação.

Não foram adicionadas estatísticas, percentuais de economia, certificações, prazos ou condições comerciais. SPDA, laudos e soluções rurais não foram confirmados nas fontes consultadas e ficaram de fora. O processo foi apresentado como referência, com escopo e prazos a definir na proposta. A galeria de Engenharia aguarda fotos e descrições confirmadas; há um canal funcional para solicitar referências. DreamHome apresenta demonstrações explicitamente ilustrativas.

O formulário em cada página pré-seleciona a empresa, valida nome/e-mail/mensagem e prepara um texto para revisão. O visitante conclui o envio no WhatsApp; nenhum dado é transmitido apenas ao preencher ou preparar a mensagem. A integração de envio por e-mail/Resend depende de configuração e permanece pendente. Não há confirmação fictícia de envio.

## Fotos de serviços publicados pela V3

Copiadas da seção “Serviços realizados” do site oficial, sem atribuir local, potência, cliente ou resultado não informado:

1. `public/images/v3-project-01.webp`: https://static.wixstatic.com/media/68d847_2af0edc2e3234daaaed2b517204c684b~mv2.webp
2. `public/images/v3-project-02.webp`: https://static.wixstatic.com/media/68d847_c66cf4b06b4a46ceac04b27f98642ec1~mv2.jpeg
3. `public/images/v3-project-03.webp`: https://static.wixstatic.com/media/68d847_4a197f62704a419f90acaa3b83c58bf2~mv2.jpeg

## Imagens geradas

Ferramenta integrada ImageGen. Assets otimizados para WebP em `public/images/engenharia-hero.webp`, `public/images/solar-hero.webp` e `public/images/dreamhome-hero.webp`. Originais de geração preservados em `docs/assets/`. São conceitos ilustrativos, não registros de projetos executados.


## Prompts ImageGen

### engenharia

Photorealistic premium industrial electrical engineering website hero photograph, wide landscape 16:9. An organized modern electrical switchgear installation in a pristine commercial plant, graphite grey metal cabinets and precisely routed insulated conductors, a qualified Brazilian electrical engineer on right third in orange safety uniform with hardhat and clear safety glasses, inspecting a CLOSED control panel using a tablet, no physical contact with exposed wires. Camera at eye level, three quarter side view. Left 45% dominated by darker neutral blurred switchgear surfaces as quiet negative space for white headline overlaid later. Clean realistic professional scene, cinematic natural light, orange accent uniform, charcoal details. Sharp enough to reveal workmanship. No company logos, no text, no UI, no watermarks, no sparks, no hazardous behavior. Concept illustration, not an actual company's project. Save as local image for website use.

### solar

Photorealistic premium Brazilian solar energy website hero, landscape 16:9 wide. A modern elegant single story white residence seen at a low oblique angle, large clean blue photovoltaic panel array on rooftop occupying the right two-thirds, panels have realistic precise grid geometry and reflections, warm early morning sun near right horizon. Soft pale blue sky and distant landscaped trees in left third, calm uncluttered negative space for DARK blue website headline overlaid later. Bright optimistic natural daylight, premium architectural magazine photography, subtle warm orange horizon, highly realistic installation. No text, no logos, no people, no UI or watermarks. Illustrative architectural concept, not an actual company's project. Save as local image for website use.

### dreamhome

Photorealistic luxury Brazilian contemporary interior architectural website hero photograph, landscape wide 16:9. Sophisticated spacious living room at twilight, warm integrated recessed LED light lines in wood slat ceiling, neutral cream sofa on right, textured dark stone wall on left, low sculptural coffee table, discreet smart home wall control near right side, floor to ceiling glass and softly lit garden, elegant curtains, materials walnut limestone linen. Dark quiet left third negative space for white website headline later. Compose from doorway with deep perspective, right side focal point, warm amber practical lighting mixed with evening natural blue, carefully balanced exposure, premium magazine architectural photography, no people, no logos, no words, no UI, no watermarks. Illustrative concept, not a real company project. Save as local image for website use.
