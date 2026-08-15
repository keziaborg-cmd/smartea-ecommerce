# Handoff: Smartea — E-commerce de chás + jornada no app

## Overview
Smartea é uma loja online (PT-BR) de 6 blends de chá natural, com um diferencial de marca: cada lata traz um QR Code que ativa uma jornada de 21 dias no app **Smartea+**, guiada pela **Flora** (IA de bem-estar). O site é uma SPA com 6 telas: **Home**, **Catálogo**, **Produto individual**, **Quiz de recomendação**, **Carrinho/Checkout** e **Sobre**. Inclui carrinho funcional, quiz de recomendação, e um checkout estruturado com uma **área reservada para o Payment Brick do Mercado Pago** (Pix, cartão, boleto) que ainda precisa ser integrada de verdade.

## About the Design Files
O arquivo `Smartea.dc.html` neste bundle é uma **referência de design criada em HTML** — um protótipo que mostra o visual e o comportamento pretendidos, **não** código de produção para copiar direto. Ele foi construído num runtime interno ("Design Component" / `support.js`) que **não deve ser portado**. A tarefa é **recriar este design no ambiente do codebase alvo** (ex.: React/Next.js) usando os padrões e bibliotecas já estabelecidos ali — ou, se não houver ambiente ainda, escolher o framework mais adequado (recomendado: **Next.js + React**, por causa das rotas reais, do SDK do Mercado Pago e da futura integração de backend/tracking) e implementar as telas nele.

Ignore, ao portar: o wrapper `<x-dc>`, o `<script src="./support.js">`, a classe `Component extends DCLogic`, os holes `{{ ... }}` e as tags `<sc-if>/<sc-for>`. Traduza-os para o modelo de componentes/estado do framework escolhido. A lógica de negócio (quiz scoring, carrinho, roteamento, CEP) está descrita abaixo e é direta de reimplementar.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, gradientes por sabor, animações e microinterações estão finais. Recreie a UI fielmente usando as bibliotecas/padrões do codebase. As únicas coisas "de mentira" são: pagamento (simulado), status do pedido (mock "Aprovado"), frete (fixo) e o envio de WhatsApp (abre `wa.me` com texto pré-preenchido).

---

## Design Tokens

### Cores (paleta oficial da marca)
| Papel | Hex |
|---|---|
| Verde escuro (primário) | `#013f24` |
| Verde folha (secundário) | `#568833` |
| Creme / superfície clara (fundo) | `#fffdf8` |
| Creme quente (card destaque "Ervas & folhas") | `#f0e6cf` |
| Vinho / vermelho profundo (família Hibisco) | `#6f1d11` |
| Vermelho vivo da marca (logo/coração) | `#c01718` |
| Quase-preto (texto) | `#211f1e` |
| Dourado (acento: CTAs de destaque, link "Quiz", dots ativos, badge) | `#c8a24a` |

Tons auxiliares em uso (derivados, ok manter): texto sobre escuro `#cfe0c9` / `#dce6d3`; eyebrow/labels `#9db38f` (sobre escuro) e `#7a8a6e` (sobre claro); bordas claras `#e0dac6` / `#d9d2bf`; input bg `#faf8f1`; banda sage da Home `#e1ead4`; caixas de confirmação `#f4efe2`; verde "sucesso" pill `#e6efdd`/`#2f6b2a`; WhatsApp `#25d366`/`#062e13`.

### Paleta por sabor (usada no hero, no card do catálogo e na página do produto — deve ser consistente nas 3)
Cada chá tem: `heroBg` (gradiente do painel escuro), `heroWord` (cor da palavra/nome gigante e itálico), `heroSub` (texto de apoio sobre o painel), `glow` (halo radial atrás da lata), `cardBg` (fundo claro do card no catálogo), `nameColor`, `subColor`, `priceColor`, `btnBg`, `btnFg`.

