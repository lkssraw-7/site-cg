# Mapa interativo do ecossistema

## Prompt aplicado

Transforme a seção “Da energia que geramos à vida que transformamos” em um mapa interativo do ecossistema Cordeiro Group. Preserve o título, a introdução, a identidade Sora/Manrope, as cores institucionais e a integração com a jornada existente.

Conecte as etapas Gerar → Conectar → Viver por uma linha fina que se preenche conforme a rolagem. Coordene a entrada discreta dos conteúdos com opacity e transform usando Motion para React. Mantenha as etapas legíveis durante todo o percurso e permita a reversão natural ao subir a página.

Inclua as logos existentes de V3 Energia Solar, Cordeiro Engenharia e DreamHome. Apresente, respectivamente, os benefícios: “Transformamos o sol em energia para o seu projeto”; “Projetamos a infraestrutura que conecta tudo”; “Integramos tecnologia ao conforto de cada ambiente”.

Ao passar o mouse ou focar uma etapa pelo teclado, mostre sua imagem conceitual ao fundo, com transição suave e contraste suficiente para preservar a leitura. Destaque a etapa e acrescente uma microinteração na seta de exploração. Use as imagens já disponíveis, sem introduzir vídeos, novos assets ou reprodução automática. O clique deve levar diretamente ao ambiente correspondente, usando a navegação atual.

Em telas estreitas, empilhe as etapas e transforme a conexão em uma linha vertical. Preserve links nativos, foco visível e operação por teclado. Em dispositivos de toque, abra o destino com um único toque. Respeite as preferências de movimento reduzido do sistema e do site, exibindo o mapa completo e estático. Sem JavaScript, mantenha os textos, logos e links disponíveis. Evite bloqueio de rolagem, alterações de altura durante as interações e efeitos excessivos.

## Implementação

- `components/home/ecosystem-map.tsx`: mapa, linha ligada ao scroll, etapas, foco/hover e prévias.
- `components/home/ecosystem-journey.tsx`: reutiliza a navegação existente para os destinos do mapa.
- `components/home/ecosystem-journey.css`: identidade, conexão horizontal/vertical, logos e estados acessíveis.
- `data/home-journey.ts`: benefícios curtos das três empresas.

As prévias reutilizam as mesmas URLs, tamanho solicitado e qualidade das imagens dos ambientes, permitindo o reaproveitamento dos recursos pelo navegador. São decorativas e não interferem nos nomes acessíveis dos links. O foco do teclado tem prioridade sobre um ponteiro parado em outra etapa; Escape fecha a prévia. O espaço da legenda permanece reservado para evitar deslocamentos.

## Verificação

- ESLint e compilação de produção com Turbopack aprovados, incluindo TypeScript e geração das sete páginas estáticas.
- Oito testes existentes de Hero/jornada aprovados; os destinos e a coreografia permanecem preservados.
- `git diff --check` aprovado.
- Lint e build executados em `/private/tmp/cg-identity-check`, com as mesmas versões do lockfile, para evitar leituras de dependências bloqueadas pela sincronização. Os quatro arquivos de implementação foram comparados e são idênticos aos do projeto original.

Inspeção visual ainda pendente: o navegador recusou o acesso a localhost por uma permissão salva ou política gerenciada, mesmo após a autorização do usuário na etapa anterior. Não foi tentado contornar esse bloqueio.
