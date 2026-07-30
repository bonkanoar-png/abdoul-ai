import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/features/projects/schemas/project.schema";
import { getProjectCategory } from "@/features/projects/utils/project-filter";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article aria-labelledby={`project-${project.id}`}>
      <Card className="flex h-full flex-col overflow-hidden p-0">
        {project.image_url ? (
          <div className="bg-secondary relative aspect-[16/9]">
            <Image
              src={project.image_url}
              alt={`Aperçu du projet ${project.title}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="bg-accent-soft text-accent-strong flex aspect-[16/9] items-center justify-center text-sm font-bold tracking-[0.16em] uppercase"
            role="img"
            aria-label={`Aucun aperçu disponible pour ${project.title}`}
          >
            Projet
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <Badge className="w-fit" variant="neutral">
            {getProjectCategory(project)}
          </Badge>
          <h2
            className="text-ink mt-5 text-2xl font-bold tracking-[-0.03em]"
            id={`project-${project.id}`}
          >
            {project.title}
          </h2>
          <p className="text-muted mt-3 leading-7">
            {project.short_description ?? project.description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((technology) => (
              <li key={technology.id}>
                <Badge variant="accent">{technology.name}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-7">
            <Button href={`/projects/${project.slug}`} variant="secondary">
              Découvrir le projet
            </Button>
          </div>
        </div>
      </Card>
    </article>
  );
}
