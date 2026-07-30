import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SkillsPage, { metadata } from "@/app/skills/page";
import { getSkillsResult } from "@/features/skills/services/get-skills";
import type { Skill } from "@/features/skills";

vi.mock("@/features/skills/services/get-skills", () => ({
  getSkillsResult: vi.fn(),
}));

const skills = [
  {
    id: "123e4567-e89b-42d3-a456-426614174000",
    name: "Python",
    category: "Backend Engineering",
    sort_order: 1,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-02T10:00:00Z",
    level: "Avancé",
    icon: null,
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174001",
    name: "PyTorch",
    category: "AI & Machine Learning",
    sort_order: 2,
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-02T10:00:00Z",
  },
] satisfies Skill[];

describe("SkillsPage", () => {
  beforeEach(() => vi.mocked(getSkillsResult).mockReset());

  it("renders categories, badges and nullable skill data", async () => {
    vi.mocked(getSkillsResult).mockResolvedValue({ status: "success", data: skills });

    render(await SkillsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Compétences techniques" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Backend Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI & Machine Learning" })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText(/Avancé/)).toBeInTheDocument();
    expect(screen.getByText("PyTorch")).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    vi.mocked(getSkillsResult).mockResolvedValue({ status: "empty" });

    render(await SkillsPage());

    expect(
      screen.getByRole("heading", { name: "Compétences bientôt disponibles" }),
    ).toBeInTheDocument();
  });

  it("renders a safe unavailable state", async () => {
    vi.mocked(getSkillsResult).mockResolvedValue({ status: "unavailable" });

    render(await SkillsPage());

    expect(screen.getByRole("alert")).toHaveTextContent("Compétences momentanément indisponibles");
  });

  it("defines the requested metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Compétences — Abdoul AI" } });
  });
});
