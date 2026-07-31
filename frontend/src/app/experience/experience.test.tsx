import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ExperiencePage, { metadata } from "@/app/experience/page";
import { getExperiencesResult } from "@/features/experience/services/get-experiences";
import { experienceFixtures } from "@/features/experience/fixtures/experiences";

vi.mock("@/features/experience/services/get-experiences", () => ({
  getExperiencesResult: vi.fn(),
}));

describe("ExperiencePage", () => {
  beforeEach(() => vi.mocked(getExperiencesResult).mockReset());

  it("renders all real experiences in reverse chronological order", async () => {
    vi.mocked(getExperiencesResult).mockResolvedValue({
      status: "success",
      data: experienceFixtures,
    });

    render(await ExperiencePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Expérience professionnelle" }),
    ).toBeInTheDocument();
    for (const experience of experienceFixtures) {
      expect(screen.getByRole("heading", { name: experience.role })).toBeInTheDocument();
      expect(
        screen.getByText(
          (_content, element) =>
            element?.tagName === "P" &&
            element.textContent?.startsWith(`${experience.company} ·`) === true,
        ),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(/Académie d’Aix-Marseille.*Orange, France/)).toBeInTheDocument();
    expect(screen.getByText("Poste actuel")).toBeInTheDocument();
    expect(screen.getByText("novembre 2024")).toBeInTheDocument();
    expect(screen.getAllByText("Python")).toHaveLength(2);
    expect(screen.getByText("BERT / CamemBERT")).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    vi.mocked(getExperiencesResult).mockResolvedValue({ status: "empty" });

    render(await ExperiencePage());

    expect(
      screen.getByRole("heading", { name: "Parcours bientôt disponible" }),
    ).toBeInTheDocument();
  });

  it("renders a safe API error state", async () => {
    vi.mocked(getExperiencesResult).mockResolvedValue({ status: "unavailable" });

    render(await ExperiencePage());

    expect(screen.getByRole("alert")).toHaveTextContent("Parcours momentanément indisponible");
  });

  it("defines the requested metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Expérience — Abdoul AI" } });
  });
});
