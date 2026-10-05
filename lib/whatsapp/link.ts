// Número oficial de WhatsApp da Smartea (DDI + DDD + número, só dígitos). O
// número público é o mesmo exibido nas páginas legais e em /suporte — se mudar,
// atualize os dois. NEXT_PUBLIC_WHATSAPP_NUMBER continua tendo precedência.
const DEFAULT_WHATSAPP_NUMBER = "5519990306995";

export function buildWhatsAppLink(message: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
