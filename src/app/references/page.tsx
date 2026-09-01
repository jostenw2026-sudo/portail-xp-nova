import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, Callout, Button } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import ReferencesSummary from "@/components/ReferencesSummary";

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
        lead="Un aperçu des projets sur lesquels nos experts sont intervenus — secteurs, pays et périodes. Le détail de chaque mission (maître d'ouvrage, rôle, cadre d'intervention, pièces justificatives) est communiqué sur demande."
      />
      <Breadcrumbs items={[{ label: "Références" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Références", href: "/references" }])} />
      <Section>
        <ReferencesSummary lang="fr" />
        <Callout title="Dossier de références détaillé — sur demande" variant="gold">
          <p>
            Pour chaque projet : maître d&apos;ouvrage, rôle exact, cadre d&apos;intervention,
            attestations et CV au format bailleur. Transmis aux partenaires et maîtres d&apos;ouvrage
            qualifiés, après instruction de la demande.
          </p>
          <div className="mt-4">
            <Button href="/contact" variant="secondary">
              Demander le dossier détaillé
            </Button>
          </div>
        </Callout>
      </Section>
      <CTABanner />
    </>
  );
}
