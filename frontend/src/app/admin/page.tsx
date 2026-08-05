"use client";

import { useEffect, useState } from "react";

import { StatisticsCard } from "@/features/admin/components";
import { getAdminStatistics, type AdminStatistics } from "@/features/admin/services/admin-api";

export default function AdminDashboardPage() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getAdminStatistics()
      .then(setStatistics)
      .catch(() => setError("Statistiques indisponibles ou permission insuffisante."));
  }, []);
  const cards: [string, keyof AdminStatistics][] = [
    ["Projets", "projects_count"],
    ["Expériences", "experiences_count"],
    ["Formations", "formations_count"],
    ["Documents", "documents_count"],
    ["Publications", "publications_count"],
    ["Utilisateurs", "users_count"],
  ];
  return (
    <section aria-labelledby="overview-title">
      <p className="text-accent-strong text-xs font-bold tracking-[.18em] uppercase">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight" id="overview-title">
        Portfolio Overview
      </h1>
      <p className="text-muted mt-3 max-w-2xl">
        Statistiques calculées par l’API professionnelle du CMS.
      </p>
      {error ? (
        <p role="alert" className="mt-5">
          {error}
        </p>
      ) : null}
      {!statistics && !error ? (
        <p className="mt-8" role="status">
          Chargement…
        </p>
      ) : null}
      {statistics ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, key]) => (
              <StatisticsCard key={key} label={label} value={Number(statistics[key])} />
            ))}
          </div>
          <p className="text-muted mt-6 text-sm">
            Dernière activité :{" "}
            {statistics.last_activity
              ? new Date(statistics.last_activity).toLocaleString("fr-FR")
              : "aucune"}
          </p>
        </>
      ) : null}
    </section>
  );
}
