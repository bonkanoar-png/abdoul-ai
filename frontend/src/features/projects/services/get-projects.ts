import "server-only";

import { projectsSchema, type Project } from "@/features/projects/schemas/project.schema";
import { apiClient } from "@/lib/api/client";

export type ProjectsResult =
  { status: "success"; data: Project[] } | { status: "empty" } | { status: "unavailable" };

export async function getProjects(): Promise<Project[]> {
  return projectsSchema.parse(await apiClient.get("/api/v1/projects"));
}

export async function getProjectsResult(
  loadProjects: () => Promise<Project[]> = getProjects,
): Promise<ProjectsResult> {
  try {
    const projects = projectsSchema.parse(await loadProjects());
    return projects.length > 0 ? { status: "success", data: projects } : { status: "empty" };
  } catch {
    return { status: "unavailable" };
  }
}
