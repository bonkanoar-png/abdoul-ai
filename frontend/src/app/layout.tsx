import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Abdoul AI — Data Scientist & AI Engineer",
    template: "%s | Abdoul AI",
  },
  description: "Portfolio professionnel d’Abdoul, Data Scientist, AI Engineer et Backend Engineer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <a
            className="bg-primary text-surface fixed top-3 left-3 z-50 -translate-y-20 rounded-full px-4 py-2 font-semibold transition focus:translate-y-0"
            href="#contenu-principal"
          >
            Aller au contenu
          </a>
          <Navbar />
          <div id="contenu-principal">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
