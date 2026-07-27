import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Abdoul AI — Une intelligence claire et humaine",
  description:
    "Abdoul AI conçoit des expériences numériques sobres, accessibles et centrées sur l’humain.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
