import type { Metadata } from "next";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: { absolute: "Abdoul AI — Data Scientist & AI Engineer" },
  description: "Portfolio professionnel Data, Intelligence Artificielle et Backend Engineering.",
};

const expertises = [
  {
    title: "Intelligence Artificielle",
    description:
      "Concevoir des systèmes intelligents utiles, explicables et intégrés aux besoins réels.",
  },
  {
    title: "Data Science",
    description:
      "Transformer les données en analyses fiables, décisions éclairées et produits mesurables.",
  },
  {
    title: "Backend Engineering",
    description:
      "Construire des APIs robustes et des architectures maintenables pour soutenir le produit.",
  },
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div
          className="bg-accent-soft pointer-events-none absolute top-12 -right-40 -z-10 size-[32rem] rounded-full blur-3xl"
          aria-hidden="true"
        />
        <Container>
          <div className="max-w-4xl">
            <p className="text-accent-strong text-sm font-bold tracking-[0.2em] uppercase">
              Abdoul
            </p>
            <h1 className="text-ink mt-5 text-5xl leading-[1] font-bold tracking-[-0.06em] text-balance sm:text-6xl lg:text-7xl">
              AI/Data/Backend Engineer
            </h1>
            <p className="text-muted mt-7 max-w-2xl text-xl leading-9 text-pretty">
              Je transforme la donnée et l’intelligence artificielle en produits fiables, portés par
              des architectures backend solides.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/about" size="lg">
                Découvrir mon profil
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                Me contacter
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section className="border-line bg-surface border-y" aria-labelledby="expertises-title">
        <Container>
          <SectionHeading
            eyebrow="Expertises"
            title="De la donnée au produit."
            description="Une approche complète pour analyser, concevoir et déployer des solutions numériques durables."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {expertises.map((expertise) => (
              <Card className="h-full" key={expertise.title}>
                <h3 className="text-ink text-xl font-bold tracking-[-0.03em]">{expertise.title}</h3>
                <p className="text-muted mt-4 leading-7">{expertise.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="cta-title">
        <Container>
          <div className="bg-ink text-canvas overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-12 sm:py-20">
            <h2
              className="max-w-3xl text-4xl font-bold tracking-[-0.05em] text-balance sm:text-5xl"
              id="cta-title"
            >
              Découvrir mon travail et construire la suite.
            </h2>
            <nav className="mt-9 flex flex-wrap gap-3" aria-label="Découvrir le portfolio">
              <Button href="/about" variant="secondary">
                À propos
              </Button>
              <Button href="/projects" variant="secondary">
                Projets
              </Button>
              <Button href="/contact" variant="secondary">
                Contact
              </Button>
            </nav>
          </div>
        </Container>
      </Section>
    </main>
  );
}
