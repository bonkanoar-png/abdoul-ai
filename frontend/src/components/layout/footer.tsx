import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-line border-t py-8" aria-label="Pied de page">
      <Container className="text-muted flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground font-semibold">Abdoul AI</p>
          <p className="mt-1">Data, IA et ingénierie backend.</p>
        </div>
        <p>© {new Date().getFullYear()} Abdoul AI. Tous droits réservés.</p>
      </Container>
    </footer>
  );
}
