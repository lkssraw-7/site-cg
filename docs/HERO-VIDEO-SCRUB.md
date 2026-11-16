# Hero — vídeo controlado pelo scroll

Implementado em 4 de novembro de 2026. Substitui exclusivamente o antigo fundo em sequência de imagens. Não usa reprodução automática, loop ou imagens separadas para a animação.

## Arquivos de mídia

- Original enviado: `public/video/hero-video.mp4`, H.264, 1920×1080, 24 fps, 239 quadros, aproximadamente 10 segundos. Preservado sem alterações.
- Versão usada pelo site: `public/video/hero-video-scrub.mp4`, mesmas dimensões, duração e cadência, 14.644.577 bytes. H.264 CRF 18, um quadro-chave a cada 6 quadros (0,25 s), sem B-frames ou áudio e com metadados no início do MP4. O original tinha apenas um quadro-chave para todo o clipe, inadequado para reposicionamentos frequentes.
- `public/video/hero-video-poster.jpg`: imagem do primeiro quadro, usada antes da mídia estar pronta, em caso de falha e quando o movimento está desativado. É uma única imagem estática de fallback, não uma sequência de reprodução.

Exportação reproduzível na raiz do projeto:

```sh
ffmpeg -i public/video/hero-video.mp4 -map 0:v:0 -an \
  -c:v libx264 -preset medium -crf 18 -g 6 -keyint_min 6 \
  -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart \
  public/video/hero-video-scrub.mp4
ffmpeg -i public/video/hero-video.mp4 -frames:v 1 -q:v 2 \
  public/video/hero-video-poster.jpg
```

## Integração

`scroll-video-sequence.tsx` mantém o mesmo percurso de scroll, suavização compartilhada, dimensões, âncoras, comportamento do link de salto e condições de movimento reduzido. A coreografia apenas passou a importar o contexto `useHeroScroll`; seus cálculos, conteúdo, logo, navegação e tempos permanecem iguais.

O controlador em `video-scrubbing.ts` reposiciona `currentTime` conforme o progresso. O vídeo permanece pausado. Há somente um seek em andamento; mudanças de direção e posições intermediárias atualizam o destino mais recente, sem formar uma fila atrasada nem reiniciar continuamente a decodificação. O último destino fica dentro da duração reproduzível. Atualizações menores que meio quadro são ignoradas.

O controlador espera os metadados, retoma o destino atual após carregamento tardio e suspende novos seeks quando o Hero está fora da tela ou a aba está oculta. Erros de mídia preservam a imagem estática. Em movimento reduzido ou nas condições de apresentação estática já existentes, o elemento de vídeo não é montado. O fundo continua cobrindo a área inteira; o recorte móvel é consistente entre vídeo e poster.

Referências de API: [currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime) e [seeked](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event).

## Validação

- 15 testes aprovados: limites de tempo, metadados tardios, mudanças rápidas e reversão, suspensão/retomada, rejeição temporária de seek, falha de mídia, descarte de listeners e regressões da coreografia/link de salto.
- ESLint e build de produção, incluindo TypeScript, aprovados.
- Mídia decodificada/verificada: 239 quadros, 24 fps, 1920×1080; 40 quadros-chave, intervalo máximo de 0,25 s; caixa `moov` antes de `mdat`.
- Comparação dos arquivos confirmou que apenas o fundo do Hero, seus seletores e a importação de seu contexto mudaram; a coreografia normalizada é idêntica e as demais seções não foram alteradas.
- A prévia em `/private/tmp/cg-frame-fluency-preview` usa cópias completamente locais do MP4 e do poster, em `public-local/video`, sem depender da hidratação do iCloud.
- A validação visual e a medição real de fluidez no navegador permanecem pendentes: o acesso ao localhost foi negado anteriormente pelo controle de permissões. Não houve tentativa de contornar o bloqueio.
