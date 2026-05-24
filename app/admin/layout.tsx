import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Lunaeria | Lunae Hub",
  description:
    "Panneau d'administration Supabase pour piloter Lunaeria.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
