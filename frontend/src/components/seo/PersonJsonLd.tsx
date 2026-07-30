import { absoluteUrl, serializeJsonLd } from "@/lib/seo";

const personData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: "Abdoul",
      url: absoluteUrl("/"),
      jobTitle: ["Data Scientist", "AI Engineer"],
      knowsAbout: [
        "Intelligence artificielle",
        "Natural Language Processing",
        "Machine Learning",
        "Data Science",
        "Développement logiciel",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": absoluteUrl("/about#profile"),
      url: absoluteUrl("/about"),
      name: "Profil professionnel d’Abdoul",
      mainEntity: { "@id": absoluteUrl("/#person") },
    },
  ],
};

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(personData) }}
    />
  );
}
