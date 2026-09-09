/**
 * GardenProgressive — carrega a cena completa `garden.glb` (jardim único,
 * modelado por outro artista, materiais próprios — NÃO passa pelo
 * sistema toon de Garden.tsx/toonMaterial.ts, que é só pro pack de
 * natureza) e controla visibilidade por objeto conforme o progresso do
 * usuário nas 4 jornadas (ver journeyMilestones.ts).
 *
 * MUTAÇÃO DO CACHE COMPARTILHADO (decisão deliberada, ao contrário do
 * padrão usado em useGardenAsset.ts): aqui a gente NÃO clona a cena
 * antes de mexer em `.visible`. `garden.glb` é um asset único de 8.4MB
 * representando O jardim inteiro — diferente do pack de natureza (várias
 * instâncias do MESMO arquivo espalhadas pelo jardim, onde clonar é
 * obrigatório pra não fazer uma pedra virar árvore). Clonar 2690 nodes a
 * cada mudança de progresso seria caro à toa. Isso assume UMA instância
 * de <GardenProgressive> montada por vez — se um dia precisar mostrar
 * vários jardins simultâneos (ex: painel admin comparando usuários), essa
 * suposição quebra e passa a precisar de clone por instância.
 *
 * ANIMAÇÕES (2026-08-20, rodada 7): a versão anterior fazia a
 * "celebração" do dia 21 via um pulso de escala em LOOP CONTÍNUO
 * (senoidal, sem parar enquanto `celebrating` fosse true) — incômodo
 * visualmente, e sem nenhuma animação de entrada pros reveals normais
 * (apareciam instantâneos). Reescrito como dois efeitos de UM DISPARO
 * SÓ:
 * - Entrada: quando um objeto revelável passa de oculto pra visível,
 *   a escala anima de 0 até o tamanho autoral (ease-out cúbico, ~0.7s) e
 *   para — não guarda estado de "está animando" além da janela de
 *   entrada, então não hà loop.
 * - Celebração: em vez de pulso de escala contínuo, virou um flash de
 *   emissive com envelope (sobe e desce em meio-seno, ~1.8s) disparado
 *   uma única vez na transição false→true de `celebrating` — pico de
 *   intensidade deliberadamente baixo (0.22) pra não repetir o bug de
 *   "lavado bege" de duas rodadas atrás (emissive soma na equação de
 *   shading do MeshStandardMaterial; um pico alto dominaria a cor de
 *   base mesmo sendo temporário).
 *
 * ENTRADA "BROTANDO DO CHÃO" (2026-08-20, rodada 12): só escalar de 0→1
 * no lugar lia como "objeto materializa do nada e infla feito balão" —
 * cresce igual em todas as direções (largura junto com altura) a partir
 * de um ponto fixo no espaço. Pra ler como "brota da terra", a animação
 * agora TAMBÉM desloca a posição Y: começa `GROUND_SINK_DEPTH` abaixo da
 * posição de repouso (como se estivesse enterrado) e sobe até a posição
 * autoral exata conforme cresce — a combinação de escala+ascensão dá a
 * leitura de algo empurrando pra fora da terra, não aparecendo do nada.
 * Profundidade fixa (não por bounding box de cada objeto) de propósito —
 * calcular a caixa delimitadora de cada objeto revelado só pra isso
 * seria caro à toa; um valor único já lê bem pra bush/árvore pequena e
 * pros marcos maiores (gazebo, gramado de descanso etc), que de qualquer
 * jeito também têm sua própria base perto do nível do chão.
 */
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { buildGardenInventory } from "./garden-inventory";
import { fixGardenMaterials } from "./garden-material-fixes";
import { computeRevealedSet } from "./journeyMilestones";
import type { JourneyProgress } from "./journeyMilestones";

const GARDEN_GLB_PATH = "/models/garden-scene/garden.glb";

type GardenProgressiveProps = {
  progress: JourneyProgress;
  /** Debug: reporta a lista de objetos NOMEADOS efetivamente visíveis (considerando ancestrais) toda vez que a visibilidade é recalculada. Temporário, ver pedido de depuração. */
  onDebugVisible?: (names: string[]) => void;
};

