"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "@/components/ui/container";
import { navigationItems } from "@/lib/constants/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-line bg-background/90 sticky inset-x-0 top-0 z-20 border-b backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-3">
        <Link
          className="text-foreground rounded-sm text-lg font-bold tracking-[-0.04em]"
          href="/"
          aria-label="Abdoul AI — Retour à l’accueil"
        >
          Abdoul <span className="text-accent">AI</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
          {navigationItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-secondary hover:text-foreground"
                }`}
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu items={navigationItems} pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
