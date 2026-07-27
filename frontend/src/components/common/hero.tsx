import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[46rem] items-center overflow-hidden pt-32 pb-20 sm:pt-36"
      id="accueil"
    >
      <div
        className="bg-accent-soft pointer-events-none absolute top-24 -right-28 -z-10 size-[24rem] rounded-full blur-3xl sm:size-[34rem]"
        aria-hidden="true"
      />
      <div
        className="bg-warm-soft pointer-events-none absolute bottom-0 -left-48 -z-10 size-[25rem] rounded-full blur-3xl"
        aria-hidden="true"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <p className="border-line bg-surface/70 text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase backdrop-blur">
            <span className="bg-accent size-2 rounded-full" aria-hidden="true" />
            Intelligence claire, impact réel
          </p>
          <h1 className="text-ink max-w-4xl text-5xl leading-[0.98] font-bold tracking-[-0.065em] text-balance sm:text-6xl lg:text-7xl">
            L’IA, conçue pour rester{" "}
            <span className="text-accent-strong font-serif font-normal italic">humaine.</span>
          </h1>
          <p className="text-muted mt-7 max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
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
          <div className="bg-surface/75 aspect-square rounded-[2.5rem] border border-white/70 p-5 shadow-[0_32px_90px_rgba(40,56,50,0.12)] backdrop-blur sm:p-7">
            <div className="bg-ink text-canvas flex h-full flex-col justify-between rounded-[1.8rem] p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <span className="text-canvas/55 text-xs font-bold tracking-[0.2em] uppercase">
                  Abdoul AI
                </span>
                <span className="bg-accent-light size-3 rounded-full shadow-[0_0_24px_rgba(130,220,180,0.8)]" />
              </div>
              <div className="space-y-4">
                <div className="bg-canvas/20 h-2 w-3/5 rounded-full" />
                <div className="bg-canvas/10 h-2 w-full rounded-full" />
                <div className="bg-canvas/10 h-2 w-4/5 rounded-full" />
              </div>
              <p className="max-w-xs text-3xl leading-tight font-semibold tracking-[-0.04em]">
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
