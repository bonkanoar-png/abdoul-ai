import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { navigationItems } from "@/lib/constants/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("global navigation", () => {
  it("renders every route and exposes the active page", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>,
    );

    for (const item of navigationItems) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("aria-current", "page");
  });

  it("opens, focuses and closes the mobile menu after selection", async () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Ouvrir le menu" });
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Navigation mobile" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("link", { name: "Accueil" })[1]).toHaveFocus());

    fireEvent.click(screen.getAllByRole("link", { name: "Contact" })[1]);

    expect(screen.queryByRole("navigation", { name: "Navigation mobile" })).not.toBeInTheDocument();
  });
});
