import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

// Entrada de eventos do CRM pelo servidor (public.crm_track_server, definida em
// almara-metrics/db/006_crm_core.sql). Nunca lança: o CRM fora do ar não pode
// derrubar um pedido ou pagamento.
export interface CrmServerEvent {
  name: string;
  email?: string | null;
  phone?: string | null;
  personName?: string | null;
  shopCustomerId?: string | null;
  anonymousId?: string | null;
  sessionId?: string | null;
  properties?: Record<string, unknown>;
  idempotencyKey?: string | null;
}

export async function crmTrack(supabase: SupabaseClient, e: CrmServerEvent): Promise<void> {
  try {
    const { error } = await supabase.rpc("crm_track_server", {
      p_name: e.name,
      p_email: e.email ?? null,
      p_phone: e.phone ?? null,
      p_person_name: e.personName ?? null,
      p_shop_customer_id: e.shopCustomerId ?? null,
      p_anonymous_id: e.anonymousId ?? null,
      p_session_id: e.sessionId ?? null,
      p_properties: e.properties ?? {},
      p_idempotency_key: e.idempotencyKey ?? null,
    });
    if (error) console.error("crm_track_server failed", e.name, error.message);
  } catch (err) {
    console.error("crm_track_server threw", e.name, err);
  }
}

export interface CrmTracking {
  anonymousId?: string;
  sessionId?: string;
}

// Só aceita ids no formato que o tracker do site gera — o corpo da requisição vem do navegador.
export function sanitizeTracking(raw: unknown): CrmTracking {
  const t = (raw ?? {}) as Record<string, unknown>;
  const ok = (v: unknown) => (typeof v === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : undefined);
  return { anonymousId: ok(t.anonymousId), sessionId: ok(t.sessionId) };
}
