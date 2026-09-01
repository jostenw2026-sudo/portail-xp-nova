import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portail",
  description: "Espace sécurisé clients, experts et fournisseurs XP-NOVA.",
  robots: { index: false, follow: false },
};

export default function PortailLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[60vh] bg-light">{children}</div>;
}
