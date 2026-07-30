import { absoluteUrl, serializeJsonLd } from "@/lib/seo";

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: absoluteUrl("/"),
  name: "Abdoul AI",
  description:
    "Portfolio interactif d’Abdoul, Data Scientist et AI Engineer spécialisé en intelligence artificielle.",
  inLanguage: ["fr-FR", "en"],
  publisher: { "@id": absoluteUrl("/#person") },
};

export function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteData) }}
    />
  );
}
