import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProjectsPage, { metadata } from "@/app/projects/page";
import { projectFixture } from "@/features/projects/project.fixture";
import { getProjectsResult } from "@/features/projects/services/get-projects";

vi.mock("@/features/projects/services/get-projects", () => ({
  getProjectsResult: vi.fn(),
}));

describe("ProjectsPage", () => {
  beforeEach(() => vi.mocked(getProjectsResult).mockReset());

  it("renders projects returned by the feature service", async () => {
    vi.mocked(getProjectsResult).mockResolvedValue({
      status: "success",
      data: [projectFixture],
    });

    render(await ProjectsPage());

    expect(screen.getByRole("heading", { level: 1, name: "Projets" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: projectFixture.title })).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    vi.mocked(getProjectsResult).mockResolvedValue({ status: "empty" });

    render(await ProjectsPage());

    expect(
      screen.getByRole("heading", { name: "Projets bientôt disponibles" }),
    ).toBeInTheDocument();
  });

  it("renders a safe unavailable state", async () => {
    vi.mocked(getProjectsResult).mockResolvedValue({ status: "unavailable" });

    render(await ProjectsPage());

    expect(screen.getByRole("alert")).toHaveTextContent("Projets momentanément indisponibles");
  });

  it("defines Projects metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Projets — Abdoul AI" } });
  });
});
