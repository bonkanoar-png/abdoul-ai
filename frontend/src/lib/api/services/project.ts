import { apiClient } from "@/lib/api/client";
import { projectsSchema } from "@/schemas/project";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return projectsSchema.parse(await apiClient.get("/api/v1/projects"));
}
