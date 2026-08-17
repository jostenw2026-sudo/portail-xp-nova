import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import ProcedureExport from "@/components/ProcedureExport";
import {
  INSTITUTIONS_CM,
  PROCEDURE_ACTEURS,
  PROCEDURE_ETAPES,
  REPERES_CM_AVERTISSEMENT,
  tousLesDocuments,
} from "@/content/procedure-export";

export const metadata: Metadata = {
  title: "Procédure d'exportation agricole",
  description:
    "La chaîne d'exportation agricole étape par étape : 9 étapes, 6 intervenants et 18 pièces documentaires, du champ à l'acheteur, avec les repères camerounais (GUCE, CAMCIS, MINADER, MINEPIA, CCIMA, ANOR, ONCC) et les points de vigilance sanitaires et douaniers.",
  alternates: { canonical: "/ressources/procedure-export" },
};

const NB_DOCS = tousLesDocuments().length;

/** Balisage HowTo — la procédure est une suite d'étapes ordonnées. */
const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Procédure d'exportation agricole",
  description:
    "Les 9 étapes de la chaîne d'exportation agricole, de la récolte à la livraison chez l'acheteur, avec les documents exigés à chaque étape.",
  step: PROCEDURE_ETAPES.map((e) => ({
    "@type": "HowToStep",
    position: e.id,
    name: e.titre,
    text: e.description,
  })),
};

export default function ProcedureExportPage() {
  return (
    <>
      <PageHero
        eyebrow="Ressources · Publication technique"
        title="La chaîne d'exportation agricole, étape par étape"
        lead={`${PROCEDURE_ETAPES.length} étapes, ${PROCEDURE_ACTEURS.length} intervenants et ${NB_DOCS} pièces documentaires — du champ jusqu'à l'entrepôt de l'acheteur : ce qu'il faut faire, qui l'exécute, quels documents sont produits, où la marchandise peut être bloquée — et le guichet camerounais à saisir.`}
      />
      <Breadcrumbs
        items={[{ label: "Ressources", href: "/ressources" }, { label: "Procédure d'exportation" }]}
      />
      <JsonLd
        data={breadcrumbLd([
          { label: "Ressources", href: "/ressources" },
          { label: "Procédure d'exportation", href: "/ressources/procedure-export" },
        ])}
      />
      <JsonLd data={howToLd} />

      <Section>
        <SectionTitle
          eyebrow="Mode d'emploi"
          title="Trois lectures d'une même procédure"
          intro="Suivez la chaîne étape par étape, vérifiez qui fait quoi en filtrant par intervenant, ou travaillez directement sur le dossier documentaire — la checklist se coche et s'imprime. Le détail de chaque étape se termine par ses repères Cameroun : le guichet à saisir, l'autorité qui délivre, la pièce qui bloque."
        />
        <ProcedureExport />
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Repères Cameroun"
          title="Les guichets et autorités à connaître"
          intro="Qui délivre quoi, et où le dossier passe. Ces repères se retrouvent, étape par étape, dans le détail de la procédure ci-dessus."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTIONS_CM.map((i) => (
            <div key={i.sigle} className="rounded-lg border border-line bg-paper p-6">
              <p className="font-bold tracking-wide text-gold">{i.sigle}</p>
              <h3 className="title-3 mt-1 text-navy">{i.nom}</h3>
              <p className="mt-2 text-grey">{i.role}</p>
            </div>
          ))}
        </div>
        <Callout title="À vérifier avant chaque expédition">{REPERES_CM_AVERTISSEMENT}</Callout>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Notre intervention"
          title="Structurer la filière avant le port"
          intro="Traçabilité des lots, limites de résidus, normes d'emballage, certificat d'origine, chaîne du froid : la conformité d'un envoi se joue en amont. XP-NOVA intervient sur l'organisation de la chaîne, la qualification des opérateurs et la préparation du dossier documentaire."
        />
        <Callout title="Périmètre" variant="gold">
          Cette procédure est un référentiel de travail : la séquence standard du commerce
          international, complétée des repères camerounais. Les pièces réellement exigées dépendent de
          la filière et du marché de destination — chaque mission commence par leur vérification.
        </Callout>
      </Section>

      <CTABanner />
    </>
  );
}
