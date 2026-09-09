/**
 * garden-inventory — categoriza os nodes de `public/models/garden-scene/
 * garden.glb` dinamicamente, por PADRÃO de nome, na hora em que o modelo
 * é carregado. Não hardcoda nomes de instância individual (esses vêm do
 * glTF em runtime, via `scene.traverse`) — só os regex/regras de
 * categorização, que continuam válidos mesmo que o artista renomeie ou
 * adicione instâncias no arquivo no futuro.
 *
 * DESCOBERTA (2026-08-20, investigação direta do JSON do glTF antes de
 * escrever qualquer mapeamento — 2690 nodes, 1343 meshes): a hierarquia
 * real é bem menos plana do que os nomes sugerem à primeira vista.
 *
 * - "Bush1/2/3/4" (57 instâncias no total, todas confirmadas: Bush1×12,
 *   Bush2×4, Bush3×22, Bush4×19) NÃO existem soltas no nível superior —
 *   estão TODAS aninhadas dentro de "Tree1" (o node grande, 316
 *   sub-nodes/158 meshes), junto com Tree2×11/Tree3×3/Leaves1-3×15/
 *   Icosphere×71.
 *
 * REVISADO (2026-08-20, rodada 7): o "esqueleto sempre visível" original
 * (Tree1 + Tree2 + Tree3 + Leaves + Icosphere, ~101 instâncias) ficou
 * grande demais pro dia 0 — o objetivo é o jardim começar praticamente
 * vazio. Só o node "Tree1" em si + seu filho direto "Leaves1" (1 tronco +
 * 1 copa = 1 árvore) continuam sempre visíveis; TUDO o resto que estava
 * dentro do subtree de "Tree1" (Tree2×11, Tree3×3, Leaves2×11, Leaves3×3,
 * Icosphere×71, além dos bushes×57) entra no pool de revelação — 156
 * itens escopados especificamente pro subtree de "Tree1", MAIS as 7
 * árvores pequenas "Tree1.001-007" (que já eram pool) = 163 no total.
 *
 * ESCOPO CRÍTICO: "Icosphere" também existe aninhado dentro de CADA
 * "Tree1.001"-"Tree1.007" (3 por árvore, ~21 no total — são a copa
 * daquelas árvores pequenas). Se o pool casasse "Icosphere" por regex
 * GLOBAL na cena inteira, contaria esses de novo, e cada Tree1.00X já
 * revela sua própria copa em cascata (por ser pai deles) — um Icosphere
 * "extra" registrado separadamente ficaria com visibilidade própria
 * dessincronizada do pai, podendo mostrar uma árvore pequena sem galho
 * nenhum. Por isso a extração de Tree2/Tree3/Icosphere/Leaves2/Leaves3
 * é escopada ao `.traverse()` do node "Tree1" (o grande) especificamente
 * — como "Tree1.001"-"007" são filhos diretos de Root, não de "Tree1",
 * essa varredura nunca alcança os Icosphere aninhados neles.
 * - "Gate" (707 meshes — o MAIOR node do arquivo, de longe) é na
 *   verdade o pavilhão/gazebo, não um portão simples: Wall1×40 + wall
 *   (minúsculo)×40 + Pillar1×3 + Wall2×2 + Cylinder×2 + Handle×2
 *   (estrutura/base), Glass×4 (vidraças), Board1×44 + Board2×56
 *   (bancos), e o resto — Plane×508 + Arc×1 + Gate(porta)×1 + Lamp×4
 *   internos — vira "telhado" por eliminação (não dá pra distinguir
 *   telhado/parede/chão só pelo nome dos 508 Planes sem abrir num
 *   viewer 3D; é uma aproximação assumida).
 * - "Floor" mistura ladrilhos genéricos (Cube/Cylinder/Plane, sempre
 *   visíveis) com uma área de descanso nomeada (Bench, Bench leg, Bar,
 *   Down/Up bar, Table leg, Tabletop, Small roof, Small pillar, Pillar,
 *   Roof, Wall) — só a mobília nomeada entra no marco de revelação.
 * - "Pond" arrasta peixe/vitória-régia/juncos×8/pedras×3 (273 meshes) —
 *   revelado como um bundle único, sem sub-etapas.
 * - 14 objetos soltos no topo (Plane.471-482 + Board1.030 + Board2.042 +
 *   Cube.316 + Cylinder/.019/.025) formam um deck/pérgola solta, sem
 *   relação estrutural com "Gate" apesar do nome parecido.
 * - "Man" e "Lighthouse" são resquícios do artista original — sempre
 *   ocultos, nunca fazem parte da composição.
 * - "Sun.002" não tem mesh nenhum (não há `KHR_lights_punctual` no
 *   arquivo) — é um empty/helper do Blender, sem efeito visual; ignorado
 *   por não ter nada pra esconder/mostrar.
 *
 * BUGS CORRIGIDOS (2026-08-20, rodada 8) — "dia 0 mostrando elementos
 * demais" apesar da redução da rodada anterior. Causa raiz encontrada
 * comparando programaticamente TODOS os 2690 nodes contra o que o código
 * realmente cobre (o equivalente ao console.log pedido, só que rodado
 * contra o JSON do glTF em vez de precisar renderizar — este ambiente
 * não renderiza WebGL, ver conversa):
 *
 * 1. `Glass.004-008` (5 objetos soltos no topo, cúpula/vidro de cada
 *    Lamp.NNN correspondente pelo mesmo sufixo numérico) nunca tinham
 *    sido colocados em NENHUM bucket — nem pool, nem milestone, nem
 *    excluded. Objeto que não está em nenhuma dessas 3 listas nunca tem
 *    `.visible` tocado por `GardenProgressive`, e o default do
 *    `THREE.Object3D` é `visible = true` — ou seja, ficavam sempre
 *    visíveis por OMISSÃO, não por decisão. Corrigido casando cada
 *    Glass.NNN com o Lamp.NNN do mesmo lote (lampsFirst/lampsRest).
 * 2. O "Floor" tinha 43 instâncias nomeadas no subtree; só as 12 com
 *    nome descritivo (Bench, Table leg, etc) entravam no marco de
 *    mobília — as outras 30 (nomes genéricos do Blender tipo "Cube.001",
 *    "Cylinder.012") ficavam de fora do filtro por nome e caíam no
 *    default sempre-visível, incluindo 10 que usam o material
 *    "Bench_leg" (claramente mobília, só sem nome descritivo) e mais 19
 *    com proporção de poste/prancha fina (não são a malha de chão em
 *    si — essa é só UMA instância, também chamada "Floor", dentro do
 *    subtree). Corrigido: em vez de uma lista de nomes pra INCLUIR, o
 *    filtro agora INCLUI tudo no subtree de "Floor" EXCETO a instância
 *    literalmente chamada "Floor" (a malha de chão de verdade).
 *
 * BUG RAIZ ENCONTRADO (2026-08-20, rodada 9) — os dois fixes acima
 * ajudaram mas o dia 0 continuava mostrando ~220 objetos. Causa real,
 * confirmada com um contador de "objetos visíveis" rodando contra a cena
 * DE VERDADE (não a simulação em Python contra o JSON — via essa, os
 * nomes pareciam certos, mas o JSON não é o que o three.js efetivamente
 * carrega): `GLTFLoader.createUniqueName()` passa TODO nome de node por
 * `PropertyBinding.sanitizeNodeName()`, que REMOVE os caracteres
 * `[ ] . : /` (são reservados pra sintaxe de path de animation-track,
 * tipo "nodeName.property"). "Bush3.021" no arquivo vira "Bush3021" em
 * runtime — sem ponto nenhum. TODAS as minhas regexes/strings com ponto
 * literal (`/^Bush[1-4](\.\d+)?$/`, "Plane.471", "Wall1.027" etc) nunca
 * bateram com nenhuma instância numerada — só com os poucos nomes sem
 * sufixo (tipo "Bush1" puro). Praticamente o pool e os buckets nomeados
 * inteiros ficavam vazios, e cada objeto não-categorizado cai no default
 * `visible=true` do THREE.Object3D — daí os ~220 sempre visíveis.
 * Corrigido importando a MESMA função (`PropertyBinding.sanitizeNodeName`,
 * exportada publicamente por "three") e sanitizando toda referência de
 * nome (listas de string E regexes) por ela, em vez de reimplementar a
 * transformação à mão (arriscado — já errei uma vez tentando adivinhar).
 *
 * BUG CORRIGIDO (2026-08-20, rodada 10) — mesmo com o pool/milestones
 * corrigidos, sobrava uma "plataforma octogonal" (o piso da área de
 * descanso) sempre visível. Causa: eu assumia que existia um sub-node
 * chamado "Floor" DENTRO do subtree do "Floor" externo, análogo ao
 * padrão "Pond" (grupo) → "Pond_0" (mesh) + "Pond" (self, achado em
 * varredura recursiva) — e excluía esse suposto sub-node da varredura de
 * mobília achando que era "o chão de verdade". Só que checando os
 * FILHOS DIRETOS do node "Floor" externo, o primeiro já é "Floor_0" (o
 * mesh da plataforma) — ou seja, a plataforma é filha DIRETA do node
 * externo "Floor", que eu nunca tocava (sempre `visible=true` por
 * omissão, igual o bug do Glass). E o suposto "chão geral do jardim"
 * já é papel do node "Ground" (separado) — "Floor" na real é só o piso
 * DESSA estrutura de descanso específica. Corrigido: o node "Floor"
 * inteiro agora entra em `restAreaFurniture` como 1 item (visibilidade
 * em cascata, igual "Pond"), não mais uma varredura de filhos com uma
 * exceção baseada numa suposição errada.
 *
 * ÁRVORE-ÂNCORA TROCADA (2026-08-20, rodada 11) — a árvore sempre
 * visível (tronco "Tree1"/"Tree1_0" + copa "Leaves1") aparecia com
 * aspecto "incompleto" — tronco bem ramificado com só UMA bolha de
 * folhagem redonda em cima. Causa: essa árvore nunca foi desenhada pra
 * ficar sozinha — ela é a raiz/âncora do node "Tree1" (o clump de
 * floresta, pai de TODO o pool: bushes, Tree2, Tree3, Icosphere), então
 * sua "densidade" real vem de ser cercada por dezenas de outros objetos,
 * não de folhagem própria farta. As árvores pequenas "Tree1.001-007" são
 * estruturalmente diferentes: cada uma tem seu próprio tronco + copa +
 * 3 blobs extras de "Icosphere" (ver children de "Tree1.001" logo
 * acima) — ficam "cheias" sozinhas.
 * Não dá simplesmente para ocultar o node "Tree1" pra sumir com essa
 * árvore-âncora, porque ele é o PAI de todo o pool — escondê-lo
 * esconderia tudo dentro em cascata. Mas o tronco dela é uma malha-FOLHA
 * própria ("Tree1_0", filha direta de "Tree1", sem filhos) — dá pra
 * ocultar só ela isoladamente sem afetar o resto. Corrigido: "Tree1_0" +
 * "Leaves1" (a folhagem dela, node irmão dentro do mesmo "Tree1") viram
 * permanentemente ocultos (mesmo grupo do Man/Lighthouse), e
 * "Tree1.001" (uma árvore pequena completa) vira a nova árvore-âncora
 * sempre visível — removida do pool pra não competir consigo mesma.
 */
