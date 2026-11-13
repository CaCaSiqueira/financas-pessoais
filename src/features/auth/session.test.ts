import { describe, expect, it } from "vitest";

import {
  buildLoginRedirectPath,
  decideSessionRoute,
  DEFAULT_AUTHENTICATED_PATH,
  getSafeRedirectPath,
  isProtectedPath,
  isPublicPath,
} from "./session";

describe("isPublicPath / isProtectedPath", () => {
  it.each(["/login", "/auth/callback"])("%s é pública", (path) => {
    expect(isPublicPath(path)).toBe(true);
    expect(isProtectedPath(path)).toBe(false);
  });

  it.each(["/", "/dashboard", "/lancamentos", "/contas/123", "/mais", "/loginx", "/auth"])(
    "%s é protegida",
    (path) => {
      expect(isProtectedPath(path)).toBe(true);
    },
  );
});

describe("getSafeRedirectPath", () => {
  it("mantém caminhos internos com query e hash", () => {
    expect(getSafeRedirectPath("/lancamentos?mes=2026-11#topo")).toBe(
      "/lancamentos?mes=2026-11#topo",
    );
  });

  it.each([
    null,
    undefined,
    "",
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "dashboard",
    "/\u0000evil",
    "/login",
    "/auth/callback?code=x",
  ])("bloqueia destino inseguro ou público: %s", (next) => {
    expect(getSafeRedirectPath(next)).toBe(DEFAULT_AUTHENTICATED_PATH);
  });
});

describe("buildLoginRedirectPath", () => {
  it("preserva a rota original em ?next", () => {
    expect(buildLoginRedirectPath("/contas", "?tipo=cartao")).toBe(
      "/login?next=%2Fcontas%3Ftipo%3Dcartao",
    );
  });

  it("não adiciona next para a raiz ou rotas públicas", () => {
    expect(buildLoginRedirectPath("/")).toBe("/login");
    expect(buildLoginRedirectPath("/login")).toBe("/login");
  });
});

describe("decideSessionRoute", () => {
  it("sem sessão: rota protegida redireciona para /login", () => {
    expect(decideSessionRoute("/dashboard", "", false)).toEqual({
      action: "redirect",
      to: "/login?next=%2Fdashboard",
    });
  });

  it("sem sessão: rota pública segue", () => {
    expect(decideSessionRoute("/login", "", false)).toEqual({ action: "next" });
    expect(decideSessionRoute("/auth/callback", "?code=abc", false)).toEqual({ action: "next" });
  });

  it("com sessão: /login e / vão para o dashboard", () => {
    expect(decideSessionRoute("/login", "", true)).toEqual({
      action: "redirect",
      to: DEFAULT_AUTHENTICATED_PATH,
    });
    expect(decideSessionRoute("/", "", true)).toEqual({
      action: "redirect",
      to: DEFAULT_AUTHENTICATED_PATH,
    });
  });

  it("com sessão: rotas protegidas e o callback seguem", () => {
    expect(decideSessionRoute("/contas", "", true)).toEqual({ action: "next" });
    expect(decideSessionRoute("/auth/callback", "?code=abc", true)).toEqual({ action: "next" });
  });
});
