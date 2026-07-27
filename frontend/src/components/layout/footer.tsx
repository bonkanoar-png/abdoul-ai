import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-ink">Abdoul AI</p>
        <p>Une interface pensée pour rendre l’intelligence artificielle plus lisible.</p>
      </Container>
    </footer>
  );
}
