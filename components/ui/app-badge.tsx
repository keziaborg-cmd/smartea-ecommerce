export function AppBadge({ size = 76 }: { size?: 76 | 70 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center bg-creme font-extrabold tracking-[.05em] text-verde-escuro"
      style={{
        width: size,
        height: size,
        borderRadius: size === 76 ? 18 : 16,
        fontSize: size === 76 ? 15 : 14,
      }}
    >
      APP
    </div>
  );
}
