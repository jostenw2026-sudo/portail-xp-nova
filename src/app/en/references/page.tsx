import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import ReferencesListEn from "./ReferencesList";

export const metadata: Metadata = {
  title: "Project references",
  description:
    "Airports, public facilities, buildings, energy, water: our experts' references across 6 African countries.",
  alternates: { canonical: "/en/references", languages: { fr: "/references", en: "/en/references" } },
};

export default function ReferencesPageEn() {
  return (
    <>
      <PageHero
        eyebrow="References"
        title="Projects delivered in varied contexts"
        lead="Each record states its scope of engagement: who contracted, in what role, with what results. Transparency is our first proof."
      />
      <Breadcrumbs items={[{ label: "References" }]} lang="en" />
      <Section>
        <ReferencesListEn />
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