- **Chá Verde** — heroBg `radial-gradient(120% 120% at 50% 0%,#265033 0%,#013f24 45%,#14301b 100%)`; heroWord `#3c7b33`; heroSub `#dce6d3`; glow `rgba(120,190,90,.45)`; cardBg `linear-gradient(180deg,#e6efdd,#dbe8cf)`; nameColor `#013f24`; subColor `#4a5544`; priceColor `#568833`; btn `#013f24`/`#fffdf8`.
- **Camomila** — heroBg `radial-gradient(120% 120% at 50% 0%,#3a6b3f 0%,#25502f 50%,#173521 100%)`; heroWord `#c9e0b3`; heroSub `#e4efd9`; glow `rgba(1,63,36,.4)`; cardBg `linear-gradient(180deg,#e9e4d3,#e0dac6)`; nameColor `#013f24`; subColor `#4a5544`; priceColor `#568833`; btn `#568833`/`#fff`.
- **Jasmin** — heroBg `radial-gradient(120% 120% at 50% 0%,#2f5a33 0%,#1c3d22 55%,#0f2415 100%)`; heroWord `#568833`; heroSub `#dce6d3`; glow `rgba(90,150,70,.45)`; cardBg `linear-gradient(180deg,#dfe7d6,#cfddc2)`; nameColor `#013f24`; subColor `#4a5544`; priceColor `#568833`; btn `#013f24`/`#fffdf8`.
- **Chá Preto** — heroBg `radial-gradient(120% 120% at 50% 0%,#22381f 0%,#141d14 55%,#0a0f0a 100%)`; heroWord `#3f7d33`; heroSub `#cdd6c8`; glow `rgba(80,110,70,.4)`; cardBg `linear-gradient(180deg,#e0e3da,#d2d8cb)`; nameColor `#013f24`; subColor `#4a5544`; priceColor `#568833`; btn `#013f24`/`#fffdf8`.
- **Cidreira** — heroBg `radial-gradient(120% 120% at 50% 0%,#2f5e37 0%,#013f24 55%,#112817 100%)`; heroWord `#7fbf5f`; heroSub `#dce6d3`; glow `rgba(90,150,70,.45)`; cardBg `linear-gradient(180deg,#dfe8d4,#cddcc0)`; nameColor `#013f24`; subColor `#4a5544`; priceColor `#568833`; btn `#013f24`/`#fffdf8`.
- **Hibisco** — heroBg `radial-gradient(120% 120% at 20% 0%,#8a3232 0%,#6f2323 45%,#4d1a1c 100%)`; heroWord `#e6968e`; heroSub `#f0d4cd`; glow `rgba(230,120,110,.45)`; cardBg `linear-gradient(180deg,#ecdcd6,#e3cbc4)`; nameColor `#6f1d11`; subColor `#6a4a46`; priceColor `#6f1d11`; btn `#6f1d11`/`#fff`.

### Tipografia
- **Títulos / display:** `Carena` (Regular 400) — arquivo `Carena-Regular.otf` incluído no bundle (`@font-face`, format opentype). Usada em H1/H2/H3, nomes de produto, preços, o "Sobre", números.
- **Corpo / UI:** `Montserrat` (Google Fonts, pesos 400–800).
- Tamanhos-chave (clamp para responsivo): nome gigante do hero `clamp(60px,12vw,180px)`; H1 de página `clamp(44px,7vw,84px)`; H2 seção `clamp(40px,6vw,68px)`; título de produto `clamp(46px,6vw,72px)`. Corpo 15–19px, line-height ~1.55–1.7. Eyebrows: 12–13px, `letter-spacing:.26–.28em`, `text-transform:uppercase`.

### Raios, sombras, espaçamento
- Border-radius: painéis grandes `34px`; cards de produto `24–26px`; cards de conteúdo `20–22px`; inputs `12px`; botões-pílula `30–40px`; badges/pills `20–30px`.
- Sombras: lata no hero `drop-shadow(0 40px 45px rgba(0,0,0,.5))`; cards de produto `drop-shadow(0 26px 26px rgba(0,0,0,.28))`; botão dourado `0 10px 24px rgba(1,63,36,.35)` (herdado do gold, pode usar `rgba(0,0,0,.2)`).
- Container maior: `max-width` 1200–1500px conforme a tela; padding lateral `6vw`.

---

## Screens / Views

Roteamento por **hash** (SPA), com URLs reais e suporte a back/forward e deep-link:
`#/` (Home) · `#/produtos` (Catálogo) · `#/produtos/:slug` (Produto) · `#/quiz` · `#/carrinho` (Checkout) · `#/sobre`. Slugs: `cha-verde, camomila, jasmin, cha-preto, cidreira, hibisco`. Numa implementação Next.js, mapear para rotas reais (`/produtos/[slug]` etc.). A cada troca de rota: `window.scrollTo(0,0)` e fechar o menu mobile.

