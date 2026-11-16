# Hero — retorno da logo ao cabeçalho

Referência: https://www.figma.com/design/mNQ0bvDXaKg8DU1KzaqHAB/Untitled?node-id=79-1392

Substitui a implementação Scroll Expand descrita em HERO-SCROLL-EXPAND.md.
Contexto visual consultado: cabeçalho 79:1395 e logo central 79:1483.
O Figma não contém keyframes nesses nós; a coreografia segue a especificação do usuário.

## Comportamento

- Fundo em tela cheia desde o início, sem expansão, recorte animado, zoom ou arredondamento.
- A própria logo branca Sora existente no cabeçalho é transformada para o centro do Hero. Não há cópia, troca de opacidade nem remount ao concluir o movimento.
- Saudação em Sora Regular acima da logo; não há subtítulo adicional na abertura.
- Medição do slot real do cabeçalho, do tamanho do Hero e de uma régua CSS responsiva. ResizeObserver e resize recalculam as posições; as fontes também são consideradas.
- Movimento via transform, com origem no canto superior esquerdo, totalmente reversível. O destino visual coincide com o slot medido do cabeçalho; a escala de renderização considera o tamanho máximo da logo, conforme a atualização abaixo.
- Conteúdo começa aos 70% da timeline do percurso. Navegação entra entre 82% e 98%; cabeçalho sempre transparente.
- Menu móvel fecha ao rolar. Controles invisíveis são inertes e o foco volta ao link de pular introdução quando necessário.
- Preferência de movimento reduzido e telas de pouca altura usam conteúdo estático legível, sem percurso obrigatório.

## Preservado

227 frames WebP, versões 2K/4K, proporção da sequência na rolagem, suavização de 0,19 segundo, distância de 1,4 viewport e pausa de leitura de 0,35 viewport. Limites de memória, carregamento progressivo, assets da marca e demais seções preservados.

## Validação

13 testes automatizados: encaixe em desktop/tablet/mobile, reversibilidade, gatilho de conteúdo aos 70%, sincronização dos frames e orçamento de memória. ESLint e compilação de produção/TypeScript aprovados.

Inspeção visual no navegador não realizada: o controle de acesso negou a abertura de localhost:3000. Os testes geométricos não substituem a conferência visual do resultado.

## Nitidez da logo — 4 de novembro de 2026

A animação ampliava a logo desenhada a 226px até 671px no desktop. A camada era promovida com `will-change: transform` e `translate3d`, podendo ampliar uma representação rasterizada no tamanho pequeno. O SVG existente contém letras em paths e o símbolo original em PNG de 704×832; o desenho foi preservado byte a byte.

A logo agora é desenhada na maior largura necessária, medida pela régua responsiva, e usa apenas escalas menores ou iguais a 1. Uma caixa vazia e oculta ocupa o slot original do cabeçalho, enquanto a única logo visível é posicionada de forma absoluta. Essa caixa não contém imagem nem conteúdo acessível. Não há duplicação visual ou troca de logo durante o percurso. A transformação é 2D, sem a promoção permanente por `will-change`.

`logoRenderPose` preserva exatamente as posições e larguras visíveis da coreografia anterior. Em apresentação estática, a imagem usa 100% do slot do cabeçalho. Seis testes geométricos, ESLint e o build de produção/TypeScript passaram. O vídeo com scroll scrubbing e a seção do globo permanecem iguais. A confirmação visual em navegador segue pendente pelo bloqueio de acesso já registrado.
