import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import ReferencesList from "./ReferencesList";

export const metadata: Metadata = {
  title: "Références projets",
  description:
    "Aéroports, équipements publics, bâtiments, énergie, eau : les références de nos experts dans 6 pays d'Afrique.",
  alternates: { canonical: "/references", languages: { fr: "/references", en: "/en/references" } },
};

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Références"
        title="Des projets réalisés dans des contextes variés"
        lead="Chaque fiche précise son cadre d'intervention : qui a contracté, dans quel rôle, avec quels résultats. La transparence est notre première preuve."
      />
      <Breadcrumbs items={[{ label: "Références" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Références", href: "/references" }])} />
      <Section>
        <ReferencesList />
      </Section>
      <CTABanner />
    </>
  );
}
