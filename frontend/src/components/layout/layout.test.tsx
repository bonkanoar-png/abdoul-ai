import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";

describe("global layout components", () => {
  it("provides desktop and mobile navigation landmarks", () => {
    render(<Navbar />);

    expect(screen.getByLabelText("Abdoul AI — Retour à l’accueil")).toHaveAttribute(
      "href",
      "#accueil",
    );
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigation mobile" })).toBeInTheDocument();
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
