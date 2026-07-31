import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { FormationTimeline } from "@/features/formations";
import { getFormationsResult } from "@/features/formations/services/formation-service";

export const metadata: Metadata = {
  title: { absolute: "Formations — Abdoul AI" },
  description:
    "Parcours académique en intelligence artificielle, data science, statistiques et mathématiques.",
};

export default async function FormationsPage() {
  const result = await getFormationsResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="formations-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Éducation
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="formations-title"
            >
              Formations
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Un parcours scientifique construit autour des mathématiques, de la data science et des
              systèmes intelligents.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <FormationTimeline formations={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Formations bientôt disponibles"
                description="Le parcours académique sera publié prochainement."
              />
            ) : (
              <ErrorState
                title="Formations momentanément indisponibles"
                description="Le parcours académique ne peut pas être affiché pour le moment."
                action={
                  <Button href="/formations" variant="secondary">
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
