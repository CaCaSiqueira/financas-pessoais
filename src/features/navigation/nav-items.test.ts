import { describe, expect, it } from "vitest";

import { bottomNavLeft, bottomNavRight, isActivePath } from "./nav-items";

describe("isActivePath", () => {
  it("marca a rota exata e sub-rotas", () => {
    expect(isActivePath("/contas", "/contas")).toBe(true);
    expect(isActivePath("/contas/abc", "/contas")).toBe(true);
    expect(isActivePath("/contasx", "/contas")).toBe(false);
  });

  it('"Mais" fica ativo nas seções que agrupa', () => {
    expect(isActivePath("/mais", "/mais")).toBe(true);
    expect(isActivePath("/categorias", "/mais")).toBe(true);
    expect(isActivePath("/configuracoes", "/mais")).toBe(true);
    expect(isActivePath("/lancamentos", "/mais")).toBe(false);
  });
});

describe("navegação inferior", () => {
  it("tem Início, Lançamentos | + | Contas, Mais", () => {
    expect(bottomNavLeft.map((i) => i.label)).toEqual(["Início", "Lançamentos"]);
    expect(bottomNavRight.map((i) => i.label)).toEqual(["Contas", "Mais"]);
  });
});
