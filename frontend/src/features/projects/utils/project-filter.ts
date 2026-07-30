import type { Project } from "@/features/projects/schemas/project.schema";

export type ProjectFiltersValue = {
  category: string;
  technology: string;
};

export function getProjectCategory(project: Project): string {
  return project.category ?? project.technologies[0]?.category ?? "Autre";
}

export function filterProjects(
  projects: Project[],
  { category, technology }: ProjectFiltersValue,
): Project[] {
  return projects.filter((project) => {
    const matchesCategory = category === "Tous" || getProjectCategory(project) === category;
    const matchesTechnology =
      technology === "Toutes" || project.technologies.some((item) => item.name === technology);
    return matchesCategory && matchesTechnology;
  });
}
