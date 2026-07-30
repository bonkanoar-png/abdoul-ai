import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

const catalogs = { fr, en } as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale) {
  return catalogs[locale];
}
