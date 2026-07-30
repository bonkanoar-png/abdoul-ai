"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFilters } from "@/features/projects/components/ProjectFilters";
import type { Project } from "@/features/projects/schemas/project.schema";
import { filterProjects, getProjectCategory } from "@/features/projects/utils/project-filter";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [category, setCategory] = useState("Tous");
  const [technology, setTechnology] = useState("Toutes");

  const categories = useMemo(
    () => [...new Set(projects.map(getProjectCategory))].sort(),
    [projects],
  );
  const technologies = useMemo(
    () =>
      [
        ...new Set(projects.flatMap((project) => project.technologies.map((item) => item.name))),
      ].sort(),
    [projects],
  );
  const filteredProjects = filterProjects(projects, { category, technology });

  return (
    <div>
      <ProjectFilters
        categories={categories}
        technologies={technologies}
        category={category}
        technology={technology}
        onCategoryChange={setCategory}
        onTechnologyChange={setTechnology}
      />
      {filteredProjects.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2" aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      ) : (
        <div className="mt-8" aria-live="polite">
          <EmptyState
            title="Aucun projet trouvé"
            description="Modifiez les filtres pour afficher d’autres projets."
          />
        </div>
      )}
    </div>
  );
}
