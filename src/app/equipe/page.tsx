import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, Callout, Button } from "@/components/ui";
import Organigramme from "@/components/Organigramme";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Organisation & équipe",
  description:
    "L'organisation de XP-NOVA : direction, noyau permanent et réseau d'experts associés mobilisables. Profils et CV détaillés (format bailleur) sur demande.",
  alternates: { canonical: "/equipe", languages: { fr: "/equipe", en: "/en/equipe" } },
};

export default function EquipePage() {
  return (
    <>
      <PageHero
        eyebrow="Organisation"
        title="Une organisation, un réseau d'experts"
        lead="Un noyau permanent et un réseau d'experts associés mobilisables, aux profils conformes aux standards des bailleurs. Les CV détaillés sont fournis sur demande."
      />
      <Breadcrumbs items={[{ label: "Équipe" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Équipe", href: "/equipe" }])} />

      <Section>
        <Organigramme lang="fr" />
      </Section>

      <Section tone="light">
        <Callout title="Profils & CV — sur demande" variant="gold">
          <p>
            Au-delà de son noyau permanent, XP-NOVA mobilise des experts associés et les capacités
            contractualisées de ses associés et de tiers, par engagement écrit — pour répondre en
            groupement comme en direct, aux exigences des procédures de passation. Les CV complets au
            format bailleur sont transmis sur demande, dans le cadre d&apos;une consultation ou d&apos;un
            appel d&apos;offres.
          </p>
          <div className="mt-4">
            <Button href="/contact" variant="secondary">
              Demander les profils
            </Button>
          </div>
        </Callout>
      </Section>

      <CTABanner />
    </>
  );
}
