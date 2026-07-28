"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/lib/constants/navigation";

type MobileMenuProps = {
  items: readonly NavigationItem[];
  pathname: string;
};

export function MobileMenu({ items, pathname }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        className="border-line bg-surface text-foreground hover:bg-secondary inline-flex size-11 items-center justify-center rounded-full border transition"
        type="button"
        aria-controls="navigation-mobile"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex w-5 flex-col gap-1" aria-hidden="true">
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
        </span>
      </button>

      {isOpen ? (
        <>
          <button
            className="fixed inset-0 top-20 z-30 cursor-default bg-black/20 backdrop-blur-sm"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
            tabIndex={-1}
          />
          <div
            ref={panelRef}
            className="border-line bg-surface fixed inset-x-4 top-20 z-40 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border p-3 shadow-2xl sm:left-auto sm:w-80"
            id="navigation-mobile"
          >
            <nav aria-label="Navigation mobile">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    className={`block rounded-2xl px-4 py-3 text-base font-semibold transition ${
                      active
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-secondary focus-visible:bg-secondary"
                    }`}
                    href={item.href}
                    key={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
