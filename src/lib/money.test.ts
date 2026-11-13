import { describe, expect, it } from "vitest";

import { formatCents } from "./money";

// Intl usa espaço não separável (U+00A0) entre "R$" e o número.
const normalize = (s: string) => s.replace(/ /g, " ");

describe("formatCents", () => {
  it("formata centavos em reais", () => {
    expect(normalize(formatCents(123456))).toBe("R$ 1.234,56");
  });

  it("formata zero e valores negativos", () => {
    expect(normalize(formatCents(0))).toBe("R$ 0,00");
    expect(normalize(formatCents(-990))).toBe("-R$ 9,90");
  });

  it("rejeita valores não inteiros", () => {
    expect(() => formatCents(10.5)).toThrow(TypeError);
  });
});
