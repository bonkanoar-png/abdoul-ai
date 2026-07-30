import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { ProjectDetails } from "@/features/projects";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      return { title: { absolute: "Projet introuvable — Abdoul AI" } };
    }

    return {
      title: { absolute: `${project.title} — Abdoul AI` },
      description: project.description,
    };
  } catch {
    return { title: { absolute: "Projet — Abdoul AI" } };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    return (
      <main>
        <Section className="pt-24 sm:pt-28">
          <Container>
            <ErrorState
              title="Projet momentanément indisponible"
              description="Ce projet ne peut pas être affiché pour le moment."
              action={
                <Button href="/projects" variant="secondary">
                  Retour aux projets
                </Button>
              }
            />
          </Container>
        </Section>
      </main>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <main>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <ProjectDetails project={project} />
        </Container>
      </Section>
    </main>
  );
}
