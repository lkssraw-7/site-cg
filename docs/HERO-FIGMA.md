> Histórico: a abertura atual foi restaurada para a logo central que sobe ao cabeçalho. Consulte [HERO-LOGO-RETURN.md](HERO-LOGO-RETURN.md).

# Hero animado — implementação Figma

> Histórico: a coreografia de subida da logo foi substituída pelo [Hero Scroll Expand](./HERO-SCROLL-EXPAND.md). A abertura agora desaparece e o cabeçalho transparente surge posteriormente com uma logo fixa. As etapas abaixo documentam a versão anterior.

> Atualização de identidade: a composição Sora aprovada no Figma substitui a logo PNG e a saudação Georgia descritas no histórico abaixo. A implementação e a validação atuais estão em [IDENTIDADE-VISUAL.md](./IDENTIDADE-VISUAL.md). A coreografia continua com encaixe aos 60% e conteúdo a partir dos 70%.

Fonte: https://www.figma.com/design/mNQ0bvDXaKg8DU1KzaqHAB/Untitled?node-id=25-2
Estados consultados: Welcome (25:5), Logo Transition (25:6), Hero Revealed (25:7), Motion Preview (25:8).

## Coreografia

O `ScrollFrameSequence` mantém o canvas, o carregamento limitado dos frames existentes e seu `scrollYProgress`. O contexto compartilha esse mesmo MotionValue com `HeroChoreography`; não há um segundo relógio ou listener manual de scroll.

- 0–20%: saudação, logo central, navegação e convite para explorar.
- 20–60%: a única logo/link se move até seu espaço real no Header. Um ResizeObserver mede o estágio e o destino, sem atualizar o estado React por frame.
- 60–70%: logo completamente encaixada; conteúdo institucional ainda oculto.
- 70–100%: entrada horizontal de eyebrow, título por palavras, descrição por palavras, CTAs e benefícios. A curva é cubic-bezier(.23, 1, .32, 1).
- Rolagem inversa usa a mesma interpolação. Sem autoplay, bloqueio de rolagem ou transição entre duas logos.

Os tempos do preview em loop do Figma foram remapeados para os intervalos de scroll solicitados. A versão branca da logo oficial, exportada diretamente do original como PNG transparente de 4096×832, a sequência da residência, a descrição institucional e os destinos dos CTAs existentes foram preservados. As três setas locais vieram do Figma; nenhum URL temporário é utilizado em produção.

## Responsividade e acessibilidade

Apresentação fixada em telas com pelo menos 541×700 ou 360×760, desde que tanto o sistema quanto a preferência do site permitam movimento. Telas menores/baixas recebem diretamente o estado final em fluxo normal, permitindo ler todo o conteúdo sem cortes. A distância adicional é 240vh no desktop, 200svh no tablet e 180svh no celular.

Há apenas um h1. Texto dividido visualmente em palavras tem uma alternativa contínua para leitores de tela. CTAs ocultos ficam inert até sua entrada; o foco retorna à logo se forem ocultados durante a rolagem inversa. O link de pular conteúdo e o convite para explorar avançam diretamente ao conteúdo final. Sem JavaScript, o conteúdo final permanece disponível. O Header conserva menu móvel, Escape e fechamento ao sair do menu.

## Arquivos desta alteração

- `components/home/hero.tsx`: composição do Hero.
- `components/home/scroll-frame-sequence.tsx`: contexto de progresso, seleção de apresentação, avanço ao conteúdo e limpeza de imagens em carregamento.
- `components/home/hero-choreography.tsx`: logo única, textos, CTAs e acessibilidade.
- `components/home/hero-timeline.ts` e `hero-timeline.test.mjs`: intervalos, geometria e testes.
- `components/layout/header.tsx`: entrada opcional para a logo animada e ícone do CTA.
- `components/ui/brand.tsx`: tamanho de imagem configurável para a logo central.
- `components/ui/button-link.tsx`: ícone opcional, mantendo o padrão nas demais páginas.
- `app/page.tsx`: Header passa a integrar o estágio do Hero.
- `app/globals.css`: regras limitadas a `.hero-presentation` / `.site-header--hero`.
- `public/images/hero-motion/`: setas exportadas do Figma.

A jornada das empresas, seus dados, estilos e imagens não foram alterados nesta implementação.

## Validação

- ESLint: aprovado.
- TypeScript (`npx tsc --noEmit`): aprovado.
- `node --test components/home/*.test.mjs`: 8 testes aprovados, incluindo os 4 testes existentes da jornada.
- `git diff --check`: aprovado.
- `npm run build`: bloqueado pelo ambiente ao abrir uma porta interna do processamento CSS do Turbopack (`Operation not permitted`).
- `npm run build -- --webpack`: aprovado; compilação, TypeScript e geração das 7 páginas estáticas concluídos. O comando padrão do projeto continua usando Turbopack, sem alteração na configuração.
- Validação visual: pendente. O controle do navegador recusou acesso a `http://localhost:3000`; não foram feitas tentativas de contornar a recusa.

A geometria da logo foi testada numericamente nas seis resoluções solicitadas. Isso não substitui a inspeção visual. Ainda precisam ser conferidos em navegador: 1440×900, 1024×768, 768×1024, 390×844, 375×667 e 320×568; início/meio/fim, inversão da rolagem, encaixe visual da logo, sobreposições, CTAs, overflow, menu, movimento reduzido e saída para a jornada.

## Refinamento solicitado

Prompt aplicado: “Ajuste a coreografia do Hero para que o conteúdo institucional comece a aparecer somente após a logo concluir totalmente sua subida e encaixar no cabeçalho. Inclua um breve intervalo de rolagem entre as etapas, preservando o stagger e a reversibilidade. Use a versão inteiramente branca da logo já existente, sem fundo aparente, durante todo o percurso. Refine a saudação ‘Seja bem-vindo(a) ao’ com Georgia, tamanho maior e espaçamento equilibrado, mantendo-a centralizada acima da logo. Preserve os frames, a navegação, a responsividade e o estado final acessível com movimento reduzido.”

Saudação: Georgia 400 (fallback Times New Roman/serif), 32px no desktop/tablet e 24px no celular, entrelinha 1.2 e espaçamento levemente negativo. A alteração de família fica restrita à saudação; o restante do site continua em Manrope. A logo chega ao destino aos 60%; o conteúdo inicia aos 70%.

## Arquivo da logo branca

`public/logos/cordeiro-group-white-hd.png`: PNG RGBA de 4096×832, convertido diretamente do original com autorização do usuário. Preserva o símbolo e as letras; o slogan continua fora do recorte do site. A exportação amplia o raster original, sem inventar novos detalhes nem redesenhar a marca.

`GroupLogo light` carrega esse arquivo diretamente, sem filtro SVG, sem o recorte do arquivo colorido e sem recompressão do Next/Image. O original colorido permanece intacto. A prévia sobre fundo grafite está em `output/branding/cordeiro-group-white-preview.png`; o script reproduzível está em `output/branding/export-white-logo.py` (Pillow e NumPy).
