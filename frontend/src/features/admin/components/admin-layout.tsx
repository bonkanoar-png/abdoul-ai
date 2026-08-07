"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { adminNavigation } from "@/features/admin/config";
import { LogoutButton } from "@/features/admin/components/logout-button";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className="space-y-1" aria-label="Navigation administration">{adminNavigation.map(([href, label]) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
    return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-primary text-white" : "text-muted hover:bg-secondary hover:text-foreground"}`}>{label}</Link>;
  })}</nav>;
}

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="border-line bg-surface flex min-h-16 items-center justify-between border-b px-5 lg:px-8">
      <div>
        <p className="text-xs font-bold tracking-[.16em] text-accent-strong uppercase">
          CMS
        </p>
        <p className="font-bold">
          Administration
        </p>
      </div>

      <div className="flex items-center gap-3">
        <LogoutButton />

        <button
          className="border-line rounded-xl border px-3 py-2 text-sm font-semibold lg:hidden"
          type="button"
          onClick={onMenu}
          aria-label="Ouvrir la navigation administration"
        >
          Menu
        </button>
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return <div className="bg-background min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
    <aside className="border-line bg-surface hidden border-r p-5 lg:block"><Link className="mb-8 block text-xl font-bold" href="/admin">Abdoul <span className="text-accent">Admin</span></Link><AdminSidebar /></aside>
    {open ? <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 bg-black/30" aria-label="Fermer la navigation administration" onClick={() => setOpen(false)} /><aside className="bg-surface relative h-full w-[min(86vw,19rem)] overflow-y-auto p-5 shadow-2xl"><p className="mb-7 text-xl font-bold">Abdoul Admin</p><AdminSidebar onNavigate={() => setOpen(false)} /></aside></div> : null}
    <div className="min-w-0"><AdminHeader onMenu={() => setOpen(true)} /><main className="mx-auto max-w-[90rem] p-5 sm:p-8">{children}</main></div>
  </div>;
}

