"use client";

import { useState } from "react";
import { z } from "zod";

import { AdminForm } from "@/features/admin/components";
import { profileAdminSchema } from "@/features/admin/schemas/admin.schema";

const fields = [
  { key: "name", label: "Nom" }, { key: "title", label: "Titre" }, { key: "bio", label: "Biographie", kind: "textarea" as const }, { key: "location", label: "Lieu" }, { key: "email", label: "Email", kind: "email" as const }, { key: "github", label: "GitHub", kind: "url" as const }, { key: "linkedin", label: "LinkedIn", kind: "url" as const }, { key: "avatar", label: "Avatar", kind: "url" as const },
];
const initial = { name: "Abdoul", title: "AI/Data/Backend Engineer", bio: "Je transforme la donnée et l’IA en produits fiables.", location: "France", email: "abdoul@example.com", github: "", linkedin: "", avatar: "" };

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Record<string, string | string[]>>(initial); const [saved, setSaved] = useState(false);
  return <section><h1 className="text-3xl font-bold">Profil</h1><p className="text-muted mt-2 mb-8">Informations principales affichées dans le portfolio.</p>{saved ? <p className="mb-5 rounded-xl border border-line bg-surface px-4 py-3" role="status">Profil enregistré.</p> : null}<div className="max-w-3xl rounded-3xl border border-line bg-surface p-6"><AdminForm fields={fields} initial={profile} loading={false} onCancel={() => setProfile(initial)} onSubmit={async (values) => { const result = profileAdminSchema.safeParse(values); if (!result.success) return Object.fromEntries((result.error as z.ZodError).issues.map((issue) => [String(issue.path[0]), issue.message])); setProfile(values); setSaved(true); return null; }} /></div></section>;
}