"use client";

import * as THREE from "three";
import { PropertyBinding } from "three";

/** Mesma sanitização que GLTFLoader aplica a todo nome de node — ver nota acima. Usar isso em vez de comparar contra o nome "cru" do arquivo. */
function sanitize(name: string): string {
  return PropertyBinding.sanitizeNodeName(name);
}

export type GardenInventory = {
  /** Bushes (57) + Tree2/Tree3/Icosphere/Leaves2-3 (99, escopados a "Tree1") + árvores pequenas Tree1.002-007 (6, Tree1.001 virou a árvore-âncora sempre visível) = 162 itens, ordem estável (nome ordenado). */
  pool: THREE.Object3D[];
  milestones: {
    /** node "Pond" inteiro — arrasta peixe/vitória-régia/juncos/pedras junto. */
    pondBundle: THREE.Object3D[];
    /** dentro de "Gate": Wall1/wall/Pillar1/Wall2/Cylinder/Handle. */
    gazeboBase: THREE.Object3D[];
    /** dentro de "Gate": Glass×4. */
    gazeboGlass: THREE.Object3D[];
    /** dentro de "Gate": Board1×44 + Board2×56. */
    gazeboBoards: THREE.Object3D[];
    /** dentro de "Gate": o resto (Plane×508, Arc, porta, Lamp internos) — aproximação, ver nota acima. */
    gazeboRoof: THREE.Object3D[];
    /** "Wall1.027", solto no topo. */
    wall: THREE.Object3D[];
    /** "Road", solto no topo. */
    road: THREE.Object3D[];
    /** Lamp.004-006 + Glass.004-006 (cúpula de cada lamp) — primeiro lote solto no topo (distinto dos Lamp/Glass internos do Gate). */
    lampsFirst: THREE.Object3D[];
    /** Lamp.007-008 + Glass.007-008 — resto do lote. */
    lampsRest: THREE.Object3D[];
    /** node "Floor" inteiro — arrasta consigo a plataforma + mobília, igual "Pond" arrasta seus detalhes. Ver nota no topo do arquivo sobre por que NÃO é um sweep de filhos. */
    restAreaFurniture: THREE.Object3D[];
    /** os 14 objetos soltos no topo, sem relação com "Gate". */
    looseDeck: THREE.Object3D[];
  };
  /** Man + Lighthouse — sempre ocultos, nunca revelados. */
  excluded: THREE.Object3D[];
};

