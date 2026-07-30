import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { SkillGrid } from "@/features/skills";
import { getSkillsResult } from "@/features/skills/services/get-skills";

export const metadata: Metadata = {
  title: { absolute: "Compétences — Abdoul AI" },
  description: "Compétences techniques en IA, Data Science, Backend, Python et développement web.",
};

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const result = await getSkillsResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="skills-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Expertises
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="skills-title"
            >
              Compétences techniques
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Un socle transversal pour concevoir, développer et déployer des produits Data et IA
              robustes.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <SkillGrid skills={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Compétences bientôt disponibles"
                description="Le catalogue des compétences sera publié prochainement."
              />
            ) : (
              <ErrorState
                title="Compétences momentanément indisponibles"
                description="Les compétences ne peuvent pas être affichées pour le moment."
                action={
                  <Button href="/skills" variant="secondary">
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