### Nav (persistente em todas as telas)
- Barra sticky no topo, fundo `rgba(1,63,36,.92)` + `backdrop-filter:blur(10px)`, padding `18px 6vw`.
- 3 zonas (flex, space-between): **esquerda** links "Sobre", "Produtos", "Quiz" (Quiz em dourado `#c8a24a`, peso 800); **centro** logo numa pílula creme `#fffdf8` (padding `13px 32px`, radius 40, img `logo.png` altura 58px — a pílula "flutua" abaixo da barra propositalmente); **direita** botão "Contato" (abre modal) + link "Carrinho" (pílula com borda, ícone 🛒, label e **contador** numa pílula creme com o número).
- **Mobile (≤760px):** links da esquerda e "Contato" somem; aparece um botão hambúrguer (☰, 42×42, borda clara) que abre um **overlay fixo** (fundo `rgba(20,32,20,.55)` + blur) com um painel `#013f24` deslizando do topo, listando: Início, Sobre, Produtos, Fazer o quiz (dourado), Carrinho, Contato — cada item com borda inferior sutil. Logo reduz para 40px; "Carrinho" vira só ícone + contador.

### 1. Home (`#/`)
Sequência de seções com transições orgânicas (ver "Interactions"):
- **Hero carrossel** (painel arredondado 34px, `min-height:660px`, fundo = `heroBg` do chá atual com `transition:background .5s`): topo com número `01`…`06`, linha degradê, "/ 06" e chip do sabor (uppercase). Setas circulares ← → (52px) à esquerda/direita. **Palco central**: a palavra/nome do chá gigante em Carena atrás (cor `heroWord`, `opacity:.9`) e a **lata** (`heroImg`) sobreposta e centralizada, com halo `glow`. Abaixo: tagline em itálico (Carena, `heroWord`), linha "Chá 100% natural, sem açúcar. **{peso}** · **{preço}**", dois botões ("Ver o chá" → página do produto atual; "Descobrir meu ritual" → `#/quiz`, botão de destaque creme), e uma linha com selo "QR" + texto sobre a jornada de 21 dias / Smartea+ / Flora. **Dots** (6) embaixo; o ativo é mais largo (`26px`) e dourado.
- **Sobre resumida** — banda em tom **sage `#e1ead4`** com **borda superior em curva orgânica** (SVG wave) e a **lata de Cidreira** flutuando, atravessando a divisa hero→banda. Grid 2 col: à esquerda texto "Sobre" + link "Conheça nossa história →"; à direita grid de chips (Antioxidantes, L-teanina, Vitamina C, Zinco) + 4 cards de benefício (verde, creme-quente, vinho, verde-escuro "100%").
- **Produtos em destaque** — banda creme com curva superior; cabeçalho "Em destaque / Escolha o seu ritual" + link "Ver todos os chás →"; grid de **3 cards** (os 3 primeiros chás).
- **CTA Quiz** — painel verde-escuro arredondado, centralizado: "Qual ritual combina com você?" + botão "Fazer o quiz" (creme) → `#/quiz`.

**Card de produto (reutilizado em destaque, catálogo e "outros rituais"):** fundo `cardBg` do sabor; halo radial atrás; imagem da lata (270px; 190px na versão menor); nome (Carena), tagline itálico e peso; linha inferior com preço (Carena) e botão "Adicionar". A imagem+nome são um link para a página do produto; o botão "Adicionar" só adiciona ao carrinho (dispara toast).

### 2. Catálogo (`#/produtos`)
Cabeçalho centralizado "Nossos chás / Escolha o seu ritual" + grid de **6 cards** (3 col desktop, 2 col ≤1000px, 1 col ≤620px).

