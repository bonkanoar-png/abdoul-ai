"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { loginAdmin } from "@/features/admin/services/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await loginAdmin(String(data.get("email")), String(data.get("password")));
      router.replace("/admin");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="border-line bg-surface mx-auto max-w-lg rounded-3xl border p-8">
      <h1 className="text-3xl font-bold">Connexion admin</h1>
      <p className="text-muted mt-3">Utilisez votre compte administrateur pour accéder au CMS.</p>
      <form className="mt-7 space-y-5" onSubmit={submit}>
        {error ? <p role="alert">{error}</p> : null}
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input
            className="border-line mt-2 w-full rounded-xl border px-4 py-3"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Mot de passe</span>
          <input
            className="border-line mt-2 w-full rounded-xl border px-4 py-3"
            name="password"
            type="password"
            minLength={12}
            autoComplete="current-password"
            required
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </section>
  );
}
