import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/seo";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteUrl } from "@/lib/seo";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abdoul AI | Data Scientist & AI Engineer",
    template: "%s | Abdoul AI",
  },
  description:
    "Portfolio interactif d'Abdoul, Data Scientist et AI Engineer spécialisé en intelligence artificielle, NLP, machine learning et développement logiciel.",
  keywords: [
    "Abdoul",
    "Data Scientist",
    "AI Engineer",
    "Intelligence artificielle",
    "NLP",
    "Machine Learning",
    "Backend Engineering",
  ],
  authors: [{ name: "Abdoul", url: siteUrl }],
  creator: "Abdoul",
  publisher: "Abdoul AI",
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Abdoul AI",
    locale: "fr_FR",
    title: "Abdoul AI | Data Scientist & AI Engineer",
    description:
      "Portfolio interactif d'Abdoul, Data Scientist et AI Engineer spécialisé en intelligence artificielle, NLP et machine learning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdoul AI | Data Scientist & AI Engineer",
    description:
      "Portfolio interactif d'Abdoul, Data Scientist et AI Engineer spécialisé en intelligence artificielle, NLP et machine learning.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <PersonJsonLd />
        <WebsiteJsonLd />
        <ThemeProvider>
          <a
            className="bg-primary text-surface fixed top-3 left-3 z-50 -translate-y-20 rounded-full px-4 py-2 font-semibold transition focus:translate-y-0"
            href="#contenu-principal"
          >
            Aller au contenu
          </a>
          <Navbar />
          <div id="contenu-principal" tabIndex={-1}>
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
