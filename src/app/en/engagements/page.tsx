import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { engagementsEn } from "@/content/en";

export const metadata: Metadata = {
  title: "ESG, quality, anti-corruption — Our commitments",
  description:
    "ESG, gender and inclusion, anti-corruption, quality and HSE policies: our published, verifiable commitments.",
  alternates: { canonical: "/en/engagements", languages: { fr: "/engagements", en: "/en/engagements" } },
};

export default function EngagementsPageEn() {
  return (
    <>
      <PageHero
        eyebrow="Commitments & compliance"
        title="Our commitments, published and verifiable"
        lead="To international development-partner standards: environment, social, governance, ethics, quality and safety."
      />
      <Breadcrumbs items={[{ label: "Commitments" }]} lang="en" />
      <Section>
        <SectionTitle
          eyebrow="Our policies"
          title="Five formalised commitments"
          intro="The framework is set out below. The detailed policies are being published."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {engagementsEn.map((e) => (
            <div key={e.key} className="rounded-lg border border-line bg-paper p-6">
              <div className="flex items-center justify-between">
                <h3 className="title-3 text-navy">{e.title}</h3>
                <span className="text-xs font-semibold text-gold">
                  {e.docStatus === "public" ? "PDF available" : "Coming soon"}
                </span>
              </div>
              <p className="mt-2 text-grey">{e.pitch}</p>
              <ul className="mt-4 space-y-2">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ink/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
