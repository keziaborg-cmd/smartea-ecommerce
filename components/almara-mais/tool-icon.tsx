import type { ToolIcon } from "@/data/almara-mais-content";

const shared = {
  fill: "none",
  stroke: "#fff",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// transformBox:"fill-box" + transformOrigin:"center" faz rotate/scale
// girarem em torno do próprio desenho (não do viewport do SVG inteiro) —
// evita ter que calcular manualmente o pivô em coordenadas do viewBox.
const pivotCenter = { transformBox: "fill-box" as const, transformOrigin: "center" };

function Pomodoro() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <circle cx="12" cy="13" r="8" />
      <path
        d="M12 8v5l3.5 2"
        className="group-hover:animate-tool-hand-sweep group-focus-visible:animate-tool-hand-sweep"
        style={pivotCenter}
      />
      <path d="M9.5 2.5 12 5l2.5-2.5" />
    </svg>
  );
}

function Respiracao() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <circle
        cx="12"
        cy="12"
        r="3"
        className="group-hover:animate-tool-pulse group-focus-visible:animate-tool-pulse"
        style={pivotCenter}
      />
      <path d="M12 3a9 9 0 0 1 9 9" opacity="0.9" />
      <path d="M12 21a9 9 0 0 1-9-9" opacity="0.9" />
      <path d="M4.5 6.5a9 9 0 0 1 6-3.3" opacity="0.55" />
      <path d="M19.5 17.5a9 9 0 0 1-6 3.3" opacity="0.55" />
    </svg>
  );
}

function WimHof() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <g className="group-hover:animate-tool-shiver group-focus-visible:animate-tool-shiver" style={pivotCenter}>
        <path d="M12 2v20M3.5 6.5l17 11M20.5 6.5l-17 11" />
        <path d="M12 6 9.8 4.2M12 6l2.2-1.8M12 18l-2.2 1.8M12 18l2.2 1.8" />
      </g>
    </svg>
  );
}

function Tarefas() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <path
        d="m5.5 7 1 1 2-2"
        stroke="#477023"
        strokeWidth="2"
        strokeDasharray="8"
        className="group-hover:animate-tool-check-draw group-focus-visible:animate-tool-check-draw"
      />
      <path d="M13 6h7M13 12h7M4 13.5h6M4 19h6M13 18h7" />
    </svg>
  );
}

function Habitos() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <g className="group-hover:animate-tool-spin group-focus-visible:animate-tool-spin" style={pivotCenter}>
        <path d="M4 12a8 8 0 0 1 14-5.3" />
        <path d="M20 12a8 8 0 0 1-14 5.3" />
        <path d="M18 3v4h-4" />
        <path d="M6 21v-4h4" />
      </g>
    </svg>
  );
}

function Diario() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...shared}>
      <g
        className="group-hover:animate-tool-flip group-focus-visible:animate-tool-flip"
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      >
        <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H17a1.5 1.5 0 0 1 1.5 1.5V21l-3-2-3 2-3-2-3 2z" />
        <path d="M9 8h6M9 11.5h6" />
      </g>
    </svg>
  );
}

const ICONS: Record<ToolIcon, () => React.JSX.Element> = {
  pomodoro: Pomodoro,
  respiracao: Respiracao,
  wimhof: WimHof,
  tarefas: Tarefas,
  habitos: Habitos,
  diario: Diario,
};

export function ToolIconGraphic({ icon }: { icon: ToolIcon }) {
  const Icon = ICONS[icon];
  return <Icon />;
}
