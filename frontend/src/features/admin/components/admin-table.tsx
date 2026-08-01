"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Row = { id: string } & Record<string, string | string[]>;

export function AdminTable({ rows, columns, labels, onEdit, onDelete }: { rows: Row[]; columns: string[]; labels: Record<string, string>; onEdit: (row: Row) => void; onDelete: (row: Row) => void }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(columns[0] ?? "id");
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = useMemo(() => rows.filter((row) => Object.values(row).flat().join(" ").toLowerCase().includes(query.toLowerCase())).sort((a, b) => String(a[sort] ?? "").localeCompare(String(b[sort] ?? "")) * (ascending ? 1 : -1)), [rows, query, sort, ascending]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectSort = (column: string) => { if (sort === column) setAscending((value) => !value); else { setSort(column); setAscending(true); } };
  return <div><label className="sr-only" htmlFor="admin-search">Rechercher</label><input id="admin-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Rechercher…" className="border-line bg-surface mb-5 min-h-11 w-full max-w-sm rounded-xl border px-4" />
    <div className="border-line overflow-x-auto rounded-2xl border"><table className="w-full min-w-[42rem] border-collapse text-left"><thead className="bg-secondary/70"><tr>{columns.map((column) => <th className="px-4 py-3 text-sm" key={column}><button type="button" onClick={() => selectSort(column)}>{labels[column] ?? column} {sort === column ? (ascending ? "↑" : "↓") : ""}</button></th>)}<th className="px-4 py-3 text-right text-sm">Actions</th></tr></thead><tbody>{visible.map((row) => <tr className="border-line border-t" key={row.id}>{columns.map((column) => <td className="max-w-xs truncate px-4 py-4 text-sm" key={column}>{Array.isArray(row[column]) ? row[column].join(", ") : row[column]}</td>)}<td className="px-4 py-3"><div className="flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => onEdit(row)}>Modifier</Button><Button size="sm" variant="ghost" onClick={() => onDelete(row)}>Supprimer</Button></div></td></tr>)}</tbody></table></div>
    <div className="mt-4 flex items-center justify-between text-sm"><p className="text-muted">{filtered.length} résultat(s) · page {currentPage}/{pages}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={currentPage <= 1} onClick={() => setPage((value) => value - 1)}>Précédent</Button><Button size="sm" variant="secondary" disabled={currentPage >= pages} onClick={() => setPage((value) => value + 1)}>Suivant</Button></div></div>
  </div>;
}

export const ExperienceTable = AdminTable;
export const FormationTable = AdminTable;
export const ProjectTable = AdminTable;

