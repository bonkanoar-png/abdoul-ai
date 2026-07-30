import { expect, test } from "@playwright/test";

const pages = ["/", "/projects", "/ai"] as const;
const viewports = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  for (const path of pages) {
    test(`${path} reste lisible en ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);

      if (viewport.name === "mobile") {
        await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();
      } else {
        await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
      }
    });
  }
}
