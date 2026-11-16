# Frames do Hero em 4K

O fundo atual usa o vídeo enviado pelo usuário, com scroll scrubbing. Ver [HERO-VIDEO-SCRUB.md](HERO-VIDEO-SCRUB.md). As sequências de imagens abaixo permanecem como histórico e não são solicitadas pelo Hero.

## Configuração anterior — somente 2K

Por solicitação do usuário em 4 de novembro de 2026, o Hero usa exclusivamente os 227 WebPs 2560×1440 de `/images/hero-frames/2k`, tanto na imagem inicial quanto durante a rolagem, em repouso e com movimento reduzido. A configuração `highResolutionDirectory` foi removida do Hero; assim, nenhuma tela solicita a variante 4K. Os arquivos 4K continuam preservados, mas não são usados. O histórico abaixo documenta a exportação e as configurações anteriores.

Ampliação direta em lote autorizada pelo usuário. A cena e o movimento foram preservados, sem geração de imagens ou invenção de detalhes.

## Origem e exportação

Fonte: `casa-noite_2K_upscaled.mp4`, já presente na pasta Cordeiro Group, com 240 frames a 24 fps e resolução 2560×1440. A sequência do site continua usando os frames 14–240, totalizando 227 imagens.

Os números dos JPGs correspondem a uma amostragem a 30 fps, não aos índices diretos do vídeo a 24 fps. A comparação dos 227 frames confirmou o mapeamento `round(numero_do_JPG * 24 / 30) - 1`, cobrindo os índices 10–191 do vídeo. Essa correspondência está em `output/hero-upscale/frame-mapping.json` e deve ser usada na exportação para preservar a iluminação e o ritmo originais. As 182 imagens únicas e todos os grupos de frames repetidos foram preservados.

Os antigos JPGs apresentavam blocos de compressão visíveis. Os novos arquivos foram extraídos novamente do vídeo, em vez de ampliar esses JPGs.

- `public/images/hero-frames/4k/`: 3840×2160, interpolação Lanczos de 1,5× e nitidez leve (raio 1,1; intensidade 25%; limiar 3).
- `public/images/hero-frames/2k/`: 2560×1440, extração do vídeo sem ampliação, para telas menores.
- Ambas as versões: WebP, qualidade 90, codificação método 4.
- Nomes e ordem preservados: `ezgif-frame-014.webp` até `ezgif-frame-240.webp`.
- `public/images/ezgif/` permanece intacta como origem histórica da versão anterior.

A ampliação acrescenta pixels por interpolação; a melhora de detalhe vem principalmente da recuperação dos frames a partir do vídeo menos degradado e da correção da exibição. Não se trata de detalhes novos recuperados por IA.

O script reproduzível está em `output/hero-upscale/export-frames.py`. Requer FFmpeg/FFprobe e Pillow com suporte a WebP. Executar na raiz do projeto:

```sh
python3 output/hero-upscale/export-frames.py \
  '/Users/lksraw/Documents/CORDEIRO GROUP/casa-noite_2K_upscaled.mp4' \
  public/images/hero-frames \
  --mapping output/hero-upscale/frame-mapping.json
```

O manifesto em `public/images/hero-frames/manifest.json` registra o hash da fonte, as dimensões, a contagem e os tamanhos totais. A comparação ampliada está em `output/hero-upscale/comparacao-hero-4k.png`.

## Exibição e desempenho

O Hero usa a versão 4K acima de 768px com densidade mínima de 1,5×, ou em telas mais largas que 1920px. As demais telas recebem a versão 2K. A imagem inicial utiliza a mesma regra nativa de `<picture>`, inclusive sem JavaScript.

O canvas agora acompanha densidades de até 2×, com interpolação de alta qualidade. Os limites de 2 milhões de pixels no celular e 8,29 milhões no desktop evitam superfícies excessivas em telas grandes.

As imagens continuam carregando sob demanda, com dois carregamentos simultâneos e prioridade para o frame solicitado. A memória do cache é limitada pelo número de pixels decodificados: 20 milhões no celular e 64 milhões no desktop. Frames distantes são descartados; o frame visível e o solicitado são preservados. Isso não inclui a memória do canvas, da imagem inicial ou dos carregamentos em andamento.

