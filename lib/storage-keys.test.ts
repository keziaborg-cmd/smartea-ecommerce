import { beforeEach, describe, expect, it } from "vitest";
import { migrateLegacyStorage, resetStorageMigrationForTests, STORAGE_KEYS } from "./storage-keys";

function fakeStorage(initial: Record<string, string>) {
  const m = new Map(Object.entries(initial));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), keys: () => [...m.keys()] };
}

beforeEach(() => resetStorageMigrationForTests());

describe("migração das chaves do navegador (Smartea → Almara)", () => {
  it("copia cada chave antiga pro nome novo e apaga a antiga", () => {
    const s = fakeStorage({ "smartea-cart": '{"state":{"items":{"jasmin":2}}}', "smartea-aid": "a1", "smartea-sid": "s1", "smartea-attr": "{}", "smartea-consent": "{}" });
    migrateLegacyStorage(s);
    expect(s.getItem(STORAGE_KEYS.cart)).toBe('{"state":{"items":{"jasmin":2}}}');
    expect(s.getItem(STORAGE_KEYS.anonymousId)).toBe("a1");
    expect(s.keys().filter((k) => k.startsWith("smartea-"))).toEqual([]);
  });

  it("não sobrescreve o que já existe com o nome novo", () => {
    const s = fakeStorage({ "smartea-aid": "velho", "almara-aid": "novo" });
    migrateLegacyStorage(s);
    expect(s.getItem("almara-aid")).toBe("novo");
    expect(s.getItem("smartea-aid")).toBeNull();
  });

  it("sem armazenamento disponível não quebra", () => {
    const broken = { getItem: () => { throw new Error("bloqueado"); }, setItem: () => {}, removeItem: () => {} };
    expect(() => migrateLegacyStorage(broken)).not.toThrow();
    expect(() => migrateLegacyStorage(undefined)).not.toThrow();
  });
});
