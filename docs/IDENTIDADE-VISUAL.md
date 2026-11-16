# Identidade visual — Cordeiro Group

Implementação da proposta 01, “Geométrica e Tecnológica”, aprovada no briefing de identidade visual.

## Marca oficial

Fonte: [composição aprovada no Figma, 39:14](https://www.figma.com/design/mNQ0bvDXaKg8DU1KzaqHAB/Untitled?node-id=39-14).

`public/logos/cordeiro-group-sora.svg` foi exportado diretamente desse componente, com fundo transparente e lettering convertido em curvas. “Cordeiro” utiliza Sora SemiBold e “GROUP”, Sora Regular com espaçamento ampliado. O símbolo original foi preservado como imagem embutida no SVG; não foi redesenhado nem vetorizado artificialmente. A composição mede 574 × 153 e não depende de fontes externas para exibir o lettering.

`GroupLogo`, em `components/ui/brand.tsx`, fornece a mesma marca para o Hero, os cabeçalhos, a jornada e o rodapé. A versão clara exibe o SVG; a versão escura usa sua transparência como máscara na cor grafite institucional. O PNG branco anterior foi conservado como arquivo histórico, mas não é mais usado por esse componente.

## Tipografia e cores

- Títulos e saudação: Sora SemiBold 600; tamanhos fluidos e espaçamento negativo discreto.
- Corpo: Manrope Regular 400; destaques em Medium 500.
- Navegação, botões e labels: Manrope Medium/SemiBold.
- Tokens de famílias, pesos, escala, entrelinhas, espaços e proporção da marca: `app/globals.css`.
- Fontes: `next/font/google` em `app/layout.tsx`; arquivos WOFF2 são obtidos durante a compilação e servidos pelo próprio site, com `display: swap`.

A abertura da jornada das empresas utiliza o azul escuro já presente no Hero, com texto branco e destaque laranja institucional. As cores e marcas próprias de V3, Cordeiro Engenharia e DreamHome foram mantidas. Seus títulos compartilham o sistema Sora/Manrope da marca-mãe.

## Hero e movimento

Saudação: “Seja bem-vindo ao futuro.”

Complemento: “Engenharia, energia e tecnologia conectadas para transformar o amanhã.”

A proporção da logo no cabeçalho acompanha o novo SVG. A abertura central usa uma composição em coluna com saudação, logo e complemento, também no celular.

A atualização [Hero Scroll Expand](./HERO-SCROLL-EXPAND.md) substitui a subida da logo: a composição central desaparece e, depois, o cabeçalho transparente surge com sua própria logo fixa. Os textos institucionais começam aos 70% da expansão. O título institucional, os CTAs, as rotas, os frames existentes e a jornada das três empresas continuam preservados.

As alternativas de movimento reduzido e de telas baixas/pequenas continuam mostrando diretamente o conteúdo final. Os controles ocultos permanecem fora da interação, e a navegação por teclado conserva o atalho para pular a introdução.

## Validação — 3 de novembro de 2026

- Oito testes de Hero/jornada aprovados no projeto original. Incluem a geometria da logo em 1440×900, 1024×768, 768×1024, 390×844, 375×667 e 320×568, reversibilidade e início do conteúdo aos 70%.
- `git diff --check`: aprovado.
- ESLint: aprovado.
- Build de produção padrão com Turbopack: aprovado, incluindo TypeScript e geração das sete páginas estáticas.

Lint e build foram executados em `/private/tmp/cg-identity-check`, uma cópia do código com dependências instaladas a partir do mesmo lockfile. A execução na pasta sincronizada ficou presa em leituras de dependências; a verificação isolada não alterou versões nem configuração do projeto. A pasta de mídias públicas não foi copiada para essa checagem de compilação.

**Inspeção visual pendente:** apesar da nova autorização do usuário, o controle de acesso do navegador recusou `http://localhost:3000`, alegando permissão salva ou política gerenciada. Não foram utilizados caminhos alternativos para contornar o bloqueio. Os testes geométricos e a compilação não comprovam a aparência renderizada.

Quando o acesso estiver disponível, conferir nas seis resoluções acima: início/meio/fim do Hero, quebra de linhas, encaixe e nitidez da marca, sobreposições, menu móvel, movimento reduzido e as três páginas internas.
