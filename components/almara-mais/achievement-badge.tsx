type BadgeColor = "verde" | "sono" | "ansiedade" | "produtividade";

const COLOR_CLASSES: Record<BadgeColor, { ring: string; fill: string }> = {
  verde: { ring: "border-folha-viva-escura", fill: "bg-folha-viva" },
  sono: { ring: "border-jornada-sono-escura", fill: "bg-jornada-sono" },
  ansiedade: { ring: "border-jornada-ansiedade-escura", fill: "bg-jornada-ansiedade" },
  produtividade: { ring: "border-jornada-produtividade-escura", fill: "bg-jornada-produtividade" },
};

export function AchievementBadge({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: BadgeColor;
}) {
  const c = COLOR_CLASSES[color];
  return (
    <div className="flex w-[104px] flex-col items-center gap-2 text-center">
      <div
        className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border-b-[6px] ${c.ring} ${c.fill} font-display-mais text-2xl font-bold text-white shadow-sm`}
      >
        {value}
      </div>
      <p className="font-body-mais text-xs font-bold leading-tight text-tinta-mais/80">{label}</p>
    </div>
  );
}
