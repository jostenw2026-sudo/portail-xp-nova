import type { Metadata } from "next";
import { portal } from "@/content/portal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(portal.url),
  title: "XP-NOVA — Bureau d'Ingénierie Conseil | Agriculture & Territoires",
  description:
    "XP-NOVA, Bureau d'Ingénierie Conseil : une même ingénierie, deux domaines d'application — AGROVITA (agriculture & agro-industrie) et ODT (développement territorial). Yaoundé, Cameroun.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: portal.url,
    title: "XP-NOVA — Bureau d'Ingénierie Conseil",
    description: "Une même ingénierie, deux domaines d'application : AGROVITA et ODT.",
    images: [{ url: "/brand/og-portail.svg", width: 1200, height: 630 }],
    locale: "fr_FR",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
