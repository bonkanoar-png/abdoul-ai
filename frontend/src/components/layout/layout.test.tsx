import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { ThemeProvider } from "@/components/theme/theme-provider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("global layout components", () => {
  it("provides desktop and mobile navigation landmarks", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Abdoul AI — Retour à l’accueil")).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ouvrir le menu" })).toBeInTheDocument();
  });

  it("renders reusable page and footer regions", () => {
    render(
      <>
        <PageContainer>Contenu</PageContainer>
        <Footer />
      </>,
    );

    expect(screen.getByText("Contenu")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo", { name: "Pied de page" })).toBeInTheDocument();
  });
});
