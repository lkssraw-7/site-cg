> Histórico: a abertura atual foi restaurada para a logo central que sobe ao cabeçalho. Consulte [HERO-LOGO-RETURN.md](HERO-LOGO-RETURN.md).

# Hero — Scroll Expand

## Prompt ajustado e aplicado

Adapte o Hero existente do Cordeiro Group ao efeito ScrollExpand do React Bits, usando a referência e o código fornecidos. Preserve a identidade Sora/Manrope, a logo branca aprovada, os textos, os CTAs e a sequência de imagens já integrada.

A mídia deve começar centralizada, em um quadro com 58% da largura e da altura do estágio, cantos de 58px e zoom de 1,35. Ao rolar a página, expanda esse quadro até ocupar todo o estágio, reduza os cantos para 5px e o zoom para 1. Use distância de expansão equivalente a 1,4 alturas do estágio, seguida de 0,35 para leitura, suavização de 0,19s e intensidade de proteção de leitura de 0,61 sobre a mídia.

A logo central deve apenas desaparecer durante a rolagem. Remova por completo seu deslocamento até o cabeçalho. Depois que ela desaparecer, revele o cabeçalho com sua própria logo fixa na posição final. Mantenha uma pausa entre as duas aparições, evitando duas logos visíveis simultaneamente.

O cabeçalho deve ter fundo totalmente transparente, sem faixa colorida, camada translúcida, desfoque, borda ou sombra. Isso também se aplica ao menu aberto no celular. A logo e os elementos de navegação devem ficar plenamente visíveis ao final da entrada. Evite sobreposição entre o menu aberto e os textos do Hero.

Inicie os textos institucionais aos 70% da expansão, depois da entrada do cabeçalho. Coordene o preenchimento do quadro, os frames, o desaparecimento da abertura e a entrada dos textos com um único progresso de rolagem. A animação deve reverter naturalmente ao subir a página, sem rolagem interna, autoplay ou bloqueio da navegação.

Reutilize Motion para React e a arquitetura existente. Ofereça estado final estático para movimento reduzido e telas inadequadas à apresentação fixada. Preserve os links nativos, o atalho de pular a introdução, o foco visível e a indisponibilidade dos controles ocultos. Sem JavaScript, mantenha o conteúdo final legível.

## Referência e adaptação

[React Bits — Scroll Expand](https://reactbits.dev/animations/scroll-expand?startWidth=58&startRadius=58&endRadius=5&scrollDistance=1.4&smoothing=0.19&overlayScrim=0.61).

`components/home/scroll-expand.tsx` adapta o recorte `inset`, o zoom e a proteção de leitura do código fornecido. Reutiliza o canvas e os MotionValues existentes, em vez de criar outro player ou outro contêiner de rolagem. Não foi necessário instalar dependências adicionais.

`useFollowedProgress` aplica a suavização em função do tempo real entre frames, com resposta consistente em 30/60/120 Hz. O processamento para quando o progresso estabiliza e é cancelado ao desmontar ou ocultar a página. Atalhos de teclado avançam diretamente ao estado legível.

## Etapas

Percentuais abaixo referem-se à expansão, que ocupa 1,4 alturas de estágio. O trecho posterior de 0,35 mantém todo o conteúdo aberto.

- 0–8%: abertura e logo central visíveis.
- 8–46%: a abertura desaparece apenas por opacidade; a logo não se desloca.
- 46–54%: pausa visual entre as duas apresentações da marca.
- 54–66%: o cabeçalho surge com a logo já em sua posição definitiva.
- A partir de 70%: títulos, descrição, CTAs e benefícios entram progressivamente.
- 100%: quadro totalmente expandido e início do trecho reservado à leitura.

O foco é transferido para o link de pular conteúdo caso a rolagem oculte um controle que esteja focado. O menu móvel é fechado ao ocultar o cabeçalho na rolagem inversa. Quando aberto, os textos sob o menu ficam temporariamente ocultos, sem adicionar uma faixa de fundo ao cabeçalho.

## Validação

- Nove testes aprovados: geometria inicial/final, pausa em tela cheia, reversibilidade, separação temporal das logos, controles ocultos, entrada aos 70%, suavização e regressões da jornada.
- ESLint, TypeScript e build de produção com Turbopack aprovados.
- Build realizado em `/private/tmp/cg-scroll-expand-preview`, com o mesmo lockfile, para evitar as dependências indisponíveis na pasta sincronizada. A implementação continua salva na pasta original do projeto.
- Inspeção visual automatizada pendente: o acesso ao navegador foi negado anteriormente por permissão salva ou política gerenciada. Essa restrição não foi contornada.

O preview usa os arquivos públicos originais e permanece em `http://localhost:3000/`.
