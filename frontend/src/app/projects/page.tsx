import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { ProjectGrid } from "@/features/projects";
import { getProjectsResult } from "@/features/projects/services/get-projects";

export const metadata: Metadata = {
  title: { absolute: "Projets — Abdoul AI" },
  description:
    "Découvrez les projets en intelligence artificielle, data science, backend et développement web réalisés par Abdoul.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const result = await getProjectsResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="projects-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Réalisations
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="projects-title"
            >
              Projets
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Une sélection de produits Data, IA, Backend et Web conçus pour répondre à des
              problèmes concrets.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <ProjectGrid projects={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Projets bientôt disponibles"
                description="La sélection de projets sera publiée prochainement."
              />
            ) : (
              <ErrorState
                title="Projets momentanément indisponibles"
                description="Les projets ne peuvent pas être affichés pour le moment."
                action={
                  <Button href="/projects" variant="secondary">
                    Réessayer
                  </Button>
                }
              />
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
