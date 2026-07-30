import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProjectPage, { generateMetadata } from "@/app/projects/[slug]/page";
import { projectFixture } from "@/features/projects/project.fixture";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";
import { notFound } from "next/navigation";

vi.mock("@/features/projects/services/get-project-by-slug", () => ({
  getProjectBySlug: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw { digest: "NEXT_HTTP_ERROR_FALLBACK;404" };
  }),
}));

describe("ProjectPage", () => {
  beforeEach(() => vi.mocked(getProjectBySlug).mockReset());

  it("renders a project for a valid slug", async () => {
    vi.mocked(getProjectBySlug).mockResolvedValue(projectFixture);

    render(await ProjectPage({ params: Promise.resolve({ slug: projectFixture.slug }) }));

    expect(
      screen.getByRole("heading", { level: 1, name: projectFixture.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir le code/ })).toHaveAttribute(
      "href",
      projectFixture.github_url,
    );
  });

  it("calls notFound for an unknown slug", async () => {
    vi.mocked(getProjectBySlug).mockResolvedValue(null);

    await expect(
      ProjectPage({ params: Promise.resolve({ slug: "unknown" }) }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    expect(notFound).toHaveBeenCalledOnce();
  });

  it("generates project-specific metadata", async () => {
    vi.mocked(getProjectBySlug).mockResolvedValue(projectFixture);

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: projectFixture.slug }) }),
    ).resolves.toMatchObject({
      title: { absolute: `${projectFixture.title} — Abdoul AI` },
      description: projectFixture.description,
    });
  });

  it("generates safe metadata for an unknown slug", async () => {
    vi.mocked(getProjectBySlug).mockResolvedValue(null);

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "unknown" }) }),
    ).resolves.toMatchObject({
      title: { absolute: "Projet introuvable — Abdoul AI" },
    });
  });
});
