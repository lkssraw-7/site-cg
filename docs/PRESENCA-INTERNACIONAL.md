# Presença internacional — Cordeiro Engenharia

Substitui exclusivamente o mapa Gerar / Conectar / Viver na introdução do ecossistema.

## Referências

Figma: arquivo mNQ0bvDXaKg8DU1KzaqHAB; desktop 79:1491, tablet 79:1791 e celular 79:1832.
Base técnica: GlobeCdn do 21st.dev fornecido pelo usuário. COBE 2.0.1 (MIT), versão fixada nos arquivos de dependências.
API consultada em https://cobe.vercel.app/ e projeção conferida em https://github.com/shuding/cobe/blob/main/src/index.js e na distribuição instalada.

## Resultado

- Desktop em duas colunas; tablet/celular na ordem texto → globo → estatística/lista.
- Sora, fundo claro e tokens da marca. O laranja mais escuro no identificador pequeno melhora contraste.
- Sete países com seleção por botões de pelo menos 44px, Enter/Espaço e aria-pressed.
- Américas na abertura e Brasil destacado. Coordenadas representativas por país, não endereços de obras ou filiais. Indaiatuba é a origem conceitual; conexões ilustrativas.
- Rótulos separados em dois trilhos no desktop; somente o selecionado no celular. Projeção equivalente à do COBE, sem depender de CSS Anchor Positioning.
- SVGs originais locais do Figma compõem o mapa alternativo sem JavaScript, sem WebGL ou após perda do contexto.

## Movimento e desempenho

Importação dinâmica do COBE a 300px da área visível. Sem rotação automática nem tráfego fictício. RAF somente durante interação/transição, suspenso fora da tela ou com a aba oculta. ResizeObserver, destruição do globo e remoção dos eventos no cleanup.

DPR limitado a 1,5 no globo pequeno e 2 no grande, com 10 mil/20 mil amostras. COBE 2.0.1 multiplica width/height por DPR internamente; são passadas dimensões CSS.

Arraste horizontal no toque, com pan-y pinch-zoom para preservar rolagem vertical e ampliação. Pointer capture/cancel tratados. Movimento reduzido muda a orientação imediatamente, sem interpolação; a lista HTML permanece acessível independentemente do canvas.

## Navegação e preservação

Nova seção em #presenca-internacional. #nossas-empresas transferido para o início dos três ambientes. Lógica de capítulos preservada. Hero, logo, frames 4K, estilos globais, dados e tempos da jornada comparados sem alterações.

## Validação

17 testes aprovados, incluindo foco dos sete países, distribuição de rótulos e comportamento pré-existente do Hero/jornada. ESLint, TypeScript e build de produção aprovados. Assets SVG locais e dimensões conferidos.

Inspeção visual e gestos reais não verificados: a permissão salva do navegador bloqueia localhost:3000. Testes de geometria e compilação não substituem essa conferência.

## Correção da interação do globo

O listener de `focus` em `main#conteudo` acionava o avanço do Hero ao clicar em conteúdo não focável, como o canvas. O salto agora está vinculado exclusivamente à ativação explícita do link “Pular para o conteúdo”. A animação e o visual do Hero permanecem iguais.

O canvas recebe foco com preventScroll, captura o ponteiro ao arrastar, libera a captura ao terminar/cancelar e permite rotação pelas setas do teclado. Clique de mouse não transfere foco ao main. Elementos gráficos decorativos não interceptam os gestos. O toque mantém pan-y e pinch-zoom.

20 testes aprovados, incluindo regressão de foco/skip link e rotação por mouse/toque. A limitação de inspeção visual no navegador permanece.
