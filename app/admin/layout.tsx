import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Lunaeria | Lunae Hub",
  description:
    "Premier panneau d'administration mock pour piloter Lunaeria.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
