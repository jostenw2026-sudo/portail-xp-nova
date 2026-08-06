import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { ressources } from "@/content/ressources";
import RessourceItem from "@/components/RessourceItem";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Ressources : profils, brochures, publications",
  description:
    "Company profile, capability statement, politiques et publications techniques à télécharger ou à demander.",
  alternates: { canonical: "/ressources", languages: { fr: "/ressources", en: "/en/ressources" } },
};

export default function RessourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ressources"
        title="Centre de ressources"
        lead="Nos documents institutionnels et publications techniques sont transmis sur demande : inscrivez-vous, votre demande est validée, puis le document vous est envoyé — une procédure qui nous permet de savoir à qui nous nous adressons."
      />
      <Breadcrumbs items={[{ label: "Ressources" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Ressources", href: "/ressources" }])} />
      <Section>
        <SectionTitle eyebrow="Documents" title="À télécharger ou à demander" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ressources.map((r) => (
            <RessourceItem key={r.key} r={r} />
          ))}
        </div>
      </Section>
      <CTABanner />
    </>
  );
}
