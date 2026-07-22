import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import { CardExpert } from "@/components/cards";
import { expertsByCategoryEn } from "@/content/en";

export const metadata: Metadata = {
  title: "Our experts",
  description:
    "A multidisciplinary team and a network of mobilisable experts, with CVs compliant with development-partner standards.",
  alternates: { canonical: "/en/equipe", languages: { fr: "/equipe", en: "/en/equipe" } },
};

export default function EquipePageEn() {
  const groups = expertsByCategoryEn();
  return (
    <>
      <PageHero
        eyebrow="Team"
        title="Expertise that embodies the method"
        lead="A permanent core and a network of mobilisable experts, with profiles compliant with development-partner standards."
      />
      <Breadcrumbs items={[{ label: "Team" }]} lang="en" />

      {groups.map((g) => (
        <Section key={g.category} tone={g.category === "Direction" ? "paper" : "light"}>
          <SectionTitle eyebrow={g.label} title={g.label} />
          <div className="grid gap-6 lg:grid-cols-2">
            {g.items.map((e) => (
              <CardExpert key={e.slug} e={e} lang="en" />
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <Callout title="Mobilisation capacity" variant="gold">
          Beyond its permanent core, XP-NOVA mobilises associate experts and the contracted capacities
          of its associates and third parties, through written commitment — to respond in consortium
          as in direct bids, to the requirements of procurement procedures. Full CVs in donor format
          are shared on request.
        </Callout>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
