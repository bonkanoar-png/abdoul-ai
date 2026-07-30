import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ExperiencePage, { metadata } from "@/app/experience/page";
import { getExperiencesResult } from "@/features/experience/services/get-experiences";
import type { Experience } from "@/features/experience";

vi.mock("@/features/experience/services/get-experiences", () => ({
  getExperiencesResult: vi.fn(),
}));

const experience = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  profile_id: "123e4567-e89b-42d3-a456-426614174001",
  company: "Orange SA",
  role: "Data Analyst NLP / IA",
  description: "Analyse et industrialisation de solutions NLP.",
  start_date: "2024-01-01",
  end_date: null,
  is_current: true,
  sort_order: 1,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
  location: "Paris",
  technologies: ["Python", "NLP"],
} satisfies Experience;

describe("ExperiencePage", () => {
  beforeEach(() => vi.mocked(getExperiencesResult).mockReset());

  it("renders the page and its experiences", async () => {
    vi.mocked(getExperiencesResult).mockResolvedValue({ status: "success", data: [experience] });

    render(await ExperiencePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Expérience professionnelle" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: experience.role })).toBeInTheDocument();
    expect(screen.getByText(/Orange SA · Paris/)).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
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
