---
name: Smartea
description: Uma botica de jardim que acende uma luz por dia — chás funcionais e o app Smartea+, em verde-floresta, creme e vinho.
colors:
  verde-escuro: "#013f24"
  verde-folha: "#568833"
  vinho: "#6f1d11"
  vermelho-marca: "#c01718"
  dourado: "#c8a24a"
  creme: "#fffdf8"
  creme-quente: "#f0e6cf"
  sage: "#e1ead4"
  tinta: "#211f1e"
  texto-sobre-escuro: "#dce6d3"
  eyebrow-claro: "#7a8a6e"
  eyebrow-escuro: "#9db38f"
  borda-clara: "#e0dac6"
  input-bg: "#faf8f1"
  sucesso-fg: "#2f6b2a"
  folha-viva: "#477023"
  folha-viva-escura: "#324e19"
  bg-mais: "#f6f2e6"
  tinta-mais: "#22331c"
  jornada-sono: "#b8703a"
  jornada-ansiedade: "#5c8a72"
  jornada-produtividade: "#8a9a3e"
  jornada-pausa: "#b0685f"
typography:
  display:
    fontFamily: "Carena, serif"
    fontSize: "clamp(44px, 7vw, 80px)"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "Carena, serif"
    fontSize: "clamp(42px, 6vw, 68px)"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Carena, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  eyebrow:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    letterSpacing: "0.26em"
rounded:
  input: "12px"
  card-conteudo: "22px"
  card-produto: "26px"
  panel: "34px"
  pill: "40px"
spacing:
  gutter: "6vw"
  card: "24px"
  section: "60px"
components:
  button-primary:
    backgroundColor: "{colors.verde-escuro}"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
    padding: "12px 32px"
  button-on-dark:
    backgroundColor: "{colors.creme}"
    textColor: "{colors.verde-escuro}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.verde-escuro}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
  button-3d:
    backgroundColor: "{colors.folha-viva}"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
  card-produto:
    rounded: "{rounded.card-produto}"
    padding: "24px"
  card-conteudo:
    rounded: "{rounded.card-conteudo}"
    padding: "32px"
  nav:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.verde-escuro}"
---

# Design System: Smartea

## Overview

**Creative North Star: "A Botica de Jardim"**

Antigo no carinho, novo na execução: uma botica de jardim que acende uma luz por dia. A metáfora guia o design por dentro (latas como frascos de farmácia de ervas, uma luz verde atrás de cada uma, superfícies de papel creme) e **nunca vira texto de comunicação**: "botica" pode puxar a marca para o lado de remédio, e a Smartea é cuidadosa com alegações de saúde. Para o público, a linguagem é "jardim" e "estufa".

O sistema é suave e orgânico por padrão: cantos grandes, pílulas, divisores ondulados, brilho difuso atrás das latas. A paleta é botânica e quente (verde-floresta sobre creme, vinho como contraponto), nunca clínica. O Smartea+ (`/smartea-mais`) é a camada gamificada: mais saturada e tátil, mas derivada da mesma paleta da marca.

**Key Characteristics:**
- Verde-floresta e creme quente como base; vinho e dourado como acentos raros.
- Cada chá tem sua própria luz: gradiente de fundo, brilho e cores de botão por blend (`data/teas.ts`).
- Carena (serif de display) para títulos e preços; Montserrat para todo o resto.
- Botões em pílula; um único gesto tátil, o botão com laje sólida, para a ação "fiz hoje".
- Latas de produto são o herói visual; sombra só nelas.

## Colors

Botânica e quente: verdes profundos sobre papel creme, com vinho e dourado como pontuação.

