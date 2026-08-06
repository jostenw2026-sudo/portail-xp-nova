import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, Callout, Button } from "@/components/ui";
import Organigramme from "@/components/Organigramme";

export const metadata: Metadata = {
  title: "Organisation & team",
  description:
    "XP-NOVA's organisation: management, permanent core and a network of mobilisable associate experts. Detailed profiles and donor-format CVs on request.",
  alternates: { canonical: "/en/equipe", languages: { fr: "/equipe", en: "/en/equipe" } },
};

export default function EquipePageEn() {
  return (
    <>
      <PageHero
        eyebrow="Organisation"
        title="One organisation, a network of experts"
        lead="A permanent core and a network of mobilisable associate experts, with profiles compliant with development-partner standards. Detailed CVs are shared on request."
      />
      <Breadcrumbs items={[{ label: "Team" }]} lang="en" />

      <Section>
        <Organigramme lang="en" />
      </Section>

      <Section tone="light">
        <Callout title="Profiles & CVs — on request" variant="gold">
          <p>
            Beyond its permanent core, XP-NOVA mobilises associate experts and the contracted
            capacities of its associates and third parties, through written commitment — to respond in
            consortium as in direct bids. Full CVs in donor format are shared on request, as part of a
            consultation or tender.
          </p>
          <div className="mt-4">
            <Button href="/en/contact" variant="secondary">
              Request the profiles
            </Button>
          </div>
        </Callout>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
