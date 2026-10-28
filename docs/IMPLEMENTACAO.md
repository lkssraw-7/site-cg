# Cordeiro Group — primeira etapa

## Projeto e execução

O projeto Next.js 16 já existia em `/Users/lksraw/Documents/CORDEIRO GROUP/site-cg/site-cg`. O diretório pai continha pastas vazias, preservadas. A implementação usa o projeto existente, React, TypeScript, Tailwind CSS 4, Next/Image e Lucide React. Não há publicação nesta etapa.

Execute `npm run dev` nesta pasta e abra o endereço local informado. `npm run build` gera a versão de produção; `npm start` a serve. As dependências já estão instaladas.

## Entrega atual

- Tokens de cores e tipografia Manrope, com carregamento via next/font.
- Header sobre a imagem, navegação por âncoras e menu móvel com Escape, foco no acionador e fechamento ao selecionar um destino.
- Hero arquitetônico inspirado no showcase, botões funcionais e faixa de benefícios.
- Apresentação inicial das marcas para dar destino ao CTA principal; não substitui o carrossel previsto na fase 2.
- Rodapé com canais reais, links de telefone, e-mail e WhatsApp com mensagem de interesse por empresa.
- Idioma pt-BR, título, descrição e Open Graph. Indexação desativada durante o desenvolvimento; remover noindex e definir domínio canônico antes de publicar.
- Layout para celular, tablet e desktop; foco visível, link de pular conteúdo e preferência de movimento reduzido.

## Próximas etapas do briefing

1. Completar a Home: carrossel com fotografias, Embla e gesto no celular; conexão entre soluções; projetos reais e diferenciais verificáveis.
2. Páginas `/cordeiro-engenharia`, `/v3-energia-solar`, `/dreamhome` e `/projetos`.
3. Página `/contato`, validação e envio real via Server Action/API e Resend após configuração. Os contatos atuais abrem WhatsApp/e-mail; não simulam envio.
4. SEO final, analytics após definição de privacidade, performance e implantação Vercel.

Projetos e Blog não aparecem na navegação desta etapa porque não há páginas implementadas. Não há números comerciais, depoimentos ou projetos fictícios.

## Conteúdo confirmado

Fonte consultada: https://www.cordeirogroup.com.br/ em 28/10/2026.

- Três frentes: Cordeiro Engenharia, V3 Energia Solar e DreamHome.
- Engenharia elétrica para residências, comércios e indústrias; energia fotovoltaica; automação residencial.
- Telefones: (11) 97680-7021 e (11) 97108-9767.
- E-mail: contato@cordeirogroup.com.br.
- Endereço: Rua Maria Izabel Garcia Squilant, Colinas de Indaiatuba II, Indaiatuba/SP.

O primeiro telefone publicado é usado no link padrão de WhatsApp. Confirmar o encaminhamento específico por empresa antes da integração comercial final. Os detalhes de serviços das subpáginas ainda precisam ser conferidos; a consulta automatizada a essas páginas não retornou conteúdo.

## Assets

As quatro logos em `public/logos/` são cópias dos arquivos originais, sem alteração. O enquadramento usa CSS. A marca do grupo recebe tratamento monocromático via CSS para contraste no fundo escuro; o arquivo de origem permanece intacto. Cordeiro Engenharia e V3 usam o símbolo fornecido junto de texto, pois seus arquivos contêm somente os símbolos.

`public/images/residencia-hero.webp` foi gerada com a ferramenta integrada ImageGen e convertida para WebP para reduzir o peso. É um conceito visual, identificado na página, não um projeto real executado. O original de alta resolução também foi preservado em `public/images/residencia-hero-original.png`.

Prompt utilizado:

> Create a photorealistic architectural marketing photograph for a Brazilian premium electrical engineering, solar energy and smart home company website hero. Wide landscape 16:9, 1920px or larger. A magnificent contemporary two-story Brazilian residence in concrete, warm wood and floor-to-ceiling glass, at blue-hour dusk. Architecture occupies right 65% of frame; dark blue evening sky and understated tropical trees on left 40% provide calm negative space for website headline which will be overlaid later. Camera from garden pool level, building in three-quarter view with receding diagonal roof, long balconies, warm amber integrated linear LED lights under eaves, warmly illuminated inviting interiors. Elegant long swimming pool reflecting the house across lower foreground, tropical landscaping, small garden lights. Deep navy sky, rich charcoal exterior, realistic warm light, premium architecture magazine photography, physically plausible structures, beautiful understated detail, believable perspective. No text, no logos, no watermarks, no people, no UI. This is an illustrative concept, not a documented real project. Save generated asset to a local file for website use.


## Verificação desta entrega

- Compilação de produção e checagem TypeScript aprovadas.
- Prévia servida em `http://localhost:3000` (servidor de desenvolvimento que já estava aberto).
- Inspeção visual em 1440 × 900 e 390 × 844; largura de 320 px também verificada sem transbordamento horizontal ou sobreposição entre CTAs e benefícios.
- Menu móvel: abertura, fechamento por Escape e restauração do foco conferidos.
- Botão de empresas leva à seção correta; nenhuma âncora interna sem destino; todas as imagens carregadas.
- Contatos externos conferidos pelos destinos, sem enviar mensagens.
- Captura da versão desktop: `docs/preview-home-desktop.jpg`.
