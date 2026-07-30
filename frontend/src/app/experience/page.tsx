import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { ExperienceTimeline } from "@/features/experience";
import { getExperiencesResult } from "@/features/experience/services/get-experiences";

export const metadata: Metadata = {
  title: { absolute: "Expérience — Abdoul AI" },
  description:
    "Parcours professionnel en intelligence artificielle, data science et backend engineering.",
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const result = await getExperiencesResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="experience-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Parcours
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="experience-title"
            >
              Expérience professionnelle
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Des expériences à l’intersection de la data, de l’intelligence artificielle et du
              backend, avec une même exigence de clarté et d’impact.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <ExperienceTimeline experiences={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Parcours bientôt disponible"
                description="Les expériences professionnelles seront publiées prochainement."
              />
            ) : (
              <ErrorState
                title="Parcours momentanément indisponible"
                description="Les expériences ne peuvent pas être affichées pour le moment."
                action={
                  <Button href="/experience" variant="secondary">
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
