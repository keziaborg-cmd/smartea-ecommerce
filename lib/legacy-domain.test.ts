import { describe, expect, it } from "vitest";
import { legacyDomainRedirects } from "../next.config.mjs";

describe("redirect do domínio antigo", () => {
  it("fica desligado sem REDIRECT_LEGACY_DOMAIN=1 (não manda ninguém pra domínio fora do ar)", () => {
    expect(legacyDomainRedirects({})).toEqual([]);
    expect(legacyDomainRedirects({ REDIRECT_LEGACY_DOMAIN: "0" })).toEqual([]);
  });

  it("ligado: caminhos renomeados vão direto pro endereço final (um salto só)", () => {
    const rules = legacyDomainRedirects({ REDIRECT_LEGACY_DOMAIN: "1" });
    const direct = rules.find((r: { source: string }) => r.source === "/smartea-mais")!;
    expect(direct.destination).toBe("https://almara.com.br/almara-mais");
    expect(direct.statusCode).toBe(301);
    expect(rules.find((r: { source: string }) => r.source === "/blog/autor/equipe-smartea")!.destination).toBe("https://almara.com.br/blog/autor/equipe-almara");
    // as regras específicas vêm antes da genérica, senão a genérica engoliria o caminho
    expect(rules.findIndex((r: { source: string }) => r.source === "/smartea-mais")).toBeLessThan(rules.length - 1);
  });

  it("ligado: o resto do domínio antigo e do www vai pro novo com 301, poupando a verificação do Google", () => {
    const rules = legacyDomainRedirects({ REDIRECT_LEGACY_DOMAIN: "1" });
    const rule = rules[rules.length - 1];
    expect(rule.statusCode).toBe(301);
    expect(rule.has[0].value).toBe("(?:www\\.)?smartea\\.com\\.br");
    expect(rule.destination).toMatch(/\/:path$/);
    expect(rule.source).toContain("google1e4100e11d0ac91d");
  });
});
