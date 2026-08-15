import { createClient } from "npm:@supabase/supabase-js@2";

// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are auto-injected into every
// deployed Edge Function by Supabase — no manual secret needed.
export function createAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}
