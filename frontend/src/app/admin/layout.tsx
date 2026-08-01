import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLayout } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