// "Tree1_0" (o mesh do tronco esparso da árvore-âncora) e "Leaves1" (sua
// copa) — ver nota no topo do arquivo. Mesmo tratamento de Man/Lighthouse:
// permanentemente ocultos, nunca fazem parte da composição revelada.
const EXCLUDED_TOP_LEVEL_NAMES = ["Man", "Lighthouse", "Tree1_0", "Leaves1"];

/** Árvore pequena completa (tronco+copa+3 blobs extras) que substitui a "Tree1" grande esparsa como árvore sempre visível — removida do pool pra não se revelar de novo consigo mesma. */
const STARTER_TREE_NAME = sanitize("Tree1.001");

// nomes "crus" como aparecem no arquivo (com ponto) — sanitizados abaixo
// antes de usar, porque em runtime o ponto some (ver nota no topo).
const LOOSE_DECK_NAMES_RAW = [
  "Plane.471", "Plane.472", "Plane.473", "Plane.474", "Plane.475", "Plane.476",
  "Plane.477", "Plane.478", "Plane.479", "Plane.480", "Plane.481", "Plane.482",
  "Board1.030", "Board2.042", "Cube.316", "Cylinder", "Cylinder.019", "Cylinder.025",
];
const LOOSE_DECK_NAMES = LOOSE_DECK_NAMES_RAW.map(sanitize);

