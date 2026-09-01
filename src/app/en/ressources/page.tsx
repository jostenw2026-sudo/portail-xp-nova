import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { ressourcesEn } from "@/content/en";
import RessourceItem from "@/components/RessourceItem";

export const metadata: Metadata = {
  title: "Resources: profiles, brochures, publications",
  description:
    "Company profile, capability statement, policies and technical publications to download or request.",
  alternates: { canonical: "/en/ressources", languages: { fr: "/ressources", en: "/en/ressources" } },
};

export default function RessourcesPageEn() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Resource centre"
        lead="Our institutional documents and technical publications are shared on request: register, your request is validated, then the document is sent to you — a process that lets us know who we are dealing with."
      />
      <Breadcrumbs items={[{ label: "Resources" }]} lang="en" />
      <Section>
        <SectionTitle eyebrow="Documents" title="To download or request" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ressourcesEn.map((r) => (
            <RessourceItem key={r.key} r={r} lang="en" />
          ))}
        </div>
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
