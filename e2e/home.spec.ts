import { expect, test } from "@playwright/test";

test("página inicial exibe o título e o seletor de tema", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Finanças Pessoais" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Alterar tema" })).toBeVisible();
});

test("seletor de tema troca para o modo escuro", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Alterar tema" }).click();
  await page.getByRole("menuitemradio", { name: "Escuro" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
