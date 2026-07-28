import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { ThemeProvider } from "@/components/theme/theme-provider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("responsive layout foundation", () => {
  it("keeps mobile controls and desktop navigation on explicit breakpoints", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toHaveClass(
      "hidden",
      "xl:flex",
    );
    expect(screen.getByRole("button", { name: "Ouvrir le menu" }).parentElement).toHaveClass(
      "md:hidden",
    );
  });

  it("applies mobile-first page spacing with wider viewport enhancements", () => {
    render(<PageContainer>Contenu responsive</PageContainer>);

    expect(screen.getByText("Contenu responsive")).toHaveClass("pt-32", "sm:pt-36", "sm:pb-24");
  });
});
