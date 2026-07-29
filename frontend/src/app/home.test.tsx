import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage, { metadata } from "@/app/page";

describe("HomePage", () => {
  it("renders the professional landing page with a clear heading hierarchy", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "AI/Data/Backend Engineer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Intelligence Artificielle" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Data Science" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Backend Engineering" }),
    ).toBeInTheDocument();
  });

  it("provides accessible calls to About, Projects and Contact", () => {
    render(<HomePage />);
    const navigation = screen.getByRole("navigation", { name: "Découvrir le portfolio" });

    expect(within(navigation).getByRole("link", { name: "À propos" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(within(navigation).getByRole("link", { name: "Projets" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(within(navigation).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("defines the required SEO metadata", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Abdoul AI — Data Scientist & AI Engineer" },
      description:
        "Portfolio professionnel Data, Intelligence Artificielle et Backend Engineering.",
    });
  });
});
