const FALLBACK_SITE_URL = "https://abdoul-ai.dev";

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return FALLBACK_SITE_URL;
    }
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}

export function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
