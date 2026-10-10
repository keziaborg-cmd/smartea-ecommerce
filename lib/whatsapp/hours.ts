// Horário de atendimento do WhatsApp (o mesmo publicado em /suporte: segunda a sexta, 8h às 18h,
// horário de Brasília). Fora dele o widget não promete resposta em minutos.
export const SUPPORT_OPEN_HOUR = 8;
export const SUPPORT_CLOSE_HOUR = 18;

export function isSupportOpen(now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  if (weekday === "Sat" || weekday === "Sun") return false;
  return hour >= SUPPORT_OPEN_HOUR && hour < SUPPORT_CLOSE_HOUR;
}