const LAMP_FIRST_NAMES = ["Lamp.004", "Lamp.005", "Lamp.006", "Glass.004", "Glass.005", "Glass.006"].map(sanitize);
const LAMP_REST_NAMES = ["Lamp.007", "Lamp.008", "Glass.007", "Glass.008"].map(sanitize);

// regexes SEM ponto literal — o sufixo numérico gruda direto no nome em
// runtime ("Bush3021", não "Bush3.021"). `\d*` cobre tanto o nome puro
// (0 dígitos) quanto qualquer sufixo numérico.
const BUSH_NAME = /^Bush[1-4]\d*$/;
const SMALL_TREE_NAME = /^Tree1\d+$/;
/** Tree2/Tree3/Icosphere/Leaves2/Leaves3 — só usado escopado ao subtree de "Tree1", ver nota no topo do arquivo. */
const FOREST_EXTRA_NAME = /^(Tree2|Tree3|Icosphere|Leaves2|Leaves3)\d*$/;
const GAZEBO_BASE_NAME = /^(Wall1|wall|Pillar1|Wall2|Cylinder|Handle)\d*$/;
const GAZEBO_GLASS_NAME = /^Glass\d*$/;
const GAZEBO_BOARDS_NAME = /^(Board1|Board2)\d*$/;

/**
 * Cada instância real vira DOIS nodes no glTF (o "grupo" com o nome
 * limpo, ex. "Bush1.011", e um filho "_0" que carrega o mesh — ver
 * `GLTFLoader.loadMesh`). A gente quer categorizar/ocultar o grupo, não
 * o filho — ocultar o pai já esconde o mesh filho em cascata.
 */
