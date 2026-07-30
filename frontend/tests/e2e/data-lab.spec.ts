import { expect, test } from "@playwright/test";

test("explore le dataset, les métriques et les modèles", async ({ page }) => {
  await page.goto("/data-lab");

  await expect(page.getByRole("heading", { level: 1, name: "Data Lab" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Customer NLP Dataset" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Accuracy" })).toBeVisible();
  await expect(
    page.getByRole("table", { name: "Extrait simulé du Customer NLP Dataset" }),
  ).toBeVisible();
  await expect(
    page.getByRole("table", {
      name: "Comparaison Accuracy, Precision et Recall des modèles simulés",
    }),
  ).toBeVisible();
});
