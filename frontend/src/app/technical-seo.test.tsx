import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/seo";

describe("technical SEO", () => {
  it("defines professional root, Open Graph and Twitter metadata", () => {
    expect(metadata).toMatchObject({
      title: {
        default: "Abdoul AI | Data Scientist & AI Engineer",
        template: "%s | Abdoul AI",
      },
      openGraph: {
        siteName: "Abdoul AI",
        locale: "fr_FR",
      },
      twitter: {
        card: "summary_large_image",
      },
    });
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("publishes robots rules with an admin exclusion in production", () => {
    const config = robots();

    expect(config.sitemap).toMatch(/\/sitemap\.xml$/);
    if (process.env.NODE_ENV === "production") {
      expect(config.rules).toMatchObject({ disallow: ["/admin"] });
    } else {
      expect(config.rules).toMatchObject({ disallow: ["/"] });
    }
  });

  it("lists every public route without admin", () => {
    const routes = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(routes).toEqual([
      "/",
      "/about",
      "/experience",
      "/skills",
      "/projects",
      "/publications",
      "/certifications",
      "/contact",
      "/ai",
      "/career-copilot",
      "/data-lab",
    ]);
    expect(routes).not.toContain("/admin");
  });

  it("renders valid Person, ProfilePage and WebSite JSON-LD", () => {
    const { container } = render(
      <>
        <PersonJsonLd />
        <WebsiteJsonLd />
      </>,
    );
    const payloads = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (script) => JSON.parse(script.textContent ?? "{}") as Record<string, unknown>,
    );

    expect(payloads).toHaveLength(2);
    expect(JSON.stringify(payloads)).toContain('"@type":"Person"');
    expect(JSON.stringify(payloads)).toContain('"@type":"ProfilePage"');
    expect(JSON.stringify(payloads)).toContain('"@type":"WebSite"');
  });
});
