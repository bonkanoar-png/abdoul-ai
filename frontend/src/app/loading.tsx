import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main
      className="min-h-screen pt-36 pb-24"
      aria-busy="true"
      aria-label="Chargement du portfolio"
    >
      <Container>
        <div className="bg-line h-5 w-32 animate-pulse rounded-full" />
        <div className="bg-line mt-8 h-16 max-w-3xl animate-pulse rounded-2xl" />
        <div className="bg-line mt-5 h-6 max-w-xl animate-pulse rounded-full" />
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="bg-line h-72 animate-pulse rounded-[2rem]" />
          <div className="bg-line h-72 animate-pulse rounded-[2rem]" />
        </div>
      </Container>
    </main>
  );
}
