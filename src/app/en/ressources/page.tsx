import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { ressourcesEn } from "@/content/en";

export const metadata: Metadata = {
  title: "Resources: profiles, brochures, publications",
  description:
    "Company profile, capability statement, policies and technical publications to download or request.",
  alternates: { canonical: "/en/ressources", languages: { fr: "/ressources", en: "/en/ressources" } },
};

function Item({ r }: { r: (typeof ressourcesEn)[number] }) {
  return (
    <div className="flex flex-col rounded-lg border border-line bg-paper p-6">
      <div className="flex items-center justify-between">
        <span className="rounded bg-light px-2.5 py-1 text-xs font-semibold text-navy">{r.typeLabel}</span>
        <span className={`text-xs font-semibold ${r.acces === "public" ? "text-royal" : "text-gold"}`}>
          {r.acces === "public" ? "Free download" : "On request"}
        </span>
      </div>
      <h3 className="title-3 mt-3 text-navy">{r.title}</h3>
      <p className="mt-2 flex-1 text-grey">{r.desc}</p>
      <div className="mt-4">
        {r.docStatus === "a-paraitre" ? (
          <span className="inline-block rounded-md border border-line px-4 py-2 text-sm text-grey">
            Coming soon
          </span>
        ) : r.acces === "public" ? (
          <span className="inline-block rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy">
            Download
          </span>
        ) : (
          <a href="/en/contact" className="inline-block rounded-md bg-royal px-4 py-2 text-sm font-semibold text-white">
            Request access
          </a>
        )}
      </div>
    </div>
  );
}

export default function RessourcesPageEn() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Resource centre"
        lead="Our institutional documents and technical publications. Some are free to download, others shared on request within a procedure."
      />
      <Breadcrumbs items={[{ label: "Resources" }]} lang="en" />
      <Section>
        <SectionTitle eyebrow="Documents" title="To download or request" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ressourcesEn.map((r) => (
            <Item key={r.key} r={r} />
          ))}
        </div>
      </Section>
      <CTABanner lang="en" />
    </>
  );
}
