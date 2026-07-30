import { expect, test } from "@playwright/test";

test("valide le formulaire de contact sans envoi réseau", async ({ page }) => {
  await page.goto("/contact");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Valider le message" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveCount(3);

  await page.getByLabel(/Nom/).fill("Abdoul");
  await page.getByLabel(/Email/).fill("abdoul@example.com");
  await page
    .getByLabel(/Message/)
    .fill("Échangeons sur une mission Data et Intelligence Artificielle.");
  await page.getByRole("button", { name: "Valider le message" }).click();

  await expect(page.getByRole("status")).toContainText("Message validé");
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
});
