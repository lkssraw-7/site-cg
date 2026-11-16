# Transição do Hero para presença internacional

Implementada em 4 de novembro de 2026. A seção clara sobe sobre o último momento do Hero em aproximadamente meia tela de rolagem. O globo entra com opacidade, deslocamento de 18px e escala de 96% a 100%; título/descrição começam depois, seguidos do indicador e da lista de países. Todas as poses dependem da posição do scroll e são reproduzidas ao voltar.

## Estrutura

- `presence-transition.ts` define a distância de 50svh, as entradas coordenadas e as conversões de progresso que preservam o tempo original do vídeo e da logo.
- O Hero recebe uma extensão de 50svh para continuar fixo durante a sobreposição. Seu progresso é compensado: a logo, os textos, o vídeo e o link de pular introdução continuam usando as mesmas posições de rolagem anteriores.
- `GlobalPresence` usa uma caixa externa sem transformação como referência de scroll. Seu painel interno recebe o fundo claro e a translação, evitando que o elemento animado altere sua própria medição. A margem negativa de 100svh mantém a sobreposição; o painel retorna à posição normal ao completar a entrada.
- A caixa transparente não intercepta os links visíveis do Hero. O painel opaco preserva interação com o globo e os países. O foco dentro da seção torna seu conteúdo imediatamente legível; foco por teclado em links do Hero durante a saída restaura a posição de leitura. Nenhum listener foi associado ao foco de `main` ou do globo para retornar ao Hero.
- `use-hero-presentation.ts` centraliza as condições já existentes de tamanho de tela e movimento reduzido. Sem animação, não há margem negativa, extensão de rolagem ou conteúdo oculto. Os layouts em colunas e empilhados foram preservados.
- O globo usa `clientWidth` para calcular seu canvas e rótulos em coordenadas de layout. A escala de entrada é aplicada ao conjunto, sem produzir desalinhamento entre marcadores, linhas e nomes.

## Validação

26 testes aprovados: continuidade geométrica da sobreposição em seis alturas de viewport, duração da transição, reversão, entradas escalonadas, equivalência dos tempos originais da logo/vídeo, navegação para âncoras, controle do vídeo e geometria/interação do globo. ESLint e build de produção, incluindo TypeScript, aprovados.

Comparação dos arquivos confirmou que a coreografia da logo, o controlador do vídeo, os dados, as páginas das empresas e a jornada dos três ambientes não foram modificados. A prévia mantém o vídeo e o poster completamente locais.

A conferência visual e a medição de fluidez em navegador permanecem pendentes devido ao bloqueio de acesso ao localhost já registrado. Os testes geométricos não substituem essa conferência.

Referências: [Motion useScroll](https://motion.dev/docs/react-use-scroll), [CSS position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position).
