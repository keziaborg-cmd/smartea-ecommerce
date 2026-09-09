/**
 * garden-material-fixes — corrige dois problemas de cor confirmados nos
 * DADOS de origem de `garden.glb` (não é bug de renderização nem material
 * genérico "lavando" nada — inspecionei o JSON do glTF direto, sem
 * precisar renderizar, e o problema está nos próprios `baseColorFactor`
 * atribuídos pelo artista/export do Sketchfab):
 *
 * 1. O material "Wall" (marrom-bege, [0.263, 0.201, 0.074]) é
 *    COMPARTILHADO por 710 dos 1343 meshes do arquivo inteiro — quase
 *    todo o node "Gate" (paredes, pilares, arco, porta E a maioria dos
 *    508 "Plane" que formam o telhado) usa o mesmíssimo objeto de
 *    material. Por isso o pavilhão inteiro lê como um bloco bege
 *    uniforme: não é textura faltando, é a mesma cor aplicada em tudo.
 *    `retintByMaterialName` clona o material antes de tingir (crítico —
 *    sem clonar, mudar a cor de um grupo mudaria a cor de TODOS os 710
 *    usos, já que por padrão eles compartilham a mesma instância de
 *    THREE.Material) e aplica tons DIFERENTES por bucket (base/telhado/
 *    bancos, já separados em garden-inventory.ts), só nos meshes cujo
 *    material de origem é literalmente "Wall" — Lamp/Rope/Glass que
 *    caem dentro desses buckets por posição na hierarquia mantêm sua cor
 *    original, intocados.
 * 2. Bush3 (22 instâncias) e Bush4 (19) usam materiais cinza chapado
 *    ([0.39,0.39,0.39] e [0.367,0.367,0.367] — R=G=B, zero matiz), claramente
 *    um placeholder nunca finalizado no Blender. Bush1+Bush2 (16
 *    instâncias) já usam um verde correto (material "Bush1",
 *    [0.038, 0.143, 0.003]) — comparação direta confirma que Bush3/Bush4
 *    são o problema, não o resto do pool.
 *
 * NÃO MEXIDO (cor já está correta nos dados, apesar de parecer estranho
 * à primeira vista):
 * - Pond: só 1 dos 273 meshes usa o material azul "Water.001" — os
 *   outros 272 são Reeds (120, verde escuro) e Rock1/2/3 (134,
 *   cinza-acastanhado) + Fish/Water_lily. A lagoa É majoritariamente
 *   junco/pedra na borda, com um pedaço pequeno de água central — não é
 *   um bug, é a composição real do asset. Se isso não bater com a
 *   intenção visual, é uma decisão de design (aumentar a água/reduzir
 *   junco), não um bug de cor.
 * - Road usa "Rock2.001" (cinza-oliva), coerente com pedras de
 *   pavimentação — sem problema.
 */
import * as THREE from "three";
import type { GardenInventory } from "./garden-inventory";

type MeshMaterial = THREE.Material & { name: string; color?: THREE.Color };

/**
 * Clona o material de cada mesh (uma vez) e tinge só os que batem com
 * `matchMaterialNames` — deixa qualquer outro material presente no mesmo
 * grupo (Lamp, Rope, Glass) intocado.
 */
function retintByMaterialName(objects: THREE.Object3D[], matchMaterialNames: Set<string>, hex: string): void {
  const color = new THREE.Color(hex);
  objects.forEach((obj) => {
    obj.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const next = materials.map((m) => {
        const mat = m as MeshMaterial;
        if (!matchMaterialNames.has(mat.name)) return m;
        const cloned = mat.clone() as MeshMaterial;
        cloned.color?.set(color);
        return cloned;
      });
      child.material = Array.isArray(child.material) ? next : next[0];
    });
  });
}

const WALL_MATERIAL = new Set(["Wall"]);
const GRAY_BUSH_MATERIALS = new Set(["Bush3", "Bush4"]);

export function fixGardenMaterials(inventory: GardenInventory): void {
  // gazebo: mesmo material "Wall" compartilhado por base/telhado/bancos —
  // tons diferentes por bucket pra parar de ler como um bloco bege só.
  retintByMaterialName(inventory.milestones.gazeboBase, WALL_MATERIAL, "#8b6b4a"); // madeira, tom original
  retintByMaterialName(inventory.milestones.gazeboRoof, WALL_MATERIAL, "#5c4a3a"); // telhado, mais escuro
  retintByMaterialName(inventory.milestones.gazeboBoards, WALL_MATERIAL, "#a9835a"); // bancos, madeira mais clara

  // bushes cinza (placeholder sem cor) → verde, pareado com o tom que
  // Bush1/Bush2 já usam corretamente.
  retintByMaterialName(inventory.pool, GRAY_BUSH_MATERIALS, "#4f7c3f");
}
