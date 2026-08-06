import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { CardMetier } from "@/components/cards";
import { metiers } from "@/content/metiers";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Métiers d'ingénierie : études, AMO, MOE",
  description:
    "7 métiers pour sécuriser vos projets : études, ingénierie, AMO/AMOA, maîtrise d'œuvre, structuration, suivi-évaluation, formation.",
  alternates: { canonical: "/metiers", languages: { fr: "/metiers", en: "/en/metiers" } },
};

export default function MetiersPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos métiers"
        title="Une ingénierie complète au service des projets"
        lead="Sept métiers qui couvrent tout le cycle de vie d'un projet, de l'étude amont à la mesure d'impact."
      />
      <Breadcrumbs items={[{ label: "Nos métiers" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Nos métiers", href: "/metiers" }])} />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metiers.map((m) => (
            <CardMetier key={m.slug} m={m} />
          ))}
        </div>
      </Section>
      <CTABanner />
    </>
  );
}
