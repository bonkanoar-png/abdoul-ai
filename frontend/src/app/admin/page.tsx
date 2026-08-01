import { AdminStatCard } from "@/features/admin/components";
import { adminResourceConfig } from "@/features/admin/config";
import { getAdminCounts } from "@/features/admin/services/admin-services";

export default function AdminDashboardPage() {
  const counts = getAdminCounts();
  return <section aria-labelledby="overview-title"><p className="text-accent-strong text-xs font-bold tracking-[.18em] uppercase">Dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight" id="overview-title">Portfolio Overview</h1><p className="text-muted mt-3 max-w-2xl">Pilotez les contenus du portfolio depuis cette interface CMS mockée, prête pour une future API FastAPI.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Object.entries(counts).map(([resource, value]) => <AdminStatCard key={resource} label={adminResourceConfig[resource as keyof typeof adminResourceConfig].plural} value={value} href={`/admin/${resource}`} />)}</div></section>;
}

