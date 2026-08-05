export default function SettingsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="border-line bg-surface mt-8 rounded-2xl border p-6">
        <h2 className="font-bold">Mode de données</h2>
        <p className="text-muted mt-2">
          API FastAPI sécurisée par cookie HttpOnly, persistance PostgreSQL et stockage de fichiers
          abstrait.
        </p>
      </div>
    </section>
  );
}