### 3. Produto (`#/produtos/:slug`)
- Link "← Voltar para produtos".
- **Painel do produto** (fundo `heroBg` do sabor, grid 2 col): à esquerda a lata com halo (floaty); à direita chip, nome (Carena, `heroWord`), tagline itálico, descrição (`about`), preço (Carena) + peso (pill com borda), botão "Adicionar ao carrinho" (creme), e linha "QR" com o texto da jornada.
- **Detalhes** (grid 2 col, cards brancos): "Modo de preparo" (texto `prep` com tempo/temperatura) e "Benefícios" (lista com check verde, itens `benefits`).
- **Bloco de conteúdo expandido (PDP)** — abaixo da compra, na ordem: 
  1. **O momento / O ritual** — grid 2 col: card branco "O momento" (problema, `pdp.problema`, Carena 23px) + card claro (`cardBg` do sabor) "O ritual" (solução, `pdp.solucao`). Kickers uppercase; o do ritual usa `priceColor` do sabor como acento.
  2. **O que ele traz** — card branco com tags-pílula (`pdp.beneficios`, ex.: "Antioxidantes · L-teanina · Vitamina C · Zinco") — cada pílula com um ponto colorido no acento do sabor.
  3. **Como funciona** — card branco, texto `pdp.como` (preparo/ritual em linguagem simples).
  4. **Diferencial** — painel verde-escuro `#013f24` com selo QR: kicker dourado "Só na Smartea · jornada {pdp.jornada}" + `pdp.diferencial` (a jornada de 21 dias no Smartea+ com a Flora).
  5. **Gatilhos honestos** — grid de 2–3 cards (`#f7f3e8`) a partir de `pdp.gatilhos` (`{k,t}`): prova social, autoridade branda (tradição de uso), escassez real (lote/colheita) ou honestidade/cuidado. **Regra editorial:** sem contador regressivo, sem "últimas unidades" fictício, sem urgência artificial, sem promessa clínica.
  6. **FAQ (acordeão)** — `pdp.faq` (`{q,a}`, 4–5 por chá, mistura de perguntas gerais e específicas). Cada item é um card branco com botão (pergunta + selo +/– no acento do sabor); a resposta abre/fecha via estado `faqOpen` (índice aberto, ou `null`; **só um aberto por vez**, reseta ao trocar de rota).
- **"Outros rituais"** — grid de 3 outros chás (cards).
- **Navegação anterior/próximo** entre os 6 (circular): rodapé com "← Anterior {nome}" e "Próximo → {nome}".

### 4. Quiz (`#/quiz`)
Painel verde-escuro. Título "Qual ritual combina com você?".
- **Modo perguntas:** barra de progresso (5 dots; preenchidos até o passo atual, dourado), "Pergunta X de 5", enunciado (Carena), e **opções** em grid 2 col (botões creme translúcidos; hover: fundo dourado suave + borda dourada). Clicar numa opção **avança automaticamente**. Botão "← Voltar" a partir da 2ª pergunta.
- **Modo resultado:** grid 2 col — lata recomendada (com halo) + à direita "Seu chá ideal", nome (Carena), frase explicativa (`recWhy`), peso · preço, e 2 CTAs: **"Adicionar ao carrinho"** (dourado; adiciona e vai para `#/carrinho`) e **"Receber esse resultado no WhatsApp"** (verde `#25d366`). Abaixo: "↺ Refazer o quiz" e "Ver a página do chá →". **Card complementar** ("Também combina com você") logo abaixo, com a 2ª maior pontuação: lata pequena, nome, tagline, preço e botão "Adicionar". Tom de recomendação, sem venda agressiva.

### 5. Carrinho / Checkout (`#/carrinho`)
Cabeçalho "Finalizar pedido / Seu carrinho".
- **Modo checkout** — grid 2 col (`1.5fr .9fr`; 1 col ≤1000px):
  - **Coluna esquerda (3 cards numerados):**
    1. **Dados de entrega** — grid de inputs: Nome (full), E-mail (full), Telefone, **CEP** (com busca automática ao sair do campo — ViaCEP), Endereço (full), Número, Complemento, Bairro (full), Cidade, UF. Inputs `#faf8f1`, borda `#d9d2bf`, radius 12.
    2. **Método de envio** — 2 opções tipo rádio (borda vira verde `#568833` quando selecionada): "Entrega padrão · 3–7 dias úteis · R$ 12,90" e "Retirar na loja · Pronto em 24h · Grátis".
    3. **Pagamento** — 3 chips (Pix / Cartão de crédito/débito / Boleto) + **um container vazio com `id="paymentBrick_container"`** (borda tracejada, `min-height:230px`) com o texto "Área reservada — Payment Brick do Mercado Pago". **Não desenhar formulário de cartão** — este é o ponto de montagem do Brick real.
  - **Coluna direita (resumo, sticky):** painel verde-escuro com lista de itens (nome, preço unitário, stepper −/+ de quantidade, subtotal da linha), **Subtotal**, **Frete**, **Total** (Carena), e botão "Finalizar compra · {total}". Se o carrinho estiver vazio: mensagem + link "Escolha um chá".
