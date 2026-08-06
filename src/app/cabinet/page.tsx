import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner, Trajectoire, StatsBar } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Le Cabinet",
  description:
    "20 ans d'existence, 37 ans d'expérience d'ingénierie : vision, valeurs, gouvernance et trajectoire du cabinet XP-NOVA à Yaoundé.",
  alternates: { canonical: "/cabinet", languages: { fr: "/cabinet", en: "/en/cabinet" } },
};

const valeurs = [
  { t: "Excellence", d: "La rigueur technique à chaque livrable." },
  { t: "Innovation", d: "Les outils qui fiabilisent la décision, du BIM au suivi de données." },
  { t: "Impact", d: "Des projets qui produisent des résultats mesurables et durables." },
  { t: "Responsabilité", d: "La transparence et la conformité comme socle de confiance." },
];

export default function CabinetPage() {
  return (
    <>
      <PageHero
        eyebrow="Le Cabinet"
        title="XP-NOVA, Bureau d'Ingénierie Conseil"
        lead="Un bureau d'ingénierie établi, qui met des décennies de pratique des grands projets au service d'une méthode simple : chaque phase produit un livrable vérifiable."
      />
      <Breadcrumbs items={[{ label: "Le Cabinet" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Le Cabinet", href: "/cabinet" }])} />

      <Section>
        <div className="prose-x max-w-3xl">
          <SectionTitle eyebrow="Qui sommes-nous ?" title="Une continuité prouvée, pas une création opportuniste" />
          <p>
            XP-NOVA est une société d&apos;ingénierie de droit camerounais, constituée en 2006 et
            repositionnée en 2026 en Bureau d&apos;Ingénierie Conseil. Elle s&apos;appuie sur la
            trajectoire de son promoteur, ingénieur électromécanicien fort de plus de 37 ans de
            pratique des grands projets d&apos;équipements publics.
          </p>
          <p>
            Cette continuité n&apos;est pas déclarative : elle est inscrite au registre du commerce et
            vérifiable. C&apos;est précisément cette traçabilité que nous mettons en avant auprès de nos
            partenaires et des bailleurs.
          </p>
        </div>
      </Section>

      <StatsBar tone="light" />

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="title-2 gold-rule">Notre vision</h2>
            <p className="mt-4 text-ink/90">
              Faire de XP-NOVA le bureau d&apos;ingénierie conseil de référence en Afrique centrale pour
              la conception, la structuration et le pilotage de projets complexes.
            </p>
          </div>
          <div>
            <h2 className="title-2 gold-rule">Notre mission</h2>
            <p className="mt-4 text-ink/90">
              Concevoir, structurer, piloter et sécuriser les projets publics, privés et territoriaux,
              de l&apos;idée jusqu&apos;à l&apos;impact mesuré.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionTitle eyebrow="Nos valeurs" title="Ce qui guide chaque mission" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map((v) => (
            <div key={v.t} className="rounded-lg border border-line bg-paper p-6">
              <div className="mb-3 h-1 w-8 bg-gold rounded" />
              <h3 className="title-3 text-navy">{v.t}</h3>
              <p className="mt-2 text-grey">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Notre trajectoire"
          title="La société depuis 2006, le promoteur depuis 1989"
          intro="Deux histoires distinctes et assumées : celle de l'entreprise, celle de l'ingénieur qui la dirige."
        />
        <Trajectoire />
      </Section>

      <Section tone="light">
        <SectionTitle eyebrow="Notre gouvernance" title="Une structure claire et une capacité de mobilisation" />
        <div className="prose-x max-w-3xl">
          <p>
            XP-NOVA SARL est une société pluripersonnelle au capital de {site.legal.capital}, dont la
            gouvernance associe un gérant statutaire et des associés — parmi lesquels la société GEQUIPS,
            partenaire technique historique.
          </p>
          <p>
            Pour ses missions, le cabinet mobilise un noyau permanent, un réseau d&apos;experts associés
            et, en tant que de besoin, les capacités de ses associés et de tiers, contractualisées par
            engagement écrit — conformément aux règles des marchés publics et des bailleurs.
          </p>
        </div>
        <Callout title="Identité légale" variant="navy">
          {site.legalName} · {site.legal.forme} · Capital {site.legal.capital} · RCCM {site.legal.rccm}{" "}
          · NIU {site.legal.niu} · Siège : {site.address}
        </Callout>
      </Section>

      <CTABanner />
    </>
  );
}
