const MP_API = "https://api.mercadopago.com";

function accessToken(): string {
  const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN not configured");
  return token;
}

export interface MpPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: "BRL";
}

export async function createPreference(params: {
  items: MpPreferenceItem[];
  externalReference: string;
  notificationUrl: string;
  payerEmail: string;
}): Promise<{ id: string }> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: params.items,
      external_reference: params.externalReference,
      notification_url: params.notificationUrl,
      payer: { email: params.payerEmail },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mercado Pago preference creation failed: ${res.status} ${text}`);
  }

  return res.json();
}

export interface MpPixTransactionData {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
}

export async function createPayment(params: {
  formData: Record<string, unknown>;
  externalReference: string;
  notificationUrl: string;
  idempotencyKey: string;
}): Promise<{
  id: number;
  status: string;
  status_detail: string;
  // Presentes só em pagamentos Pix — a API já devolve isso pronto na criação
  // do pagamento, sem precisar de chamada extra.
  date_of_expiration?: string;
  point_of_interaction?: {
    transaction_data?: MpPixTransactionData;
  };
}> {
  const res = await fetch(`${MP_API}/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": params.idempotencyKey,
    },
    body: JSON.stringify({
      ...params.formData,
      external_reference: params.externalReference,
      notification_url: params.notificationUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Mercado Pago payment creation failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

export async function getPayment(paymentId: string | number): Promise<{
  id: number;
  status: string;
  status_detail: string;
  external_reference: string;
}> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken()}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mercado Pago payment lookup failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function mapMpStatusToOrderStatus(mpStatus: string): "pending" | "approved" | "rejected" | "cancelled" {
  if (mpStatus === "approved") return "approved";
  if (mpStatus === "rejected") return "rejected";
  if (mpStatus === "cancelled" || mpStatus === "refunded" || mpStatus === "charged_back") return "cancelled";
  return "pending";
}
