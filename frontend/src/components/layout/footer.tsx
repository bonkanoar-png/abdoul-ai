import Link from "next/link";

import { Container } from "@/components/ui/container";
import { navigationItems } from "@/lib/constants/navigation";

export function Footer() {
  return (
    <footer className="border-line border-t py-8" aria-label="Pied de page">
      <Container className="text-muted grid gap-8 text-sm lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-foreground font-semibold">Abdoul AI</p>
          <p className="mt-1">Data, IA et ingénierie backend.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Navigation secondaire">
          {navigationItems.slice(1).map((item) => (
            <Link className="hover:text-foreground transition" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="lg:col-span-2">
          © {new Date().getFullYear()} Abdoul AI. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
