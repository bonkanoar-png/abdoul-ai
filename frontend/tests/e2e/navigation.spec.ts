import { expect, test } from "@playwright/test";

test.describe("navigation globale", () => {
  test("parcourt les principales pages sans erreur navigateur", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("AI/Data/Backend Engineer");
    await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();

    const routes = [
      ["À propos", "/about", "Abdoul"],
      ["Expérience", "/experience", "Expérience professionnelle"],
      ["Formation", "/formations", "Formations"],
      ["Compétences", "/skills", "Compétences techniques"],
      ["Projets", "/projects", "Projets"],
      ["Contact", "/contact", "Contact"],
    ] as const;

    for (const [label, path, heading] of routes) {
      await page
        .getByRole("navigation", { name: "Navigation principale" })
        .getByRole("link", {
          name: label,
          exact: true,
        })
        .click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();

      if (path === "/experience") {
        await expect(page.getByRole("list", { name: "Parcours professionnel" })).toBeVisible();
        await expect(
          page.getByRole("heading", {
            name: "Professeur de Mathématiques | Analyse, Pédagogie et Gestion",
          }),
        ).toBeVisible();
      }
    }

    expect(pageErrors).toEqual([]);
  });

  test("ouvre et ferme le menu mobile au clavier", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const menuButton = page.getByRole("button", { name: "Ouvrir le menu" });
    await expect(menuButton).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link").first(),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeHidden();
    await expect(menuButton).toBeFocused();
  });
});
