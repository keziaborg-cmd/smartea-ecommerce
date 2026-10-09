// Update this list when the production domain changes or a new preview/dev
// origin needs to call these functions directly from the browser.
const ALLOWED_ORIGINS = [
  "https://almara.com.br",
  "https://www.almara.com.br",
  // domínio antigo: só durante a transição (ele redireciona pro novo com 301); remover depois
  "https://smartea.com.br",
  "https://www.smartea.com.br",
  "http://localhost:3411",
  "http://localhost:3000",
];

function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

// Bundles per-request-origin-aware CORS headers into simple json()/preflight()
// helpers, so each function doesn't have to thread the origin through every
// call site by hand.
export function makeResponders(req: Request) {
  const headers = corsHeadersFor(req);
  return {
    json(body: unknown, status = 200): Response {
      return new Response(JSON.stringify(body), {
        status,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    },
    preflight(): Response | null {
      if (req.method === "OPTIONS") {
        return new Response("ok", { headers });
      }
      return null;
    },
  };
}
