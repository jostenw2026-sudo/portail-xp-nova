import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { referencesEn, getReferenceEn, getMetierEn } from "@/content/en";
import { Section, Button, Callout } from "@/components/ui";
import { Breadcrumbs, CTABanner } from "@/components/blocks";
import { RefIllustration, refCategory } from "@/components/illustrations";

export function generateStaticParams() {
  return referencesEn.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getReferenceEn(slug);
  if (!r) return {};
  return {
    title: `${r.title} — Reference`,
    description: `${r.typeMission} · ${r.pays} · ${r.annees}. ${r.contexte}`.slice(0, 155),
    alternates: { canonical: `/en/references/${r.slug}`, languages: { fr: `/references/${r.slug}`, en: `/en/references/${r.slug}` } },
  };
}

export default async function ReferencePageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getReferenceEn(slug);
  if (!r) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <RefIllustration
          category={refCategory(r.slug)}
          className="pointer-events-none absolute right-4 top-1/2 hidden h-56 w-56 -translate-y-1/2 opacity-20 md:block"
        />
        <div className="container-x relative py-14 md:py-20">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gold font-semibold uppercase tracking-wide">
            <span>{r.pays}</span>
            <span>{r.annees}</span>
            <span>{r.typeMission}</span>
          </div>
          <h1 className="title-1 !text-white gold-rule mt-3">{r.title}</h1>
          <p className="mt-5 text-white/80">
            Contracting authority: <strong className="text-white">{r.client}</strong>
            {r.clientFinal && <> · Beneficiary: {r.clientFinal}</>}
          </p>
        </div>
        <div className="h-1 bg-gold" />
      </section>

      <Breadcrumbs items={[{ label: "References", href: "/en/references" }, { label: r.title }]} lang="en" />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="prose-x max-w-none">
            <h2 className="title-3 text-navy">Context</h2>
            <p>{r.contexte}</p>
            <h2 className="title-3 text-navy mt-8">Assignment</h2>
            <p>{r.mission}</p>
            <h2 className="title-3 text-navy mt-8">Results</h2>
            <p>{r.resultats}</p>

            <Callout title="Scope of engagement" variant="gold">
              {r.cadre}
            </Callout>
          </div>

          <aside className="h-fit rounded-lg border border-line bg-light p-6">
            <p className="eyebrow mb-3">Practices mobilised</p>
            <ul className="space-y-2">
              {r.metiers.map((s) => {
                const m = getMetierEn(s);
                return m ? (
                  <li key={s}>
                    <Link href={`/en/metiers/${s}`} className="font-semibold text-royal">
                      {m.title} →
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
            <hr className="my-5 border-line" />
            <p className="text-xs text-grey">Supporting documents and certificates available on request.</p>
            <div className="mt-4">
              <Button href="/en/contact" variant="secondary">
                Discuss a similar project
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
