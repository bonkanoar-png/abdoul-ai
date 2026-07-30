import { expect, test } from "@playwright/test";

test("affiche l’analyse carrière et sélectionne un CV local", async ({ page }) => {
  await page.goto("/career-copilot");
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { level: 1, name: "Career Copilot" })).toBeVisible();
  await expect(page.getByRole("status", { name: "Score carrière 87 sur 100" })).toBeVisible();
  await expect(page.getByText("95% match")).toBeVisible();

  await page.getByLabel("Sélectionner un CV PDF — démonstration locale").setInputFiles({
    name: "cv-abdoul.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("mock"),
  });
  await expect(page.getByText("Sélectionné : cv-abdoul.pdf")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Analyse du profil" })).toBeVisible();
});
