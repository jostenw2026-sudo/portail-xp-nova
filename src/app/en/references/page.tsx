import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, Callout, Button } from "@/components/ui";
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
        lead="An overview of the projects our experts have worked on — sectors, countries and periods. The detail of each assignment (contracting authority, exact role, scope of engagement, supporting documents) is shared on request."
      />
      <Breadcrumbs items={[{ label: "References" }]} lang="en" />
      <Section>
        <ReferencesListEn />
        <Callout title="Detailed reference dossier — on request" variant="gold">
          <p>
            For each project: contracting authority, exact role, scope of engagement, certificates
            and donor-format CVs. Shared with qualified partners and contracting authorities after
            the request has been assessed.
          </p>
          <div className="mt-4">
            <Button href="/en/contact" variant="secondary">
              Request the detailed dossier
            </Button>
          </div>
        </Callout>
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
