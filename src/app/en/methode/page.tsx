import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { phasesEn } from "@/content/en";

export const metadata: Metadata = {
  title: "6-phase engineering method",
  description:
    "Understand, design, structure, deliver, sustain, measure: the XP-NOVA method for secured projects.",
  alternates: { canonical: "/en/methode", languages: { fr: "/methode", en: "/en/methode" } },
};

export default function MethodePageEn() {
  return (
    <>
      <PageHero
        eyebrow="Our method"
        title="A results-oriented approach"
        lead="Six chained phases, each closed by a verifiable deliverable. It is this discipline that secures your projects."
      />
      <Breadcrumbs items={[{ label: "Our method" }]} lang="en" />

      <Section>
        <ol className="space-y-6">
          {phasesEn.map((p) => (
            <li
              key={p.key}
              className="grid gap-6 rounded-lg border border-line bg-paper p-6 md:grid-cols-[auto_1fr]"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold font-display text-xl font-bold text-navy">
                  {p.n}
                </span>
              </div>
              <div>
                <h2 className="title-3 text-navy">{p.title}</h2>
                <p className="text-sm font-semibold uppercase tracking-wide text-gold">{p.baseline}</p>
                <p className="mt-2 text-ink/90">{p.objectif}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-grey">Activities</p>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {p.activites.map((a) => (
                        <li key={a} className="rounded bg-light px-2.5 py-1 text-xs text-navy">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-grey">Deliverables</p>
                    <ul className="mt-1 space-y-1">
                      {p.livrables.map((l) => (
                        <li key={l} className="text-sm text-ink/90">
                          — {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
