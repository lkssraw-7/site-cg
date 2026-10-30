# Revisão de design — CORDEIRO GROUP

28 de outubro de 2026 · Projeto: `E:\CORDEIRO GROUP\site-cg\site-cg`

## Diagnóstico e direção

O site existente utiliza Next.js 16.4.3, React 19.3, TypeScript, Tailwind CSS 4 e CSS próprio. As interações usam Motion, Embla e Lucide. Foram mantidos os componentes, dependências, dados comerciais, imagens, contatos e destinos de navegação.

A identidade já tinha uma base consistente: Manrope, grafite e laranja no grupo, azul na V3 e tons neutros na DreamHome. Os principais problemas eram textos de apoio entre 9 e 13 px, controles pouco destacados, escala de espaçamentos irregular e detalhes de foco e transparência.

As skills locais **design** e **ui-ux-pro-max** foram usadas de forma complementar. A pesquisa local por direção corporativa, foco de teclado e imagens responsivas em Next.js apoiou a hierarquia, a grade e a acessibilidade. A paleta e a tipografia genéricas sugeridas pela pesquisa não substituíram a identidade existente. Os módulos opcionais `brand`, `design-system` e `ui-styling` não estão instalados; não foram necessários provedores externos de imagens ou dependências novas.

## Implementação

- Escala de texto compartilhada: corpo em 16 px, apoio e ações em 14 px e rótulos em 12 px, com ajustes pontuais conforme a função. Títulos com quebra equilibrada e textos com largura controlada.
- Tokens de superfície, borda, tipografia e raio reutilizados nos componentes existentes. Texto secundário escurecido para melhorar o contraste.
- Hero com altura determinada pelo conteúdo; benefícios no fluxo da página para evitar sobreposição quando o texto cresce.
- Cards das empresas com contorno discreto, espaçamento consistente e ação explícita. Carrossel móvel preservado, com indicadores de 44 px e seleção distinguível também pela forma.
- Cabeçalho com menu compacto até 1023 px. Fechamento por Escape, clique externo, seleção e saída do foco; Escape devolve o foco ao botão.
- Rodapé e chamadas de contato mais legíveis, com alvos maiores e botões que ocupam a largura disponível no celular.
- Grades e cartões de serviços adaptados ao volume do texto. DreamHome usa duas colunas no desktop para dar espaço às imagens e descrições.
- Foco visível nos elementos interativos e painéis; atalho de conteúdo com destino focalizável em todas as páginas. Preferência por movimento reduzido preservada.
- Formulários com campos obrigatórios explícitos, texto e campos maiores, instruções associadas e foco na mensagem preparada. Mantidos a validação e o encaminhamento para o WhatsApp de cada empresa.
- Filtro monocromático corrigido para respeitar a transparência do logotipo. Os arquivos originais das marcas permanecem intactos.

## Validação

| Página | 375 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Início | Conferido | Conferido | Conferido | Conferido |
| Cordeiro Engenharia | Conferido | Conferido | Conferido | Conferido |
| V3 Energia Solar | Conferido | Conferido | Conferido | Conferido |
| DreamHome | Conferido | Conferido | Conferido | Conferido |

Foram verificadas capturas e medições das 16 combinações no Edge/Chromium: ausência de transbordamento horizontal, imagens carregadas, um título principal por página, âncoras com destino, cabeçalhos sem colisão e ações dentro do hero. O transbordamento dos títulos ocultos do carrossel foi corrigido.

Interações conferidas: atalho de conteúdo; menu com Tab e Escape; navegação por âncoras; botões, indicadores e foco do carrossel; entrada nas páginas das empresas; campos obrigatórios; preparação e revisão da mensagem; destino específico do WhatsApp; descarte do rascunho ao alterar campos; abas DreamHome com setas, Home e End; mudança rápida de cenas com animação; preferência por movimento reduzido.

Também foi feita uma conferência calculada de contraste dos textos sobre fundos sólidos. Os trechos sobre fotografias foram inspecionados visualmente; essa conferência não equivale a uma certificação de acessibilidade.

`npm run lint`, compilação de produção e verificação TypeScript aprovados. Nenhuma dependência foi adicionada. Nenhuma mensagem foi enviada pelos formulários.

## Prévia e limites

Prévia local compilada: http://127.0.0.1:3001. Capturas finais em `docs/design-review/`. Nenhuma publicação foi feita.

A validação usa larguras simuladas no Edge/Chromium. Testes em dispositivos físicos, Safari/Firefox e leitor de tela continuam pendentes. O formulário mantém seu comportamento existente: prepara uma mensagem para revisão e envio manual no WhatsApp; não envia e-mail.

O Next.js informa que existe um `package-lock.json` na pasta pai, fora do repositório, e o ignora. Isso não impediu a compilação. A prévia de desenvolvimento já aberta apresentou estilos em cache; a revisão final foi feita na prévia compilada da porta 3001.
