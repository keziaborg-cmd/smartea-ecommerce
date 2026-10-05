const RESEND_API = "https://api.resend.com/emails";
const FROM_ADDRESS = "Smartea <ola@smartea.com.br>";

function resendApiKey(): string {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return key;
}

function formatCentsBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export interface OrderConfirmationEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  items: { name: string; qty: number; unitPriceCents: number }[];
  shipping: {
    rua: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}

function buildHtml(data: OrderConfirmationEmailData): string {
  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.qty}× ${i.name}</td><td style="padding:6px 0;text-align:right">${formatCentsBRL(i.unitPriceCents * i.qty)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;color:#1a1a1a;max-width:480px;margin:0 auto">
      <h2 style="color:#013f24">Pedido confirmado!</h2>
      <p>Olá, ${data.customerName}. Seu pagamento foi aprovado e o pedido <strong>${data.orderNumber}</strong> já está sendo preparado.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${itemsHtml}
        <tr>
          <td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold">Total</td>
          <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;font-weight:bold">${formatCentsBRL(data.totalCents)}</td>
        </tr>
      </table>
      <p style="margin-top:20px">
        <strong>Endereço de entrega</strong><br/>
        ${data.shipping.rua}, ${data.shipping.numero}${data.shipping.complemento ? ` - ${data.shipping.complemento}` : ""}<br/>
        ${data.shipping.bairro} — ${data.shipping.cidade}/${data.shipping.uf}<br/>
        CEP ${data.shipping.cep}
      </p>
      <p style="margin-top:24px;color:#666;font-size:13px">Qualquer dúvida, é só responder este e-mail.</p>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<void> {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: data.customerEmail,
      subject: `Pedido ${data.orderNumber} confirmado — Smartea`,
      html: buildHtml(data),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend email send failed: ${res.status} ${text}`);
  }
}
