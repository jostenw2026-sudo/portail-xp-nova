import type { Metadata } from "next";
import Careers from "@/components/Careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join XP-NOVA — Engineering & Consulting Firm in Yaoundé: engineers, project economists, project managers and a pool of associate experts. Open positions and online application.",
  alternates: { canonical: "/en/carrieres", languages: { fr: "/carrieres", en: "/en/carrieres" } },
};

export default function CareersPage() {
  return <Careers lang="en" />;
}
