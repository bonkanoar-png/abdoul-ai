import { expect, test } from "@playwright/test";

test("filtre puis ouvre le détail d’un projet", async ({ page }) => {
  await page.goto("/projects");
  await page.waitForLoadState("networkidle");

  const filters = page.getByRole("group", { name: "Filtrer les projets" });

  await expect(page.getByRole("heading", { level: 1, name: "Projets" })).toBeVisible();
  await expect(page.getByLabel("Catégorie")).toBeVisible();
  await expect(filters.getByRole("combobox").nth(1)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Orange NLP ITSM" })).toBeVisible();

  await page.getByLabel("Catégorie").selectOption("AI");
  await page.getByRole("link", { name: "Découvrir le projet" }).click();

  await expect(page).toHaveURL(/\/projects\/orange-nlp-itsm$/);
  await expect(page.getByRole("heading", { level: 1, name: "Orange NLP ITSM" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Résultats et démarche" })).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Projets", exact: true }),
  ).toBeVisible();
});
