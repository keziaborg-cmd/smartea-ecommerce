/**
 * GardenDemoScene — versão "vitrine" da cena progressiva do jardim
 * (garden.glb), pra usar dentro de um card de marketing. Reaproveita
 * `GardenProgressive` sem nenhuma alteração — ele já é "puro" (só recebe
 * `progress`, não tem nenhum acoplamento com a UI de debug da página de
 * teste, que vive inteira em app/garden-progress-test/page.tsx).
 *
 * Não puxa progresso real de usuário nem do Supabase — anima um ciclo
 * fixo de 84 dias (4 jornadas × 21 dias) em loop contínuo, só pra
 * demonstrar visualmente "o jardim cresce a cada dia de ritual".
 *
 * CICLO DE DIAS: em vez de usar React state a cada frame (o que
 * recomputaria `buildGardenInventory`/`computeRevealedSet` — ambos
 * fazem `scene.traverse()` sobre ~2690 nodes — a 60fps, caríssimo à
 * toa), o relógio do ciclo vive em refs e só dispara `setProgress`
 * quando o DIA INTEIRO muda (a cada ~220ms) ou numa transição de fase.
 * A reconciliação de visibilidade de GardenProgressive é granular por
 * dia mesmo, não por fração de segundo — não faz sentido recomputar
 * mais rápido que isso.
 *
 * RESET SUAVE (dia 84 → dia 0): GardenProgressive não tem animação de
 * SAÍDA (só entrada, ver seu próprio arquivo) — se eu só zerasse o
 * `progress`, ~907 objetos revelados sumiriam instantaneamente, um corte
 * feio. Em vez de mexer no componente compartilhado (usado também pela
 * página de progresso real), a cena inteira encolhe (`scale` do grupo
 * externo, 1→~0) antes de resetar o dia, e cresce de novo (~0→1) depois
 * — um "a horta se replanta" que disfarça a descontinuidade sem tocar
 * na lógica de revelação em si.
 */
"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GardenProgressive } from "./GardenProgressive";
import type { JourneyProgress } from "./journeyMilestones";

const TOTAL_DAYS = 84;
const DAY_SECONDS = 0.22; // 84 dias × 0.22s ≈ 18.5s de crescimento
const HOLD_SECONDS = 2.5; // jardim completo parado antes de resetar
const COLLAPSE_SECONDS = 0.5;
const EXPAND_SECONDS = 0.5;
// ciclo total ≈ 18.5 + 2.5 + 0.5 + 0.5 = 22s — dentro da janela de 15-25s pedida.

const ZERO_PROGRESS: JourneyProgress = { sono: 0, ansiedade: 0, produtividade: 0, compulsividade: 0 };

/** Dia 1-84 → progresso das 4 jornadas, sequencial: sono(1-21) → ansiedade(22-42) → produtividade(43-63) → compulsividade(64-84). */
function progressForDay(day: number): JourneyProgress {
  const clamp = (v: number) => Math.max(0, Math.min(21, v));
  return {
    sono: clamp(day),
    ansiedade: clamp(day - 21),
    produtividade: clamp(day - 42),
    compulsividade: clamp(day - 63),
  };
}

type Phase = "growing" | "holding" | "collapsing" | "expanding";

function DemoLoopDriver({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState<JourneyProgress>(ZERO_PROGRESS);

  const phase = useRef<Phase>("growing");
  const phaseClock = useRef(0); // segundos decorridos NA fase atual — só avança quando `active`
  const currentDay = useRef(0);

  useFrame((_state, delta) => {
    if (!active) return; // pausado fora do viewport — não avança o relógio, não "pula" ao voltar
    phaseClock.current += delta;

    if (phase.current === "growing") {
      const day = Math.min(Math.floor(phaseClock.current / DAY_SECONDS) + 1, TOTAL_DAYS);
      if (day !== currentDay.current) {
        currentDay.current = day;
        setProgress(progressForDay(day));
      }
      if (phaseClock.current >= TOTAL_DAYS * DAY_SECONDS) {
        phase.current = "holding";
        phaseClock.current = 0;
      }
      return;
    }

    if (phase.current === "holding") {
      if (phaseClock.current >= HOLD_SECONDS) {
        phase.current = "collapsing";
        phaseClock.current = 0;
      }
      return;
    }

    if (phase.current === "collapsing") {
      const t = Math.min(phaseClock.current / COLLAPSE_SECONDS, 1);
      groupRef.current?.scale.setScalar(Math.max(1 - t, 0.001));
      if (t >= 1) {
        currentDay.current = 0;
        setProgress(ZERO_PROGRESS);
        phase.current = "expanding";
        phaseClock.current = 0;
      }
      return;
    }

    // "expanding"
    const t = Math.min(phaseClock.current / EXPAND_SECONDS, 1);
    const eased = 1 - (1 - t) ** 3;
    groupRef.current?.scale.setScalar(Math.max(eased, 0.001));
    if (t >= 1) {
      groupRef.current?.scale.setScalar(1);
      phase.current = "growing";
      phaseClock.current = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <GardenProgressive progress={progress} />
      </Suspense>
    </group>
  );
}

type GardenDemoSceneProps = {
  active: boolean;
};

export default function GardenDemoScene({ active }: GardenDemoSceneProps) {
  // mesma composição de luz de app/garden-progress-test/page.tsx — os
  // materiais do garden.glb são MeshStandardMaterial (PBR de verdade),
  // não o toon material do pack de natureza, então respondem de forma
  // muito mais literal à intensidade da luz. Ver comentário lá pro
  // raciocínio completo.
  const dpr = useMemo<[number, number]>(() => [1, 1.5], []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [31, 22, 22], fov: 45 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        // sem isso, o R3F usa o exposure padrão (1.0) — a página de teste
        // (garden-progress-test) tinha um slider justamente pra achar um
        // valor mais claro (1.25 como ponto de partida); aqui, sem
        // controle ao vivo, subo esse valor direto já mais claro.
        gl.toneMappingExposure = 1.5;
      }}
    >
      <hemisphereLight args={["#bfe3f5", "#3a2f1f", 1.1]} />
      <directionalLight position={[30, 50, 20]} intensity={3.2} />
      {/* sem interação (não é o painel de teste) — só uma rotação bem sutil
          e automática, pra cena não ficar estática dentro do card. */}
      <OrbitControls
        target={[7, 0, -2]}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <DemoLoopDriver active={active} />
    </Canvas>
  );
}
