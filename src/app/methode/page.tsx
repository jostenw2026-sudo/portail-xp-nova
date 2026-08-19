import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { phases } from "@/content/methode";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Méthode d'ingénierie en 6 phases",
  description:
    "Comprendre, concevoir, structurer, réaliser, pérenniser, mesurer : la méthode XP-NOVA pour des projets sécurisés.",
  alternates: { canonical: "/methode", languages: { fr: "/methode", en: "/en/methode" } },
};

export default function MethodePage() {
  return (
    <>
      <PageHero
        eyebrow="Notre méthode"
        title="Une approche orientée résultats"
        lead="Six phases enchaînées, chacune sanctionnée par un livrable vérifiable. C'est cette discipline qui sécurise vos projets."
      />
      <Breadcrumbs items={[{ label: "Notre méthode" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Notre méthode", href: "/methode" }])} />

      <Section>
        <ol className="space-y-6">
          {phases.map((p) => (
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
                    <p className="text-xs font-semibold uppercase text-grey">Activités</p>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {p.activites.map((a) => (
                        <li key={a} className="rounded bg-light px-2.5 py-1 text-xs text-navy">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-grey">Livrables</p>
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

        {/* Articulation BIC / AGROVITA — option A de ARBITRAGE-METHODE-BIC-AGROVITA.md.
            Une doctrine commune, deux parcours : le dire plutôt que de le laisser
            deviner à qui passe d'un site à l'autre. */}
        <aside className="mt-10 rounded-lg border border-line bg-light p-6">
          <p className="text-ink/90">
            Cette méthode s&apos;applique à tous nos domaines d&apos;intervention. Elle repose sur
            la doctrine <strong className="text-navy">PTE-R</strong>{' '}— produire pour la demande,
            transformer pour la valeur, exporter pour l&apos;impact, résister pour la durée. Pour
            les projets agricoles, d&apos;élevage et agro-industriels, elle se décline en un
            parcours jalonné de sept étapes, de la préqualification de l&apos;idée au contrat
            signé, sur{" "}
            <a
              href="https://agrovita.xp-nova.com/methode"
              className="font-semibold text-royal underline underline-offset-2 hover:text-navy"
            >
              agrovita.xp-nova.com
            </a>
            .
          </p>
        </aside>
      </Section>

      <CTABanner />
    </>
  );
}