/** Visível "de verdade" (renderiza) exige que o objeto E todos os ancestrais até a raiz estejam com .visible=true — checar só o próprio objeto pode mentir se algum ancestral estiver oculto. */
function isEffectivelyVisible(obj: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = obj;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

const ENTRANCE_DURATION = 0.7; // segundos, ease-out cúbico, um disparo só
const GROUND_SINK_DEPTH = 0.35; // unidades de mundo — "enterrado" no início da entrada, ver nota no topo do arquivo
const CELEBRATION_DURATION = 1.8; // segundos, envelope meio-seno, um disparo só
const CELEBRATION_PEAK_INTENSITY = 0.22; // pico moderado — ver nota no topo do arquivo

type EntranceAnim = { start: number; base: THREE.Vector3; restingY: number };
type MaterialWithEmissive = THREE.Material & { emissive?: THREE.Color; emissiveIntensity?: number };

export function GardenProgressive({ progress, onDebugVisible }: GardenProgressiveProps) {
  const { scene } = useGLTF(GARDEN_GLB_PATH);
  const inventory = useMemo(() => buildGardenInventory(scene), [scene]);

  const revealed = useMemo(() => computeRevealedSet(inventory, progress), [inventory, progress]);

  const previousVisible = useRef<Set<THREE.Object3D>>(new Set());
  const entranceAnimations = useRef(new Map<THREE.Object3D, EntranceAnim>());
  const wasCelebrating = useRef(false);
  const celebrationStart = useRef<number | null>(null);
  const celebrationSnapshot = useRef(new Map<MaterialWithEmissive, { emissive: THREE.Color; intensity: number }>());

  // correção de cor dos dados de origem (ver garden-material-fixes.ts) —
  // independente do progresso, roda uma vez por carregamento da cena.
  useEffect(() => {
    fixGardenMaterials(inventory);
  }, [inventory]);

  useEffect(() => {
    // Man/Lighthouse: resquícios do artista original, nunca fazem parte
    // da composição — ocultos incondicionalmente, não entram no cálculo
    // de progresso.
    inventory.excluded.forEach((obj) => {
      obj.visible = false;
    });

    const revealable = [...inventory.pool, ...Object.values(inventory.milestones).flat()];
    const now = performance.now() / 1000;
    revealable.forEach((obj) => {
      const shouldBeVisible = revealed.visible.has(obj);
      if (shouldBeVisible && !previousVisible.current.has(obj)) {
        // acabou de ser revelado — arma a animação de entrada (o useFrame
        // abaixo assume a partir daqui); começa quase-zero e "enterrado"
        // pra não haver um frame com o tamanho/posição final antes da
        // animação pegar.
        if (!entranceAnimations.current.has(obj)) {
          entranceAnimations.current.set(obj, { start: now, base: obj.scale.clone(), restingY: obj.position.y });
        }
        obj.scale.setScalar(0.001);
        obj.position.y = entranceAnimations.current.get(obj)!.restingY - GROUND_SINK_DEPTH;
      }
      obj.visible = shouldBeVisible;
    });

    previousVisible.current = revealed.visible;

    // DEBUG — lista todo objeto NOMEADO efetivamente visível (própria
    // flag + de todo ancestral). Custa uma varredura inteira da cena
    // (~2690 nodes) a cada recompute, então só roda quando alguém
    // realmente pediu (a página de teste passa `onDebugVisible`) ou em
    // dev — GardenDemoLoop (card de marketing, produção) não passa esse
    // callback, então isso vira um no-op lá, sem custo nem log de sobra
    // rodando até 84x por ciclo de animação.
    if (onDebugVisible || process.env.NODE_ENV !== "production") {
      const visibleNames: string[] = [];
      scene.traverse((obj) => {
        if (obj.name && !/_\d+$/.test(obj.name) && isEffectivelyVisible(obj)) {
          visibleNames.push(obj.name);
        }
      });
      if (process.env.NODE_ENV !== "production") {
        console.log(`[GardenProgressive] ${visibleNames.length} objetos nomeados efetivamente visíveis:`, visibleNames);
      }
      onDebugVisible?.(visibleNames);
    }
  }, [inventory, revealed, scene, onDebugVisible]);

  useFrame(() => {
    // MESMO relógio usado pra capturar `anim.start` no useEffect acima
    // (performance.now()) — `state.clock.elapsedTime` é outro relógio
    // (conta a partir de quando o Clock do R3F começou, não da navegação
    // da página), com um offset diferente. Misturar os dois fazia `t`
    // começar negativo/errado por alguns frames — dava um "pop" de
    // escala/posição errada antes de corrigir sozinho quando os dois
    // relógios finalmente convergiam. Ver bug relatado na conversa.
    const now = performance.now() / 1000;

    if (entranceAnimations.current.size > 0) {
      entranceAnimations.current.forEach((anim, obj) => {
        const t = Math.min((now - anim.start) / ENTRANCE_DURATION, 1);
        const eased = 1 - (1 - t) ** 3;
        obj.scale.set(anim.base.x * eased, anim.base.y * eased, anim.base.z * eased);
        obj.position.y = anim.restingY - GROUND_SINK_DEPTH * (1 - eased);
        if (t >= 1) entranceAnimations.current.delete(obj);
      });
    }

    if (revealed.celebrating && !wasCelebrating.current) {
      // borda de subida (não estava celebrando, agora está) — dispara o
      // flash uma vez só. Snapshot deduplicado por MATERIAL (não por
      // mesh) porque vários meshes compartilham o mesmo material — sem
      // isso, o segundo mesh a visitar o mesmo material capturaria o
      // valor JÁ tingido do primeiro como se fosse o "original".
      celebrationStart.current = now;
      celebrationSnapshot.current.clear();
      revealed.visible.forEach((obj) => {
        obj.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const material = child.material as MaterialWithEmissive;
          if (!material?.emissive || celebrationSnapshot.current.has(material)) return;
          celebrationSnapshot.current.set(material, {
            emissive: material.emissive.clone(),
            intensity: material.emissiveIntensity ?? 1,
          });
        });
      });
    }
    wasCelebrating.current = revealed.celebrating;

    if (celebrationStart.current !== null) {
      const t = (now - celebrationStart.current) / CELEBRATION_DURATION;
      if (t >= 1) {
        celebrationSnapshot.current.forEach((original, material) => {
          material.emissive?.copy(original.emissive);
          if (material.emissiveIntensity !== undefined) material.emissiveIntensity = original.intensity;
        });
        celebrationSnapshot.current.clear();
        celebrationStart.current = null;
      } else {
        const envelope = Math.sin(t * Math.PI) * CELEBRATION_PEAK_INTENSITY; // sobe e desce uma vez, nunca repete
        celebrationSnapshot.current.forEach((_original, material) => {
          material.emissive?.set("#ffe28a");
          if (material.emissiveIntensity !== undefined) material.emissiveIntensity = envelope;
        });
      }
    }
  });

  return <primitive object={scene} />;
}

GardenProgressive.preload = () => useGLTF.preload(GARDEN_GLB_PATH);
