# Jornada da Home — Cordeiro Group

Implementação local em 1º de novembro de 2026.

## Escopo

Três ambientes na Home, na ordem **V3 → Cordeiro Engenharia → DreamHome**. Esta etapa usa somente as três imagens conceituais existentes. Nenhum vídeo, sequência de frames nova ou canvas foi integrado à jornada. O Hero anterior e as páginas individuais continuam existentes.

A apresentação das empresas foi substituída por uma introdução com atalhos e um palco compartilhado. Rolagem nativa controla a passagem entre os ambientes, o leve enquadramento das imagens, os textos e os indicadores. Ao inverter a rolagem, a composição retorna pelo mesmo caminho. Não há autoplay, temporizador, spring ou bloqueio do scroll.

## Manutenção

- `data/home-journey.ts`: ordem, marcas, textos, imagens, recortes e destinos.
- `components/home/journey-timeline.ts`: limites, intervalos de leitura, transições e extensão da rolagem (450svh no desktop; 360svh em telas até 800px, além do palco).
- `components/home/ecosystem-journey.tsx`: estrutura acessível, Motion, links diretos e preferência de movimento.
- `components/home/ecosystem-journey.css`: composição e responsividade.

Endereços diretos: `/#ambiente-v3`, `/#ambiente-engenharia` e `/#ambiente-dreamhome`. Os CTAs abrem as rotas existentes. Os atalhos posicionam o capítulo em seu intervalo de leitura e levam o foco ao título. Apenas o capítulo legível fica disponível para interação; os demais usam `inert` e `aria-hidden`. Navegação e contato permanecem acessíveis durante as transições.

A preferência de movimento do sistema e a opção do site ativam três seções estáticas, sem o espaçador da jornada. Essa apresentação também é usada antes da hidratação e em janelas com menos de 620px de altura ou 360px de largura. Textos e links estão presentes no HTML inicial. As imagens são identificadas como conceitos gerados por IA; as três versões otimizadas começam a carregar cedo para permitir atalhos entre capítulos.

## Verificação

- Quatro testes automatizados do mapeamento: destinos legíveis, extremos, transições e composição idêntica ao avançar, voltar ou saltar posições. Executar com Node 22.18+ / 24: `node --test components/home/journey-timeline.test.mjs`.
- Navegador: desktop 1440×900, celular 390×844 e 375×667, tablet 768×1024 e versão compacta 320×568. Sem transbordamento horizontal; CTAs dentro da área útil.
- Retorno da rolagem, troca rápida por atalhos, Tab até o CTA, transferência de foco antes de ocultar um capítulo, acesso direto ao contato e recarregamento em um capítulo.
- Movimento reduzido pelo controle do site: todos os textos permanecem visíveis e o palco perde o espaçador. Preferência do sistema ligada diretamente a `useReducedMotion` e à media query; não foi simulada pelo navegador de teste.
- Mudança dinâmica entre 900px e 619px de altura preserva o capítulo atual, mesmo com outro capítulo no hash.
- Três CTAs abriram as páginas individuais corretas; retorno à Home conferido.
- HTML inicial: três capítulos, sem `inert` e sem o modo sticky antes da hidratação.
- Lint, TypeScript e `git diff --check` aprovados.

O build de produção foi tentado, mas o Turbopack falhou ao abrir uma porta para seu processo de CSS (`Operation not permitted`). A prévia de desenvolvimento compilou e foi validada em `http://localhost:3000`. Nenhuma publicação foi realizada. Testes em dispositivos físicos, Safari/Firefox e leitor de tela não foram executados.