function isNamedGroup(obj: THREE.Object3D): boolean {
  return obj.name.length > 0 && !/_\d+$/.test(obj.name);
}

function byNames(byName: Map<string, THREE.Object3D>, names: string[]): THREE.Object3D[] {
  return names.map((n) => byName.get(n)).filter((o): o is THREE.Object3D => !!o);
}

export function buildGardenInventory(scene: THREE.Object3D): GardenInventory {
  const byName = new Map<string, THREE.Object3D>();
  scene.traverse((obj) => {
    if (obj.name) byName.set(obj.name, obj);
  });

  // pool: árvores pequenas (Tree1.NNN, só existem soltas no topo — seguro
  // casar globalmente) + bushes/Tree2/Tree3/Icosphere/Leaves2-3, esses
  // últimos escopados ao subtree do "Tree1" grande (ver nota no topo do
  // arquivo — casar globalmente contaria de novo os Icosphere que também
  // vivem aninhados dentro de cada Tree1.001-007). Ordem determinística
  // (nome ordenado) — mesmo nível de progresso sempre revela os mesmos
  // itens, mesmo depois de recarregar a página.
  const poolNames: string[] = [];
  scene.traverse((obj) => {
    if (isNamedGroup(obj) && SMALL_TREE_NAME.test(obj.name) && obj.name !== STARTER_TREE_NAME) {
      poolNames.push(obj.name);
    }
  });
  const bigTree1 = byName.get(sanitize("Tree1"));
  if (bigTree1) {
    bigTree1.traverse((obj) => {
      if (obj === bigTree1 || !isNamedGroup(obj)) return;
      if (BUSH_NAME.test(obj.name) || FOREST_EXTRA_NAME.test(obj.name)) poolNames.push(obj.name);
    });
  }
  poolNames.sort();
  const pool = byNames(byName, poolNames);

  // gazebo: sub-categoriza SÓ dentro da subtree de "Gate" — "Glass"/
  // "Lamp" também existem soltos no topo (Glass.004-008/Lamp.004-008)
  // com faixas de sufixo diferentes, então escopar por subtree evita
  // misturar os dois conjuntos.
  const gate = byName.get(sanitize("Gate"));
  const gazeboBase: THREE.Object3D[] = [];
  const gazeboGlass: THREE.Object3D[] = [];
  const gazeboBoards: THREE.Object3D[] = [];
  const gazeboRoof: THREE.Object3D[] = [];
  if (gate) {
    gate.traverse((obj) => {
      if (obj === gate || !isNamedGroup(obj)) return;
      if (GAZEBO_BASE_NAME.test(obj.name)) gazeboBase.push(obj);
      else if (GAZEBO_GLASS_NAME.test(obj.name)) gazeboGlass.push(obj);
      else if (GAZEBO_BOARDS_NAME.test(obj.name)) gazeboBoards.push(obj);
      else gazeboRoof.push(obj);
    });
  }

  // "Floor": node inteiro vira 1 item revelável (visibilidade em
  // cascata) — ver nota no topo do arquivo sobre por que a plataforma
  // (mesh "Floor_0") é filha DIRETA do node externo, não de algum
  // sub-node "Floor" interno que pudesse ser tratado à parte.
  const floor = byName.get(sanitize("Floor"));

  const pondNode = byName.get(sanitize("Pond"));

  return {
    pool,
    milestones: {
      pondBundle: pondNode ? [pondNode] : [],
      gazeboBase,
      gazeboGlass,
      gazeboBoards,
      gazeboRoof,
      wall: byNames(byName, [sanitize("Wall1.027")]),
      road: byNames(byName, [sanitize("Road")]),
      lampsFirst: byNames(byName, LAMP_FIRST_NAMES),
      lampsRest: byNames(byName, LAMP_REST_NAMES),
      restAreaFurniture: floor ? [floor] : [],
      looseDeck: byNames(byName, LOOSE_DECK_NAMES),
    },
    excluded: byNames(byName, EXCLUDED_TOP_LEVEL_NAMES.map(sanitize)),
  };
}
