import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import { CardExpert } from "@/components/cards";
import { expertsByCategory } from "@/content/experts";
import { JsonLd, breadcrumbLd, personLd } from "@/components/JsonLd";
import { experts } from "@/content/experts";

export const metadata: Metadata = {
  title: "Nos experts",
  description:
    "Une équipe pluridisciplinaire et un réseau d'experts mobilisables, aux CV conformes aux standards des bailleurs.",
  alternates: { canonical: "/equipe", languages: { fr: "/equipe", en: "/en/equipe" } },
};

export default function EquipePage() {
  const groups = expertsByCategory();
  return (
    <>
      <PageHero
        eyebrow="Équipe"
        title="Une expertise qui incarne la méthode"
        lead="Un noyau permanent et un réseau d'experts mobilisables, aux profils conformes aux standards des bailleurs."
      />
      <Breadcrumbs items={[{ label: "Équipe" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Équipe", href: "/equipe" }])} />
      {experts.map((e) => (
        <JsonLd key={e.slug} data={personLd(e.name, e.role, e.slug)} />
      ))}

      {groups.map((g) => (
        <Section key={g.category} tone={g.category === "Direction" ? "paper" : "light"}>
          <SectionTitle eyebrow={g.category} title={g.category} />
          <div className="grid gap-6 lg:grid-cols-2">
            {g.items.map((e) => (
              <CardExpert key={e.slug} e={e} />
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <Callout title="Capacité de mobilisation" variant="gold">
          Au-delà de son noyau permanent, XP-NOVA mobilise des experts associés et les capacités
          contractualisées de ses associés et de tiers, par engagement écrit — pour répondre en
          groupement comme en direct, aux exigences des procédures de passation. Les CV complets au
          format bailleur sont transmis sur demande.
        </Callout>
      </Section>

      <CTABanner />
    </>
  );
}
