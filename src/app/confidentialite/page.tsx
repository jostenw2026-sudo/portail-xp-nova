import type { Metadata } from "next";
import { PageHero, Breadcrumbs } from "@/components/blocks";
import { Section } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et gestion des données personnelles de XP-NOVA.",
  alternates: { canonical: "/confidentialite" },
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero eyebrow="Données personnelles" title="Politique de confidentialité" />
      <Breadcrumbs items={[{ label: "Confidentialité" }]} />
      <Section>
        <div className="prose-x max-w-3xl">
          <h2 className="title-3 text-navy">Données collectées</h2>
          <p>
            Le formulaire de contact collecte les seules données nécessaires au traitement de votre
            demande : nom, organisation, e-mail, téléphone, pays, type d&apos;organisation, objet et
            message. Aucune donnée n&apos;est utilisée à d&apos;autres fins.
          </p>
          <h2 className="title-3 text-navy mt-8">Finalité et conservation</h2>
          <p>
            Vos données servent uniquement à répondre à votre sollicitation et à assurer le suivi
            commercial. Elles ne sont ni revendues, ni cédées à des tiers.
          </p>
          <h2 className="title-3 text-navy mt-8">Cookies et mesure d&apos;audience</h2>
          <p>
            Les outils de mesure d&apos;audience ne sont activés qu&apos;après votre consentement. Vous
            pouvez le retirer à tout moment.
          </p>
          <h2 className="title-3 text-navy mt-8">Vos droits</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
            données. Pour l&apos;exercer, écrivez à {site.email}.
          </p>
        </div>
      </Section>
    </>
  );
}
