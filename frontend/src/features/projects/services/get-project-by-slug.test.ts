import { describe, expect, it, vi } from "vitest";

import { projectFixture } from "@/features/projects/project.fixture";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";

describe("getProjectBySlug", () => {
  it("finds a project locally from the projects list", async () => {
    const loadProjects = vi.fn().mockResolvedValue([projectFixture]);

    await expect(getProjectBySlug(projectFixture.slug, loadProjects)).resolves.toEqual(
      projectFixture,
    );
    expect(loadProjects).toHaveBeenCalledOnce();
  });

  it("returns null for an unknown slug", async () => {
    await expect(getProjectBySlug("unknown", async () => [projectFixture])).resolves.toBeNull();
  });
});
