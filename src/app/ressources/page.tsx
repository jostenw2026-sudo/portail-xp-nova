import type { Metadata } from "next";
import Link from "next/link";
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
        <SectionTitle
          eyebrow="Consultation libre"
          title="Publications interactives"
          intro="Des référentiels techniques consultables directement en ligne, sans inscription."
        />
        <Link
          href="/ressources/procedure-export"
          className="group block rounded-lg border border-line bg-paper p-6 no-underline transition-shadow hover:shadow-lg"
        >
          <p className="eyebrow">Procédure · Export agricole</p>
          <h3 className="title-3 mt-2 text-navy group-hover:text-royal">
            La chaîne d&apos;exportation agricole, étape par étape
          </h3>
          <p className="mt-2 text-grey">
            9 étapes, 6 intervenants et 18 pièces documentaires — du champ à l&apos;entrepôt de
            l&apos;acheteur. Filtrez par acteur, ouvrez le détail de chaque étape, cochez et imprimez
            votre dossier documentaire.
          </p>
          <span className="mt-4 inline-block font-semibold text-royal">Ouvrir la procédure →</span>
        </Link>
      </Section>

      <Section tone="light">
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
