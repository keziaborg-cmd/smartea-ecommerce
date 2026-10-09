import { describe, expect, it } from "vitest";
import { browserName, deviceType, parseUtm, safeUrl } from "./tracker";

describe("safeUrl", () => {
  it("tira o token de acesso do pedido (e qualquer parâmetro fora da lista) da URL registrada", () => {
    expect(safeUrl("https://almara.com.br/pedido/ALM-1?token=abc-123&utm_source=x#topo")).toBe(
      "https://almara.com.br/pedido/ALM-1?utm_source=x",
    );
  });

  it("mantém utm, gclid, fbclid e ref", () => {
    const url = safeUrl("https://almara.com.br/?utm_campaign=c&gclid=g&fbclid=f&ref=r&email=a@b.com");
    expect(url).toBe("https://almara.com.br/?utm_campaign=c&gclid=g&fbclid=f&ref=r");
  });

  it("URL inválida vira string vazia", () => {
    expect(safeUrl("não é url")).toBe("");
  });
});

describe("parseUtm", () => {
  it("só pega parâmetros de campanha", () => {
    expect(parseUtm("?utm_source=ig&utm_medium=story&token=x&q=chá")).toEqual({ utm_source: "ig", utm_medium: "story" });
  });
});

describe("deviceType / browserName", () => {
  const iphone =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
  const ipad =
    "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
  const androidTablet = "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
  const chromeMac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
  const edge = `${chromeMac} Edg/129.0`;

  it("classifica o aparelho", () => {
    expect(deviceType(iphone)).toBe("mobile");
    expect(deviceType(ipad)).toBe("tablet");
    expect(deviceType(androidTablet)).toBe("tablet");
    expect(deviceType(chromeMac)).toBe("desktop");
  });

  it("classifica o navegador", () => {
    expect(browserName(iphone)).toBe("safari");
    expect(browserName(chromeMac)).toBe("chrome");
    expect(browserName(edge)).toBe("edge");
  });
});
