import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[46rem] items-center overflow-hidden pb-20 pt-32 sm:pt-36"
      id="accueil"
    >
      <div
        className="pointer-events-none absolute -right-28 top-24 -z-10 size-[24rem] rounded-full bg-accent-soft blur-3xl sm:size-[34rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-48 bottom-0 -z-10 size-[25rem] rounded-full bg-warm-soft blur-3xl"
        aria-hidden="true"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-muted backdrop-blur">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            Intelligence claire, impact réel
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[0.98] tracking-[-0.065em] text-ink sm:text-6xl lg:text-7xl">
            L’IA, conçue pour rester{" "}
            <span className="font-serif font-normal italic text-accent-strong">humaine.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl">
            Abdoul AI imagine des expériences numériques sobres et accessibles, où la technologie
            s’efface derrière des interactions simples et utiles.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#approche">Explorer l’approche</Button>
            <Button href="#principes" variant="secondary">
              Voir les principes
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
          <div className="aspect-square rounded-[2.5rem] border border-white/70 bg-surface/75 p-5 shadow-[0_32px_90px_rgba(40,56,50,0.12)] backdrop-blur sm:p-7">
            <div className="flex h-full flex-col justify-between rounded-[1.8rem] bg-ink p-7 text-canvas sm:p-9">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-canvas/55">
                  Abdoul AI
                </span>
                <span className="size-3 rounded-full bg-accent-light shadow-[0_0_24px_rgba(130,220,180,0.8)]" />
              </div>
              <div className="space-y-4">
                <div className="h-2 w-3/5 rounded-full bg-canvas/20" />
                <div className="h-2 w-full rounded-full bg-canvas/10" />
                <div className="h-2 w-4/5 rounded-full bg-canvas/10" />
              </div>
              <p className="max-w-xs text-3xl font-semibold leading-tight tracking-[-0.04em]">
                Comprendre.
                <br />
                Simplifier.
                <br />
                Avancer.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