- **Confirmação pós-compra** (após submit): card branco centralizado com ✓, "Pedido confirmado!", número do pedido (`SMT-XXXXXX`), pill de status do pagamento ("Aprovado"), e um bloco verde-escuro **"Próximo passo"** com selo QR reforçando: *escanear o QR Code da embalagem quando o chá chegar* para ativar o ritual. Botão "Voltar ao início".

### 6. Sobre (`#/sobre`)
- História da marca (3 parágrafos centralizados, "Um ritual em cada lata").
- Bloco verde-escuro "A jornada continua no app" (selo QR + texto Smartea+/Flora/21 dias).
- Grid 2 col de 4 cards de benefício (verde, **creme-quente `#f0e6cf`** para "Ervas & folhas", vinho, verde-escuro "100%") + botão "Ver os chás".

### Modal de Contato (global)
Overlay `rgba(20,32,20,.55)` + blur; card creme centralizado (max 440px): "Fale com a gente" + botão ✕. 3 canais como linhas clicáveis: E-mail (`mailto:ola@smartea.com`), WhatsApp (`wa.me` com texto), Instagram (`instagram.com/smartea`). Fecha no ✕ ou clicando fora (stopPropagation no card).

### Toast (global)
Pílula verde-escura fixa embaixo-centro, "✓ {nome} adicionado ao carrinho", some após ~1,8s.

---

## Interactions & Behavior
- **Animação da lata no hero (`hero-arrive`, ~720ms, `cubic-bezier(.16,1,.3,1)`):** a cada troca de slide (setas, dots, ou automática) a lata entra deslocada (`translate(66px,46px) scale(.84)`, opacidade 0, `blur(5px)`) e desliza até o centro sobre o nome (`translate(0,0) scale(1)`, nítida). Disparo via `key` que muda por índice. A palavra do nome faz um `fade-in` leve (`hero-wordfade`, .7s). Depois de posicionada, a lata mantém um "flutuar" contínuo (`floaty`, 7s, translateY + leve rotação). Consistente nos 6 slides.
- **Revelação ao rolar (`reveal`):** seções entram com fade + `translateY(30px)→0`. Implementado com **scroll-driven animations do CSS** (`animation-timeline: view(); animation-range: entry 0% cover 26%`). No codebase, se o alvo não suportar, usar IntersectionObserver equivalente. A Home tem o tratamento completo (bandas de cor + curvas SVG + lata atravessando a divisa); Catálogo, Produto, Sobre e Checkout usam só o reveal.
- **Divisores orgânicos (Home):** SVGs `<path>` em onda no topo das bandas (sage e creme) preenchidos com a cor da banda, posicionados `top:-88px` para a cor "invadir" a seção anterior. Uma lata (Cidreira) posicionada absoluta atravessa a divisa hero→Sobre.
- **Transições de página:** `pagein` (.3s, fade + translateY leve) ao montar cada rota.
- **Carrinho:** "Adicionar" incrementa quantidade por nome do chá e dispara toast; steppers −/+ no resumo ajustam/removem; contador do nav = soma das quantidades.
- **Quiz:** clique numa opção grava a resposta e avança; na 5ª, calcula o resultado. "Voltar" volta um passo; "Refazer" zera.
- **WhatsApp:** `window.open('https://wa.me/?text=' + encodeURIComponent(msg))` — abre com a mensagem pré-preenchida (sem número definido ainda).
- **Contato/menu:** modal e menu mobile controlados por estado; menu fecha ao navegar.
- **Hover:** opções do quiz (fundo/borda dourados); botões/links têm estados de cor; links padrão `#568833` → hover `#568833`/mais claro.

## State Management
Estado global (hoje num único componente; num app real → contexto/store + rotas):
- `route` (derivado do hash) — página + slug.
- `faqOpen` — índice do item de FAQ aberto na PDP, ou `null` (acordeão de item único; reseta a `null` ao trocar de rota).
- `hero` (índice 0–5 do carrossel).
- `cart` — objeto `{ [nomeDoChá]: quantidade }`. Derivados: `cartUnits` (soma), `cartItems` (linhas com subtotal), `subtotal`, `frete` (12,90 ou 0), `total`.
- `ship` — `'padrao' | 'retirada'`.
- Quiz: `quizStep` (0–4), `quizAns` (array de índices), `quizDone` (bool).
- Checkout: campos `nome, email, telefone, cep, rua, numero, complemento, bairro, cidade, uf`; `cepLoading`; `checkoutDone`; `orderNum`.
- UI: `contactOpen`, `menuOpen`, `toast`.

