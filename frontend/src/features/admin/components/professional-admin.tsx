"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { uploadAdminFile } from "@/features/admin/services/admin-api";
import type { AssociatedMedia } from "@/features/admin/services/admin-api";

export function FileUploader({
  kind = "documents",
  onUploaded,
}: {
  kind?: "documents" | "media";
  onUploaded?: (file: { id: string; filename: string; url: string }) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function upload(file?: File) {
    if (!file) return;
    setState("loading");
    try {
      const result = await uploadAdminFile(file, kind);
      setState("success");
      onUploaded?.(result);
    } catch {
      setState("error");
    }
  }
  return (
    <div className="border-line bg-surface rounded-2xl border p-5">
      <label className="block font-semibold" htmlFor={`${kind}-upload`}>
        Choisir un fichier
      </label>
      <input
        id={`${kind}-upload`}
        className="mt-3 block w-full"
        type="file"
        accept={
          kind === "media"
            ? "image/png,image/jpeg,image/webp"
            : "application/pdf,image/png,image/jpeg,image/webp"
        }
        disabled={state === "loading"}
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {state !== "idle" ? (
        <p className="mt-3 text-sm" role="status">
          {state === "loading"
            ? "Envoi…"
            : state === "success"
              ? "Fichier enregistré."
              : "Échec de l’envoi."}
        </p>
      ) : null}
    </div>
  );
}

export function MediaGallery({
  items,
  onDelete,
}: {
  items: { id: string; url: string; alt_text: string }[];
  onDelete?: (id: string) => void;
}) {
  if (!items.length) return <p className="text-muted">Aucun média.</p>;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li className="border-line rounded-xl border p-3" key={item.id}>
          <Image
            className="aspect-video w-full rounded-lg object-cover"
            src={item.url}
            alt={item.alt_text}
            width={640}
            height={360}
            unoptimized
          />
          {onDelete ? (
            <Button variant="danger" onClick={() => onDelete(item.id)}>
              Supprimer
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-semibold">Contenu Markdown</span>
      <textarea
        className="border-line mt-2 min-h-64 w-full rounded-xl border p-4 font-mono text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={20_000}
      />
      <span className="text-muted mt-2 block text-xs">
        Le Markdown est stocké comme texte et n’est jamais injecté comme HTML non sécurisé.
      </span>
    </label>
  );
}

export function PermissionGuard({ allowed, children }: { allowed: boolean; children: ReactNode }) {
  return allowed ? children : null;
}

export function AuditTable({
  rows,
}: {
  rows: { id: string; actor_email: string; action: string; resource: string; created_at: string }[];
}) {
  if (!rows.length) return <p className="text-muted">Aucune activité.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Acteur</th>
            <th>Action</th>
            <th>Ressource</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.actor_email}</td>
              <td>{row.action}</td>
              <td>{row.resource}</td>
              <td>{new Date(row.created_at).toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatisticsCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="border-line bg-surface rounded-2xl border p-5">
      <p className="text-muted text-sm">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}

export function MediaSelector({
  media,
  onSelect,
}: {
  media: AssociatedMedia[];
  onSelect: (id: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-semibold">Ajouter un média existant</span>
      <select
        className="border-line mt-2 w-full rounded-xl border p-3"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) onSelect(event.target.value);
        }}
      >
        <option value="" disabled>
          Sélectionner…
        </option>
        {media.map((item) => (
          <option key={item.id} value={item.id}>
            {item.alt_text || item.id}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PrimaryMediaPicker({
  items,
  onChange,
}: {
  items: AssociatedMedia[];
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-semibold">Image principale</legend>
      {items.map((item, index) => (
        <label className="mr-4 inline-flex gap-2" key={item.id}>
          <input
            type="radio"
            name="primary-media"
            checked={index === 0}
            onChange={() => onChange(item.id)}
          />
          {item.alt_text || "Média"}
        </label>
      ))}
    </fieldset>
  );
}

export function MediaGalleryManager({
  items,
  onDetach,
  onReorder,
}: {
  items: AssociatedMedia[];
  onDetach: (id: string) => void;
  onReorder: (id: string, order: number) => void;
}) {
  if (!items.length) return <p className="text-muted">Aucun média associé.</p>;
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          className="border-line flex items-center justify-between rounded-xl border p-3"
          key={item.id}
        >
          <span>{item.alt_text || item.id}</span>
          <span className="flex gap-2">
            <Button
              variant="secondary"
              disabled={index === 0}
              onClick={() => onReorder(item.id, index - 1)}
            >
              Monter
            </Button>
            <Button variant="danger" onClick={() => onDetach(item.id)}>
              Détacher
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
}
