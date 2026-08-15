export function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-verde-escuro text-[15px] font-extrabold text-creme">
      {n}
    </span>
  );
}
