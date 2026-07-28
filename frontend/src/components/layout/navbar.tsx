import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navigation = [
  { href: "#approche", label: "Approche" },
  { href: "#principes", label: "Principes" },
] as const;

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return navigation.map((item) => (
    <a
      className={`text-muted hover:text-foreground rounded-sm text-sm font-medium transition ${mobile ? "block px-4 py-3" : ""}`}
      href={item.href}
      key={item.href}
    >
      {item.label}
    </a>
  ));
}

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <Container className="flex min-h-20 items-center justify-between gap-4 sm:min-h-24">
        <a
          className="text-foreground rounded-sm text-lg font-bold tracking-[-0.04em]"
          href="#accueil"
          aria-label="Abdoul AI — Retour à l’accueil"
        >
          Abdoul <span className="text-accent">AI</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          <NavigationLinks />
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" href="#decouvrir" size="sm">
            Découvrir
          </Button>
          <details className="relative md:hidden">
            <summary className="border-line bg-surface text-foreground flex min-h-11 cursor-pointer list-none items-center rounded-full border px-4 text-sm font-semibold">
              Menu
            </summary>
            <nav
              className="border-line bg-surface absolute top-14 right-0 min-w-48 rounded-2xl border p-2 shadow-xl"
              aria-label="Navigation mobile"
            >
              <NavigationLinks mobile />
              <Button className="mt-2 w-full" href="#decouvrir" size="sm">
                Découvrir
              </Button>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
