"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminField } from "@/features/admin/config";

export function AdminStatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return <Card className="p-5"><p className="text-muted text-sm font-semibold">{label}</p><p className="mt-2 text-4xl font-bold tracking-tight">{value}</p><a className="text-accent-strong mt-4 inline-block text-sm font-semibold" href={href}>Gérer →</a></Card>;
}

export function AdminBadge({ children }: { children: ReactNode }) { return <Badge variant="accent">{children}</Badge>; }
export function AdminEmptyState({ resource, onCreate }: { resource: string; onCreate: () => void }) { return <div className="border-line rounded-2xl border border-dashed p-10 text-center"><h2 className="text-xl font-bold">Aucun contenu</h2><p className="text-muted mt-2">Créez votre première {resource}.</p><Button className="mt-5" onClick={onCreate}>Ajouter</Button></div>; }

export function AdminModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [onClose]);
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><div className="bg-surface my-auto w-full max-w-3xl rounded-3xl border border-line p-5 shadow-2xl sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><h2 className="text-2xl font-bold" id="admin-modal-title">{title}</h2><button type="button" className="rounded-lg px-3 py-2 text-sm hover:bg-secondary" onClick={onClose} aria-label="Fermer">Fermer</button></div>{children}</div></div>;
}

export function ConfirmDeleteDialog({ name, loading, onCancel, onConfirm }: { name: string; loading: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <AdminModal title={`Supprimer ${name} ?`} onClose={onCancel}><p className="text-muted">Cette action retirera définitivement cet élément du repository mock courant.</p><div className="mt-7 flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Annuler</Button><Button variant="danger" disabled={loading} onClick={onConfirm}>{loading ? "Suppression…" : "Supprimer"}</Button></div></AdminModal>;
}

type FormValue = string | string[];
export function AdminForm({ fields, initial = {}, loading, onCancel, onSubmit }: { fields: AdminField[]; initial?: Record<string, FormValue>; loading: boolean; onCancel: () => void; onSubmit: (values: Record<string, FormValue>) => Promise<Record<string, string> | null> }) {
  const formId = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => { const value = String(data.get(field.key) ?? "").trim(); return [field.key, field.kind === "list" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value]; }));
    setErrors((await onSubmit(values)) ?? {});
  };
  return <form onSubmit={submit} noValidate><div className="grid max-h-[60vh] gap-5 overflow-y-auto pr-1 sm:grid-cols-2">{fields.map((field) => {
    const id = `${formId}-${field.key}`; const initialValue = initial[field.key]; const defaultValue = Array.isArray(initialValue) ? initialValue.join(", ") : initialValue ?? "";
    const classes = "border-line bg-background focus:border-primary min-h-11 w-full rounded-xl border px-3 py-2 outline-none";
    return <div key={field.key} className={field.kind === "textarea" || field.kind === "list" ? "sm:col-span-2" : ""}><label className="mb-2 block text-sm font-semibold" htmlFor={id}>{field.label}</label>{field.kind === "textarea" ? <textarea id={id} name={field.key} defaultValue={defaultValue} className={`${classes} min-h-28`} aria-invalid={Boolean(errors[field.key])} /> : <input id={id} name={field.key} defaultValue={defaultValue} type={field.kind === "date" ? "date" : field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} className={classes} aria-invalid={Boolean(errors[field.key])} />}{field.kind === "list" ? <p className="text-muted mt-1 text-xs">Séparez les valeurs par des virgules.</p> : null}{errors[field.key] ? <p className="text-danger mt-1 text-sm" role="alert">{errors[field.key]}</p> : null}</div>;
  })}</div><div className="mt-7 flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Annuler</Button><Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button></div></form>;
}
