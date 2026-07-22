import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { ressources } from "@/content/ressources";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Ressources : profils, brochures, publications",
  description:
    "Company profile, capability statement, politiques et publications techniques à télécharger ou à demander.",
  alternates: { canonical: "/ressources", languages: { fr: "/ressources", en: "/en/ressources" } },
};

function Item({ r }: { r: (typeof ressources)[number] }) {
  return (
    <div className="flex flex-col rounded-lg border border-line bg-paper p-6">
      <div className="flex items-center justify-between">
        <span className="rounded bg-light px-2.5 py-1 text-xs font-semibold text-navy">{r.type}</span>
        <span
          className={`text-xs font-semibold ${r.acces === "public" ? "text-royal" : "text-gold"}`}
        >
          {r.acces === "public" ? "Téléchargement libre" : "Sur demande"}
        </span>
      </div>
      <h3 className="title-3 mt-3 text-navy">{r.title}</h3>
      <p className="mt-2 flex-1 text-grey">{r.desc}</p>
      <div className="mt-4">
        {r.docStatus === "a-paraitre" ? (
          <span className="inline-block rounded-md border border-line px-4 py-2 text-sm text-grey">
            À paraître
          </span>
        ) : r.acces === "public" ? (
          <span className="inline-block rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy">
            Télécharger
          </span>
        ) : (
          <a href="/contact" className="inline-block rounded-md bg-royal px-4 py-2 text-sm font-semibold text-white">
            Demander l&apos;accès
          </a>
        )}
      </div>
    </div>
  );
}

export default function RessourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ressources"
        title="Centre de ressources"
        lead="Nos documents institutionnels et publications techniques. Certains sont en libre téléchargement, d'autres transmis sur demande dans le cadre d'une procédure."
      />
      <Breadcrumbs items={[{ label: "Ressources" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Ressources", href: "/ressources" }])} />
      <Section>
        <SectionTitle eyebrow="Documents" title="À télécharger ou à demander" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ressources.map((r) => (
            <Item key={r.key} r={r} />
          ))}
        </div>
      </Section>
      <CTABanner />
    </>
  );
}
