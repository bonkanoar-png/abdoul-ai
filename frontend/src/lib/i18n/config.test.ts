import { describe, expect, it } from "vitest";

import { defaultLocale, getMessages, isLocale, locales } from "@/lib/i18n/config";

describe("i18n configuration", () => {
  it("provides FR and EN catalogs with French as a safe default", () => {
    expect(locales).toEqual(["fr", "en"]);
    expect(defaultLocale).toBe("fr");
    expect(getMessages("fr").navigation.home).toBe("Accueil");
    expect(getMessages("en").navigation.home).toBe("Home");
  });

  it("validates supported locales", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });
});
