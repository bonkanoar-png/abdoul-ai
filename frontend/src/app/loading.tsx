import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main className="min-h-screen pb-24 pt-36" aria-busy="true" aria-label="Chargement du portfolio">
      <Container>
        <div className="h-5 w-32 animate-pulse rounded-full bg-line" />
        <div className="mt-8 h-16 max-w-3xl animate-pulse rounded-2xl bg-line" />
        <div className="mt-5 h-6 max-w-xl animate-pulse rounded-full bg-line" />
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="h-72 animate-pulse rounded-[2rem] bg-line" />
          <div className="h-72 animate-pulse rounded-[2rem] bg-line" />
        </div>
      </Container>
    </main>
  );
}
