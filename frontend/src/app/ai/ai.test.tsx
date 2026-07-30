import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AiPage, { metadata } from "@/app/ai/page";
import { navigationItems } from "@/lib/constants/navigation";

describe("AiPage", () => {
  it("renders the assistant UI and its local-only notice", () => {
    render(<AiPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Ask Abdoul AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Abdoul AI Assistant" })).toBeInTheDocument();
    expect(screen.getByText(/aucune question n’est envoyée à une API/i)).toBeInTheDocument();
  });

  it("defines AI metadata", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Abdoul AI Assistant" },
      description:
        "Assistant intelligent pour découvrir le parcours, les projets et les compétences d'Abdoul.",
    });
  });

  it("adds the AI route to global navigation", () => {
    expect(navigationItems).toContainEqual({ href: "/ai", label: "AI" });
  });
});
