import "server-only";

import type { Project } from "@/features/projects/schemas/project.schema";
import { getProjects } from "@/features/projects/services/get-projects";

export async function getProjectBySlug(
  slug: string,
  loadProjects: () => Promise<Project[]> = getProjects,
): Promise<Project | null> {
  const projects = await loadProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
