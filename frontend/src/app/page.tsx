import { Hero } from "@/components/common/hero";
import { SectionHeading } from "@/components/common/section-heading";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";

const principles = [
  {
    number: "01",
    title: "Clarté",
    description: "Des interfaces lisibles qui donnent la priorité à l’essentiel.",
  },
  {
    number: "02",
    title: "Simplicité",
    description: "Une technologie discrète, au service d’actions naturelles et directes.",
  },
  {
    number: "03",
    title: "Confiance",
    description: "Une expérience cohérente, accessible et respectueuse de chaque personne.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="scroll-mt-10 py-24 sm:py-32" id="approche">
          <Container>
            <SectionHeading
              eyebrow="Notre approche"
              title="La complexité en coulisses. La simplicité au premier plan."
              description="Chaque détail visuel est pensé pour guider sans distraire. Une structure calme, des contrastes maîtrisés et une hiérarchie nette rendent l’expérience immédiatement compréhensible."
            />

            <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <article className="flex min-h-72 flex-col justify-end rounded-[2rem] bg-accent-strong p-7 text-canvas sm:p-10">
                <p className="max-w-2xl text-2xl font-semibold leading-snug tracking-[-0.035em] sm:text-3xl">
                  Une interface efficace ne demande pas d’effort. Elle offre le bon repère, au bon
                  moment.
                </p>
              </article>
              <aside className="flex min-h-72 flex-col justify-between rounded-[2rem] border border-line bg-surface p-7 sm:p-10">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-accent-strong">
                  Notre boussole
                </span>
                <p className="text-xl font-semibold leading-relaxed tracking-[-0.02em] text-ink">
                  Utile avant tout.
                  <br />
                  Accessible par défaut.
                  <br />
                  Humaine à chaque étape.
                </p>
              </aside>
            </div>
          </Container>
        </section>

        <section className="scroll-mt-10 border-y border-line bg-surface py-24 sm:py-32" id="principes">
          <Container>
            <SectionHeading
              align="center"
              eyebrow="Principes"
              title="Une base visuelle faite pour durer."
              description="Trois principes simples structurent l’identité et assurent une expérience cohérente sur chaque écran."
            />

            <ol className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-3">
              {principles.map((principle) => (
                <li className="min-h-64 bg-canvas p-7 sm:p-9" key={principle.number}>
                  <span className="text-sm font-bold text-accent-strong">{principle.number}</span>
                  <h3 className="mt-16 text-2xl font-bold tracking-[-0.04em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-3 leading-7 text-muted">{principle.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="py-24 sm:py-32" id="decouvrir">
          <Container>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center text-canvas sm:px-12 sm:py-24">
              <div
                className="absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-40 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">
                  Abdoul AI
                </p>
                <h2 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">
                  Une première couche simple. Une vision prête à grandir.
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-canvas/65">
                  Une fondation visuelle cohérente, responsive et accessible pour accueillir les
                  prochaines expériences Abdoul AI.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
