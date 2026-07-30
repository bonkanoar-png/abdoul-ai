import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PublicationCard, PublicationGrid } from "@/features/publications";
import { publicationFixture } from "@/test/fixtures";

describe("Publication components", () => {
  it("renders title, summary, tags and a safe external link", () => {
    render(<PublicationCard publication={publicationFixture} />);

    expect(screen.getByRole("heading", { name: publicationFixture.title })).toBeInTheDocument();
    expect(screen.getByText(publicationFixture.summary)).toBeInTheDocument();
    expect(screen.getByText("NLP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lire la publication/ })).toHaveAttribute(
      "rel",
      "noreferrer",
    );
  });

  it("supports nullable tags and URL in a grid", () => {
    render(<PublicationGrid publications={[{ ...publicationFixture, tags: null, url: null }]} />);

    expect(screen.queryByLabelText("Thèmes")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Lire/ })).not.toBeInTheDocument();
  });
});
