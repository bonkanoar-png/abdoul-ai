import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { PublicationGrid } from "@/features/publications";
import { getPublicationsResult } from "@/features/publications/services/get-publications";

export const metadata: Metadata = {
  title: { absolute: "Publications — Abdoul AI" },
  description:
    "Articles et contenus techniques autour de l'intelligence artificielle, de la data science et du développement logiciel.",
};

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const result = await getPublicationsResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="publications-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Ressources
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="publications-title"
            >
              Publications
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Des retours d’expérience et contenus techniques sur l’IA, la Data et l’ingénierie
              logicielle.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <PublicationGrid publications={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Publications bientôt disponibles"
                description="Les premiers contenus techniques seront publiés prochainement."
              />
            ) : (
              <ErrorState
                title="Publications momentanément indisponibles"
                description="Les publications ne peuvent pas être affichées pour le moment."
                action={
                  <Button href="/publications" variant="secondary">
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
