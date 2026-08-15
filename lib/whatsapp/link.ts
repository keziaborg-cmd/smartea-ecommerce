export function buildWhatsAppLink(message: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
