/**
 * journeyMilestones — mapeia progresso (0-21 dias) em cada uma das 4
 * jornadas pra um conjunto de objetos revelados no jardim, usando as
 * categorias de `garden-inventory.ts`.
 *
 * POOL (163 itens no total — ver garden-inventory.ts, rodada 7 moveu
 * Tree2/Tree3/Icosphere/Leaves2-3 do "esqueleto sempre visível" pra cá):
 * dividido em 4 fatias contíguas por índice (`start`/`end` distribuídos
 * uniformemente, não `Math.floor(total/4)` fixo — 163 não é múltiplo de
 * 4, e a divisão por índice garante que TODO item do pool cai em alguma
 * fatia, sem sobrar nenhum de fora). Cada jornada tem 18 "dias de pool"
 * (dias 1-6, 8-13, 15-20 — os dias 7/14/21 são marco, não pool).
 * `poolItemsRevealedCount` é PROPORCIONAL ao tamanho da fatia (não "+1
 * item fixo por dia") — assim o dia 20 sempre revela a fatia inteira,
 * qualquer que seja o tamanho do pool, sem precisar recalcular a mão
 * toda vez que o pool mudar de novo no futuro.
 *
 * MARCOS (dia 7/14/21 por jornada) — tabela revisada depois de descobrir
 * que "Gate" é o pavilhão/gazebo (não um portão simples) e que "Floor"
 * embute uma área de descanso além do piso genérico (ver nota completa
 * em garden-inventory.ts e a conversa que motivou essas decisões):
 *
 *   Sono:            7=Pond          14=área de descanso   21=gazebo-telhado
 *   Ansiedade:       7=gazebo-base   14=gazebo-vidraças    21=Wall1.027
 *   Produtividade:   7=deck solto    14=Road               21=gazebo-bancos
 *   Compulsividade:  7=Lamps (1º)    14=Lamps (resto)      21=celebração
 */
import * as THREE from "three";
import type { GardenInventory } from "./garden-inventory";

export type JourneyId = "sono" | "ansiedade" | "produtividade" | "compulsividade";

export type JourneyProgress = Record<JourneyId, number>;

export const JOURNEY_IDS: JourneyId[] = ["sono", "ansiedade", "produtividade", "compulsividade"];

/** Dias que consomem 1 item do pool — 18 no total, dias 7/14/21 ficam de fora (são marco). */
const POOL_DAYS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20];

type MilestoneKey = keyof GardenInventory["milestones"] | "celebration";

const MILESTONE_SCHEDULE: Record<JourneyId, Record<7 | 14 | 21, MilestoneKey>> = {
  sono: { 7: "pondBundle", 14: "restAreaFurniture", 21: "gazeboRoof" },
  ansiedade: { 7: "gazeboBase", 14: "gazeboGlass", 21: "wall" },
  produtividade: { 7: "looseDeck", 14: "road", 21: "gazeboBoards" },
  compulsividade: { 7: "lampsFirst", 14: "lampsRest", 21: "celebration" },
};

function clampDay(day: number): number {
  return Math.max(0, Math.min(21, Math.floor(day)));
}

/**
 * Quantos itens da fatia já deveriam estar revelados, cumulativamente,
 * pra um progresso 0-21 — proporcional ao tamanho da fatia (não um
 * incremento fixo de "+1 por dia"), então o dia 20 (último "dia de
 * pool") sempre revela a fatia inteira, não importa quantos itens ela
 * tenha.
 */
function poolItemsRevealedCount(dayProgress: number, sliceSize: number): number {
  const day = clampDay(dayProgress);
  const poolDaysReached = POOL_DAYS.filter((d) => d <= day).length;
  return Math.round((poolDaysReached / POOL_DAYS.length) * sliceSize);
}

/** Fatia não-sobreposta e contígua do pool pra cada jornada — distribuição uniforme por índice, cobre o pool inteiro mesmo quando não divide exato por 4. */
function poolSliceFor(journey: JourneyId, pool: THREE.Object3D[]): THREE.Object3D[] {
  const n = JOURNEY_IDS.length;
  const index = JOURNEY_IDS.indexOf(journey);
  const start = Math.floor((index * pool.length) / n);
  const end = Math.floor(((index + 1) * pool.length) / n);
  return pool.slice(start, end);
}

export type RevealResult = {
  visible: Set<THREE.Object3D>;
  /** true quando alguma jornada bateu 21/21 — GardenProgressive usa isso pra aplicar o glow de celebração. */
  celebrating: boolean;
};

/**
 * Calcula o conjunto de objetos que devem estar visíveis dado o
 * progresso atual nas 4 jornadas. `inventory.excluded` (Man/Lighthouse)
 * nunca entra aqui — GardenProgressive trata isso à parte, sempre oculto.
 */
export function computeRevealedSet(inventory: GardenInventory, progress: JourneyProgress): RevealResult {
  const visible = new Set<THREE.Object3D>();
  let celebrating = false;

  for (const journey of JOURNEY_IDS) {
    const day = clampDay(progress[journey] ?? 0);

    const slice = poolSliceFor(journey, inventory.pool);
    const revealedCount = poolItemsRevealedCount(day, slice.length);
    slice.slice(0, revealedCount).forEach((obj) => visible.add(obj));

    const schedule = MILESTONE_SCHEDULE[journey];
    ([7, 14, 21] as const).forEach((milestoneDay) => {
      if (day < milestoneDay) return;
      const key = schedule[milestoneDay];
      if (key === "celebration") {
        celebrating = true;
        return;
      }
      inventory.milestones[key].forEach((obj) => visible.add(obj));
    });
  }

  return { visible, celebrating };
}
