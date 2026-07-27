import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-line border-t py-8">
      <Container className="text-muted flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink font-semibold">Abdoul AI</p>
        <p>Une interface pensée pour rendre l’intelligence artificielle plus lisible.</p>
      </Container>
    </footer>
  );
}
