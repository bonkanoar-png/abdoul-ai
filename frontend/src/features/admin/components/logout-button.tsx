"use client";

import { useRouter } from "next/navigation";

import { logoutAdmin } from "@/features/admin/services/admin-api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="border-line rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-secondary"
    >
      Déconnexion
    </button>
  );
}