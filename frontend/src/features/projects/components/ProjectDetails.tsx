import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/features/projects/schemas/project.schema";
import { getProjectCategory } from "@/features/projects/utils/project-filter";

type ProjectDetailsProps = {
  project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <article aria-labelledby="project-title">
      <Badge variant="accent">{getProjectCategory(project)}</Badge>
      <h1
        className="text-ink mt-5 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
        id="project-title"
      >
        {project.title}
      </h1>
      <p className="text-muted mt-6 max-w-3xl text-xl leading-9">{project.description}</p>

      {project.image_url ? (
        <div className="bg-secondary relative mt-12 aspect-[16/8] overflow-hidden rounded-[var(--radius-lg)]">
          <Image
            src={project.image_url}
            alt={`Aperçu du projet ${project.title}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.45fr]">
        <Card>
          <h2 className="text-ink text-2xl font-bold">Résultats et démarche</h2>
          <p className="text-muted mt-5 leading-8 whitespace-pre-line">
            {project.content ?? project.description}
          </p>
        </Card>
        <Card>
          <h2 className="text-ink text-xl font-bold">Technologies</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology.id}>
                <Badge variant="accent">{technology.name}</Badge>
              </li>
            ))}
          </ul>
          {project.github_url || project.demo_url ? (
            <nav className="mt-8 flex flex-wrap gap-3" aria-label="Liens externes du projet">
              {project.demo_url ? (
                <Button href={project.demo_url} rel="noreferrer" target="_blank">
                  Voir la démo (nouvel onglet)
                </Button>
              ) : null}
              {project.github_url ? (
                <Button
                  href={project.github_url}
                  rel="noreferrer"
                  target="_blank"
                  variant="secondary"
                >
                  Voir le code (nouvel onglet)
                </Button>
              ) : null}
            </nav>
          ) : null}
        </Card>
      </div>
    </article>
  );
}