### Lógica do quiz (recomendação)
5 perguntas, cada opção soma pontos por chá (tabela em `quizData()` no arquivo). Recomendado principal = maior pontuação; complementar = 2ª maior (chá diferente). Perguntas: momento do dia; objetivo (**calma / foco / energia / controle da compulsão alimentar**); sabor (floral / frutado-cítrico / herbal-suave / encorpado); cafeína (sim / prefiro sem / tanto faz); tipo de ritual (suave / reconfortante / marcante). As frases explicativas por chá estão em `quizWhy()`.

### Busca de CEP
Ao sair do campo CEP (8 dígitos), `fetch('https://viacep.com.br/ws/{cep}/json/')` e preencher rua/bairro/cidade/UF. Já funciona no protótipo (API pública com CORS).

## Dados dos produtos (⚠️ preços e pesos são ESTIMATIVA — confirmar com o cliente)
| Chá | slug | peso | preço |
|---|---|---|---|
| Chá Verde | cha-verde | 150g | R$ 29,90 |
| Camomila | camomila | 100g | R$ 24,90 |
| Jasmin | jasmin | 80g | R$ 27,90 |
| Chá Preto | cha-preto | 180g | R$ 32,90 |
| Cidreira | cidreira | 120g | R$ 26,90 |
| Hibisco | hibisco | 200g | R$ 34,90 |

Descrição (`about`), preparo (`prep`, com tempo/temperatura) e benefícios (`benefits`) de cada chá estão no objeto `teas()` dentro de `Smartea.dc.html` — copiar de lá (texto final aprovado no design). O **conteúdo expandido da PDP** (problema, solução, tags de benefício, como funciona, diferencial/jornada, gatilhos e FAQ por chá) está no objeto `pdpData()`, chaveado por slug — copiar de lá também. **Revisar com regulatório** as frases funcionais ("aliado do metabolismo", "controle da compulsão alimentar") antes de publicar.

## Assets
- `logo.png` — logo horizontal Smartea (coração folha + wordmark), PNG transparente. Sempre sobre pílula/fundo claro (o wordmark é verde-escuro).
- `Carena-Regular.otf` — fonte de títulos.
- `tea/cha-verde.png, camomila.png, jasmin.png, cha-preto.png, cidreira.png, hibisco.png` — latas recortadas (fundo transparente), incluídas na pasta `tea/` deste bundle.
- Montserrat via Google Fonts.
- Ícones: emojis/glifos simples (🛒, ✓, etc.) e o selo textual "QR" — substituir por ícones/SVGs do design system do codebase se preferir.

## O que fica para LÓGICA / INTEGRAÇÃO (Claude Code)
1. **Mercado Pago real:** inicializar o SDK e montar o **Payment Brick** em `#paymentBrick_container` (Pix / cartão com parcelas / boleto); criar preferência/pagamento no backend; webhooks de status. Hoje "Finalizar compra" só simula (gera número e mostra "Aprovado").
2. **Backend de pedidos:** persistir pedido/itens/endereço; número e status reais.
3. **Frete real:** integrar Correios/transportadora (hoje fixo R$ 12,90 / Grátis).
4. **Tracking:** Pixel/GA4 (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).
5. **WhatsApp:** hoje só abre `wa.me` com texto; envio/atendimento automático (API oficial) é integração. **Definir número oficial** e o @ do Instagram.
6. **Quiz:** cálculo roda no front; se quiser salvar leads/respostas ou personalizar via backend, integrar.
7. **Ativação do QR / jornada Smartea+:** vínculo lata↔app e a jornada de 21 dias com a Flora.

## Files
- `Smartea.dc.html` — protótipo completo de todas as telas (referência de layout, cores, textos e lógica). Ler o `<x-dc>` para markup e o `<script data-dc-script>` para os dados (`teas`, `quizData`, `quizWhy`) e a lógica.
- `logo.png`, `Carena-Regular.otf` — assets incluídos.
- `tea/*.png` — as 6 latas, incluídas no bundle.
- `screenshots/01–12` — telas gerais (Home, Catálogo, Produto, Quiz, Checkout, Sobre, mobile). `screenshots/13–15` — o **bloco expandido da PDP**: benefícios/O momento, O ritual + tags + Como funciona, e FAQ (acordeão) com item aberto.
