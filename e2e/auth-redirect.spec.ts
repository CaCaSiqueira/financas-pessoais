import { expect, test } from "@playwright/test";

const protectedRoutes = [
  "/dashboard",
  "/lancamentos",
  "/contas",
  "/categorias",
  "/orcamentos",
  "/relatorios",
  "/configuracoes",
  "/mais",
];

test.describe("sem sessão", () => {
  for (const route of protectedRoutes) {
    test(`${route} redireciona para /login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`/login\\?next=${encodeURIComponent(route)}$`));
      await expect(
        page.getByRole("heading", { level: 1, name: "Finanças Pessoais" }),
      ).toBeVisible();
    });
  }

  test("raiz redireciona para /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("não aceita open redirect no parâmetro next", async ({ page }) => {
    await page.goto("/login?next=//evil.example");
    await expect(page.getByRole("button", { name: "Entrar com Google" })).toBeVisible();
  });

  test("página de login tem botão do Google e seletor de tema", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Entrar com Google" })).toBeEnabled();
    await page.getByRole("button", { name: "Alterar tema" }).click();
    await page.getByRole("menuitemradio", { name: "Escuro" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("callback sem código volta para o login com erro", async ({ page }) => {
    await page.goto("/auth/callback");
    await expect(page).toHaveURL(/\/login\?error=auth$/);
    await expect(
      page.getByRole("alert").filter({ hasText: "Não foi possível concluir o login" }),
    ).toBeVisible();
  });
});
