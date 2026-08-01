"use client";

import { useEffect, useMemo, useState } from "react";
import type { ZodError } from "zod";

import { Button } from "@/components/ui/button";
import { adminResourceConfig } from "@/features/admin/config";
import { adminSchemas, type AdminResourceName } from "@/features/admin/schemas/admin.schema";
import { adminServices } from "@/features/admin/services/admin-services";
import { AdminTable } from "@/features/admin/components/admin-table";
import { AdminEmptyState, AdminForm, AdminModal, ConfirmDeleteDialog } from "@/features/admin/components/admin-ui";

type Row = { id: string } & Record<string, string | string[]>;

export function AdminResourceManager({ resource }: { resource: AdminResourceName }) {
  const config = adminResourceConfig[resource];
  const repository = adminServices[resource];
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null | undefined>();
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const labels = useMemo(() => Object.fromEntries(config.fields.map((field) => [field.key, field.label])), [config.fields]);
  const refresh = async () => { setRows(await repository.getAll()); };
  useEffect(() => {
    let active = true;
    repository.getAll().then((records) => { if (active) setRows(records); }).catch(() => { if (active) setFeedback("Impossible de charger les données."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [repository]);
  const submit = async (values: Record<string, string | string[]>) => {
    setLoading(true); setFeedback("");
    const parsed = adminSchemas[resource].safeParse(values);
    if (!parsed.success) { setLoading(false); return Object.fromEntries((parsed.error as ZodError).issues.map((issue) => [String(issue.path[0]), issue.message])); }
    try { if (editing?.id) await repository.update(editing.id, values); else await repository.create(values); await refresh(); setEditing(undefined); setFeedback(editing?.id ? "Modification enregistrée." : "Contenu créé."); return null; } catch { setFeedback("L’enregistrement a échoué."); return {}; } finally { setLoading(false); }
  };
  const remove = async () => { if (!deleting) return; setLoading(true); try { await repository.remove(deleting.id); await refresh(); setDeleting(null); setFeedback("Contenu supprimé."); } catch { setFeedback("La suppression a échoué."); } finally { setLoading(false); } };
  return <section aria-labelledby="resource-title"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-accent-strong text-xs font-bold tracking-[.18em] uppercase">Contenu</p><h1 className="mt-2 text-3xl font-bold tracking-tight" id="resource-title">{config.plural}</h1><p className="text-muted mt-2">Créez, recherchez, modifiez et supprimez vos {config.plural.toLowerCase()}.</p></div><Button onClick={() => setEditing(null)}>Ajouter une {config.singular}</Button></div>
    {feedback ? <p className="border-line bg-surface mb-5 rounded-xl border px-4 py-3 text-sm" role="status">{feedback}</p> : null}
    {loading && rows.length === 0 ? <p role="status">Chargement…</p> : rows.length === 0 ? <AdminEmptyState resource={config.singular} onCreate={() => setEditing(null)} /> : <AdminTable rows={rows} columns={config.columns} labels={labels} onEdit={setEditing} onDelete={setDeleting} />}
    {editing !== undefined ? <AdminModal title={editing ? `Modifier une ${config.singular}` : `Ajouter une ${config.singular}`} onClose={() => setEditing(undefined)}><AdminForm fields={config.fields} initial={editing ?? {}} loading={loading} onCancel={() => setEditing(undefined)} onSubmit={submit} /></AdminModal> : null}
    {deleting ? <ConfirmDeleteDialog name={String(deleting[config.columns[0] ?? "id"])} loading={loading} onCancel={() => setDeleting(null)} onConfirm={remove} /> : null}
  </section>;
}

export const ExperienceForm = AdminForm;
export const FormationForm = AdminForm;
export const ProjectForm = AdminForm;
export const SkillForm = AdminForm;
export const PublicationForm = AdminForm;
export const CertificationForm = AdminForm;
