import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { CardMetier } from "@/components/cards";
import { metiersEn } from "@/content/en";

export const metadata: Metadata = {
  title: "Engineering practices: studies, owner's engineering, project management",
  description:
    "7 practices to secure your projects: studies, engineering, owner's engineering, project management, structuring, monitoring & evaluation, training.",
  alternates: { canonical: "/en/metiers", languages: { fr: "/metiers", en: "/en/metiers" } },
};

export default function MetiersPageEn() {
  return (
    <>
      <PageHero
        eyebrow="Our practices"
        title="Complete engineering at the service of projects"
        lead="Seven practices covering the whole life cycle of a project, from upstream studies to impact measurement."
      />
      <Breadcrumbs items={[{ label: "Our practices" }]} lang="en" />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metiersEn.map((m) => (
            <CardMetier key={m.slug} m={m} lang="en" />
          ))}
        </div>
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
