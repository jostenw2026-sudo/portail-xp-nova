import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle } from "@/components/ui";
import { engagements } from "@/content/engagements";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ESG, qualité, anti-corruption — Nos engagements",
  description:
    "Politiques ESG, genre et inclusion, anti-corruption, qualité et HSE : nos engagements publiés et vérifiables.",
  alternates: { canonical: "/engagements", languages: { fr: "/engagements", en: "/en/engagements" } },
};

export default function EngagementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Engagements & conformité"
        title="Nos engagements, publiés et vérifiables"
        lead="Aux standards des bailleurs internationaux : environnement, social, gouvernance, éthique, qualité et sécurité."
      />
      <Breadcrumbs items={[{ label: "Engagements" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Engagements", href: "/engagements" }])} />
      <Section>
        <SectionTitle
          eyebrow="Nos politiques"
          title="Cinq engagements formalisés"
          intro="Le cadre est posé ci-dessous. Les politiques détaillées sont en cours de publication."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {engagements.map((e) => (
            <div key={e.key} className="rounded-lg border border-line bg-paper p-6">
              <div className="flex items-center justify-between">
                <h3 className="title-3 text-navy">{e.title}</h3>
                <span className="text-xs font-semibold text-gold">
                  {e.docStatus === "public" ? "PDF disponible" : "À paraître"}
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
      <CTABanner />
    </>
  );
}
