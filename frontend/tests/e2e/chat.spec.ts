import { expect, test } from "@playwright/test";

test("utilise une suggestion et reçoit une réponse locale simulée", async ({ page }) => {
  await page.goto("/ai");
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { level: 1, name: "Ask Abdoul AI" })).toBeVisible();
  await page.getByRole("button", { name: "Quels sont ses projets IA ?" }).click();
  await expect(page.getByLabel("Votre question")).toHaveValue("Quels sont ses projets IA ?");

  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByRole("article", { name: "Message utilisateur" })).toContainText(
    "Quels sont ses projets IA ?",
  );
  await expect(page.getByRole("article", { name: "Message assistant" })).toContainText(
    "Réponse simulée",
  );
});
