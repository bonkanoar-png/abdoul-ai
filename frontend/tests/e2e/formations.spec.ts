import { expect, test } from "@playwright/test";

test.describe("formations", () => {
  test("affiche le parcours académique en desktop", async ({ page }) => {
    await page.goto("/formations");

    await expect(page.getByRole("heading", { level: 1, name: "Formations" })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Master IA, Science des données et systèmes intelligents",
      }),
    ).toBeVisible();
    await expect(page.getByRole("list", { name: "Parcours de formation" })).toBeVisible();
  });

  test("reste accessible et lisible en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/formations");

    await expect(page.getByRole("heading", { level: 1, name: "Formations" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