### Primary
- **Verde Floresta** (#013f24): títulos, botões primários, fundos escuros de seção e hero. A cor-âncora da marca.
- **Verde Folha** (#568833): links, preços, acentos de hover e detalhes vivos sobre claro.

### Secondary
- **Vinho** (#6f1d11): item de nav em destaque (Quiz), hover de contornos. Contraponto quente, usado com parcimônia.
- **Vermelho Marca** (#c01718): reservado ao logotipo e a momentos de reacender o foco. Nunca para culpa ou erro punitivo.

### Tertiary
- **Dourado** (#c8a24a): cor de seleção de texto e hover de contornos sobre fundo escuro.

### Neutral
- **Creme** (#fffdf8): fundo base do site e texto sobre escuro.
- **Creme Quente** (#f0e6cf): superfícies suaves e cartões de benefício.
- **Sage** (#e1ead4): barra de navegação (com blur) e bandas de seção "Sobre".
- **Tinta** (#211f1e): texto de corpo (usado a ~80% de opacidade).
- **Texto Sobre Escuro** (#dce6d3): texto em fundos verde-escuro.
- **Eyebrow Claro / Escuro** (#7a8a6e / #9db38f): rótulos em caixa-alta.
- **Borda Clara** (#e0dac6) e **Input** (#faf8f1): bordas e campos.

### Smartea+ (escopo da página /smartea-mais)
- **Folha Viva** (#477023, escura #324e19), fundo **Creme Mais** (#f6f2e6), texto **Tinta Mais** (#22331c).
- Jornadas: **Sono** terracota (#b8703a), **Ansiedade** verde-água (#5c8a72), **Produtividade** oliva (#8a9a3e), **Pausa** rosé (#b0685f), cada uma com variante escura e clara.

### Named Rules
**The Luz do Dia Rule.** Cada blend carrega a própria luz (gradiente + brilho + cor de botão). Cores por chá vivem em `data/teas.ts`, não em tokens globais.
**The Vermelho Sem Culpa Rule.** Vermelho nunca pune. Aparece para reacender o foco, jamais como erro de fracasso ou cobrança.
**The Escopo Smartea+ Rule.** Paleta e fontes do Smartea+ ficam na página do app; a loja usa verde-escuro e Carena/Montserrat.

## Typography

**Display Font:** Carena (serif, arquivo local `public/fonts/Carena-Regular.otf`, fallback serif)
**Body Font:** Montserrat (Google Fonts, fallback sans-serif)
**Smartea+:** Fredoka (display) e Nunito (corpo), apenas em `/smartea-mais`.

**Character:** Um serif de display com calor de rótulo antigo contra uma sans geométrica limpa e legível; carinho antigo, execução nova.

### Hierarchy
- **Display** (400, clamp(44px, 7vw, 80px), 1): títulos de página, em verde-escuro.
- **Headline** (400, clamp(42px, 6vw, 68px), 1): títulos de seção na home.
- **Title** (400, 1.5rem): nomes de produto, títulos de cartão, preços (1.25rem).
- **Body** (400, 1rem, ~1.6): texto corrido em tinta a 80%; limite confortável (~max-w-md a 900px).
- **Label** (600, 0.875rem): botões, links de nav (500).
- **Eyebrow** (800, 0.75rem, 0.26em, caixa-alta): rótulos de seção acima dos títulos.

### Named Rules
**The Display É Carena Rule.** Todo título e todo preço usa `font-display`; nunca Montserrat em peso alto para títulos.
**The Eyebrow Rule.** Rótulos de seção são sempre o mesmo gesto: Montserrat 800, caixa-alta, espaçamento largo, em verde-sálvia.

## Layout

Container máximo de 1500px com gutter lateral de 6vw. Páginas de texto estreitam para 900–1100px; faixas largas chegam a 1400–1600px em telas grandes. Ritmo vertical generoso (seções com ~60px, hero com ~44px de topo). Grades de 2 colunas (≥ sm/md) colapsam em coluna única no mobile; navegação central com logo absoluta no desktop e menu no mobile. A entrada de página usa um fade com subida de 12px (0.3s).

## Elevation & Depth

Híbrido: superfícies planas em camadas tonais (sage, creme, creme quente), com sombra reservada ao produto e ao feedback.

### Shadow Vocabulary
- **Lata** (`box-shadow: 0 40px 45px rgba(0,0,0,0.5)`): latas em hero e destaque.
- **Cartão de produto** (`0 26px 26px rgba(0,0,0,0.28)`): lata dentro do cartão.
- **Laje sólida** (`0 5px 0 0 var(--btn-shadow)`): só no botão 3D do Smartea+; encolhe a 1px ao pressionar.
- **Brilho de lata** (radial-gradient com blur de 6px, ~70px além da borda): luz difusa atrás da lata.

### Named Rules
**The Sombra É do Produto Rule.** Superfícies e cartões ficam planas; só a lata projeta sombra pesada.

## Shapes

Linguagem orgânica de cantos grandes: pílula (40px) para botões e chips, 12px para campos, 22px para cartões de conteúdo, 26px para cartões de produto, 34px para painéis. Divisores de seção são ondas SVG, não linhas retas. Latas flutuam levemente (`floaty`, 7s) e cruzam as divisas de seção.

## Components

### Buttons
- **Shape:** pílula (40px).
- **Primary:** verde-escuro com texto creme, padding ~12px 32px, peso 600.
- **On dark:** creme com texto verde-escuro (hero e banda verde).
- **Outline / ghost:** borda verde-escuro a 25% (ou branca a 30% sobre escuro); hover leva a borda para vinho (claro) ou dourado (escuro).
- **3D (Smartea+):** cor viva com laje sólida mais escura embaixo; ao pressionar, desce 4px e a laje encolhe. É o único gesto tátil do sistema; usar para a ação "fiz hoje".

### Cards / Containers
- **Cartão de produto:** 26px, padding 24px, fundo em gradiente por chá, lata central com brilho, nome em Carena, tag em itálico, preço e botão em pílula com as cores do blend.
- **Cartão de benefício:** 22px, fundo e texto vindos dos dados (`data/benefits.ts`), título em Carena 1.5rem.

### Inputs / Fields
- Fundo `input-bg` (#faf8f1), borda `borda-clara`, raio 12px.

### Navigation
- Barra sticky em sage a 95% com blur; links em verde-escuro (peso 500) com hover verde-folha; "Quiz" em vinho, peso 800. Logo centralizada no desktop. Contato e Carrinho como pílulas com contorno.

### Toast
- Pílula verde-escuro com texto creme, fixa no rodapé central.

## Do's and Don'ts

### Do:
- **Do** usar verde-escuro (#013f24) como cor-âncora e creme (#fffdf8) como fundo base.
- **Do** dar a cada blend a própria luz (gradiente, brilho, cores de botão) vinda de `data/teas.ts`.
- **Do** usar Carena para títulos e preços, Montserrat para o resto.
- **Do** manter botões como pílulas e cartões com cantos de 22–34px.
- **Do** reservar o botão 3D de laje sólida ao Smartea+ e à ação "fiz hoje".
- **Do** usar "jardim" e "estufa" na comunicação; "botica" é só direção interna de design.

### Don't:
- **Don't** parecer clínico ou farmacêutico: nada de branco frio, jaleco ou tom de suplemento de academia.
- **Don't** clonar o Duolingo: o Smartea+ é gamificado, mas derivado da paleta da marca (folha-viva, jornadas em tons terrosos), nunca verde-lima ou azul literal.
- **Don't** usar vermelho para culpar ou punir; ele reacende o foco.
- **Don't** pôr sombra pesada em superfícies ou cartões; só nas latas.
- **Don't** usar a paleta ou as fontes do Smartea+ (Fredoka, Nunito, jornadas) fora de `/smartea-mais`.
