import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PublicationsPage, { metadata } from "@/app/publications/page";
import { getPublicationsResult } from "@/features/publications/services/get-publications";

vi.mock("@/features/publications/services/get-publications", () => ({
  getPublicationsResult: vi.fn(),
}));

const publication = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  title: "Industrialiser un modèle NLP",
  slug: "industrialiser-modele-nlp",
  summary: "Du prototype au service fiable.",
  content: "Contenu",
  published_at: "2026-07-01T10:00:00Z",
  url: "https://example.com/nlp",
  tags: ["NLP", "Backend"],
};

describe("PublicationsPage", () => {
  beforeEach(() => vi.mocked(getPublicationsResult).mockReset());

  it("renders publication data", async () => {
    vi.mocked(getPublicationsResult).mockResolvedValue({
      status: "success",
      data: [publication],
    });

    render(await PublicationsPage());

    expect(screen.getByRole("heading", { level: 1, name: "Publications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: publication.title })).toBeInTheDocument();
    expect(screen.getByText("NLP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lire la publication/ })).toHaveAttribute(
      "href",
      publication.url,
    );
  });

  it("renders empty and unavailable states", async () => {
    vi.mocked(getPublicationsResult).mockResolvedValueOnce({ status: "empty" });
    const { unmount } = render(await PublicationsPage());
    expect(
      screen.getByRole("heading", { name: "Publications bientôt disponibles" }),
    ).toBeInTheDocument();
    unmount();

    vi.mocked(getPublicationsResult).mockResolvedValueOnce({ status: "unavailable" });
    render(await PublicationsPage());
    expect(screen.getByRole("alert")).toHaveTextContent("Publications momentanément indisponibles");
  });

  it("defines Publications metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Publications — Abdoul AI" } });
  });
});
