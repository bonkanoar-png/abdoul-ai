import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navigation = [
  { href: "#approche", label: "Approche" },
  { href: "#principes", label: "Principes" },
] as const;

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <Container className="flex min-h-20 items-center justify-between gap-5 sm:min-h-24">
        <a
          className="text-lg font-bold tracking-[-0.04em] text-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          href="#accueil"
          aria-label="Abdoul AI — Retour à l’accueil"
        >
          Abdoul <span className="text-accent">AI</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {navigation.map((item) => (
            <a
              className="text-sm font-medium text-muted transition hover:text-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button className="min-h-10 px-5 py-2" href="#decouvrir">
          Découvrir
        </Button>
      </Container>
    </header>
  );
}
