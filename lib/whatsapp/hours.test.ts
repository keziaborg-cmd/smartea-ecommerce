import { describe, expect, it } from "vitest";
import { isSupportOpen } from "./hours";

// Horário de Brasília = UTC-3 (sem horário de verão desde 2019).
describe("isSupportOpen", () => {
  it("aberto em dia útil das 8h às 18h", () => {
    expect(isSupportOpen(new Date("2026-10-09T11:00:00Z"))).toBe(true); // sex 08:00
    expect(isSupportOpen(new Date("2026-10-09T20:59:00Z"))).toBe(true); // sex 17:59
  });
  it("fechado antes das 8h, a partir das 18h e no fim de semana", () => {
    expect(isSupportOpen(new Date("2026-10-09T10:59:00Z"))).toBe(false); // sex 07:59
    expect(isSupportOpen(new Date("2026-10-09T21:00:00Z"))).toBe(false); // sex 18:00
    expect(isSupportOpen(new Date("2026-10-10T15:00:00Z"))).toBe(false); // sáb
    expect(isSupportOpen(new Date("2026-10-11T15:00:00Z"))).toBe(false); // dom
  });
});
