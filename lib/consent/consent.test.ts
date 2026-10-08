import { afterEach, describe, expect, it, vi } from "vitest";

function fakeStorage(initial: Record<string, string>) {
  const m = new Map(Object.entries(initial));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("hasAnalyticsConsent", () => {
  it("lê a escolha guardada mesmo antes do efeito de carregamento (evento disparado na montagem da página)", async () => {
    const { COOKIE_CONSENT_VERSION } = await import("./consent");
    vi.resetModules();
    vi.stubGlobal("window", {});
    vi.stubGlobal(
      "localStorage",
      fakeStorage({ "almara-consent": JSON.stringify({ analytics: true, marketing: false, version: COOKIE_CONSENT_VERSION, decidedAt: "2026-10-07T00:00:00Z" }) }),
    );
    const { hasAnalyticsConsent, useConsentStore } = await import("./consent");
    expect(useConsentStore.getState().loaded).toBe(false);
    expect(hasAnalyticsConsent()).toBe(true);
    expect(useConsentStore.getState().loaded).toBe(true);
  });

  it("sem escolha guardada (ou de versão antiga do texto) continua sem consentimento", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", fakeStorage({ "almara-consent": JSON.stringify({ analytics: true, marketing: true, version: "velha" }) }));
    const { hasAnalyticsConsent } = await import("./consent");
    expect(hasAnalyticsConsent()).toBe(false);
  });
});

describe("consentimento salvo antes do rebrand", () => {
  it("quem aceitou com a chave antiga (smartea-consent) continua com o consentimento", async () => {
    const { COOKIE_CONSENT_VERSION } = await import("./consent");
    vi.resetModules();
    const store = fakeStorage({ "smartea-consent": JSON.stringify({ analytics: true, marketing: false, version: COOKIE_CONSENT_VERSION, decidedAt: "2026-10-07T00:00:00Z" }) });
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", store);
    const { hasAnalyticsConsent } = await import("./consent");
    expect(hasAnalyticsConsent()).toBe(true);
    expect(store.getItem("smartea-consent")).toBeNull();
    expect(store.getItem("almara-consent")).not.toBeNull();
  });
});
