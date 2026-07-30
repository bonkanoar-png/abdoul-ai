import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { CertificationTimeline } from "@/features/certifications";
import { getCertificationsResult } from "@/features/certifications/services/get-certifications";

export const metadata: Metadata = {
  title: { absolute: "Certifications — Abdoul AI" },
  description:
    "Certifications professionnelles en intelligence artificielle, data science et technologies numériques.",
};

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const result = await getCertificationsResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="certifications-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Validation
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="certifications-title"
            >
              Certifications
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Des compétences validées en intelligence artificielle, Data, Cloud et pratiques
              d’ingénierie.
            </p>
          </div>

          <div className="mt-14">
            {result.status === "success" ? (
              <CertificationTimeline certifications={result.data} />
            ) : result.status === "empty" ? (
              <EmptyState
                title="Certifications bientôt disponibles"
                description="Les certifications professionnelles seront ajoutées prochainement."
              />
            ) : (
              <ErrorState
                title="Certifications momentanément indisponibles"
                description="Les certifications ne peuvent pas être affichées pour le moment."
                action={
                  <Button href="/certifications" variant="secondary">
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
