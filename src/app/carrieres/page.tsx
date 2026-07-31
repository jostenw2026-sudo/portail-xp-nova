import type { Metadata } from "next";
import Careers from "@/components/Careers";

export const metadata: Metadata = {
  title: "Carrières",
  description:
    "Rejoignez XP-NOVA — Bureau d'Ingénierie Conseil à Yaoundé : ingénieurs, économistes-financiers, chefs de projet et vivier d'associés experts. Postes ouverts et candidature en ligne.",
  alternates: { canonical: "/carrieres", languages: { fr: "/carrieres", en: "/en/carrieres" } },
};

export default function CarrieresPage() {
  return <Careers lang="fr" />;
}