O Scroll Expand, o desaparecimento da logo, o cabeçalho transparente e os tempos de entrada não foram alterados.

## Validação

- Treze testes aprovados: resolução Retina, limites de canvas/cache, rolagem inversa e regressões do Hero/jornada.
- ESLint, TypeScript, build de produção com Turbopack e `git diff --check` aprovados.
- Todos os 454 arquivos exportados foram verificados quanto à presença, dimensões e formato pelo script: 227 em 4K e 227 em 2K.
- Tamanho total: 121,14 MiB em 4K e 72,27 MiB em 2K. As sequências não são baixadas inteiras de uma vez; o carregamento acompanha a posição de rolagem.
- Comparação visual dos recortes feita nos próprios arquivos, sem depender do navegador.
- Correspondência temporal verificada nos 227 frames, comparação visual de início/meio/fim e reprodução do primeiro frame byte a byte em ambas as resoluções.
- O build validado está em `/private/tmp/cg-hero-4k-preview`, com a mesma versão das dependências do lockfile e os quatro arquivos de implementação idênticos aos do projeto original.
- A inspeção visual automatizada da página continua pendente devido ao bloqueio anterior de acesso ao navegador. A prévia local foi atualizada com o novo build.

## Ajuste de fluidez — reprodução adaptativa

A reprodução utiliza os WebPs 2K existentes durante a rolagem. Em telas Retina/grandes, o frame exato é substituído pela versão 4K após 160 ms sem mudança de frame. Os originais 4K, a proporção, o enquadramento e o progresso compartilhado com a coreografia não foram alterados.

O carregador agora antecipa até 10 frames na direção do scroll (4 no celular), com uma reserva para reversão. Há até 4 carregamentos/decodificações simultâneos no desktop e 3 no celular. A imagem é explicitamente decodificada antes de entrar na lista pronta para desenho.

Enquanto o frame exato não está pronto, o renderer avança pelo frame disponível mais próximo entre a posição exibida e o destino, sem ultrapassar o destino nem regredir devido a cargas antigas. Solicitações muito distantes são canceladas após saltos rápidos. O canvas mantém a última imagem válida.

Medições de layout foram retiradas do loop de desenho; ficam no ResizeObserver. O loop usa um único RAF pendente, desenho opaco sem clearRect redundante e pausa quando o Hero sai da tela ou a aba é ocultada. Os limites de cache decodificado são mantidos (20 milhões de pixels no celular / 64 milhões no desktop), além de uma única imagem 4K de refinamento.

Validação: 23 testes, incluindo chegada atrasada de frames, reversão, saltos e prioridade do pré-carregamento; compilação, TypeScript e lint. Comparação de arquivos confirmou que somente o renderer dos frames, seus auxiliares e testes mudaram. Não houve medição de FPS em navegador: acesso visual ao localhost continua bloqueado pela permissão salva.

## Diagnóstico da prévia local — 4 de novembro de 2026

A prévia em `/private/tmp/cg-frame-fluency-preview` usava um link de `public` para a pasta do projeto em Documents/iCloud. Na inspeção, 10 arquivos 2K e 194 arquivos 4K estavam marcados como `dataless` (conteúdo ainda na nuvem). Isso pode atrasar a leitura dos frames pelo servidor, independentemente do pré-carregamento no navegador. O peso total das sequências continua sendo 72,27 MiB em 2K e 121,14 MiB em 4K; sem medição no navegador, não é possível atribuir todos os engasgos ao iCloud.

Os 454 WebPs e o manifesto foram copiados para `/private/tmp/cg-hero-local-cache/hero-frames`. Todos os WebPs foram comparados por SHA-256 com a origem e verificados como inteiramente locais. A prévia agora usa `public-local`, com links das duas resoluções para esse cache e os demais arquivos públicos apontando para as origens anteriores. O servidor de produção foi reiniciado na porta 3000. Nenhuma imagem, coreografia, configuração de scroll ou outra seção foi alterada nesta etapa.

Ao preparar outra prévia, usar arquivos públicos inteiramente locais ou reutilizar esse cache verificado; não voltar a servir os frames por links para arquivos apenas no iCloud. O cache em `/private/tmp` é temporário e deve ser recriado se for removido. A confirmação da fluidez real no navegador permanece pendente, devido ao bloqueio de acesso já registrado.
