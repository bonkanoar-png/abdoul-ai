import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SourcePreview } from "@/features/chat";

describe("SourcePreview", () => {
  it("renders source titles, snippets and links", () => {
    render(
      <SourcePreview
        sources={[
          {
            title: "Expérience",
            url: "/experience",
            snippet: "Le parcours professionnel d’Abdoul.",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Expérience" })).toHaveAttribute("href", "/experience");
    expect(screen.getByText(/parcours professionnel/)).toBeInTheDocument();
  });
});
