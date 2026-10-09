import { describe, expect, it } from "vitest";
import { legacyDomainRedirects } from "../next.config.mjs";

describe("redirect do domínio antigo", () => {
  it("fica desligado sem REDIRECT_LEGACY_DOMAIN=1 (não manda ninguém pra domínio fora do ar)", () => {
    expect(legacyDomainRedirects({})).toEqual([]);
    expect(legacyDomainRedirects({ REDIRECT_LEGACY_DOMAIN: "0" })).toEqual([]);
  });

  it("ligado: 301 de smartea.com.br e www pro endereço do site, poupando a verificação do Google", () => {
    const [rule] = legacyDomainRedirects({ REDIRECT_LEGACY_DOMAIN: "1" });
    expect(rule.statusCode).toBe(301);
    expect(rule.has[0].value).toBe("(?:www\\.)?smartea\\.com\\.br");
    expect(rule.destination).toMatch(/\/:path$/);
    expect(rule.source).toContain("google1e4100e11d0ac91d");
  });
});
