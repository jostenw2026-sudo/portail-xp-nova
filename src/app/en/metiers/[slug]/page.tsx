import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { metiersEn, getMetierEn, referencesEn } from "@/content/en";
import { site } from "@/content/site";
import { Section, Button, Callout } from "@/components/ui";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { CardReference } from "@/components/cards";

export function generateStaticParams() {
  return metiersEn.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMetierEn(slug);
  if (!m) return {};
  return {
    title: m.seoTitle,
    description: m.metaDescription,
    alternates: { canonical: `/en/metiers/${m.slug}`, languages: { fr: `/metiers/${m.slug}`, en: `/en/metiers/${m.slug}` } },
  };
}

export default async function MetierPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMetierEn(slug);
  if (!m) notFound();

  const related = referencesEn.filter((r) => r.metiers.includes(m.slug)).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Our practices" title={m.h1} lead={m.intro} />
      <Breadcrumbs items={[{ label: "Our practices", href: "/en/metiers" }, { label: m.title }]} lang="en" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="title-2 gold-rule">Why this practice</h2>
            <ul className="mt-6 space-y-3">
              {m.enjeu.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="text-ink/90">{e}</span>
                </li>
              ))}
            </ul>

            <h2 className="title-2 gold-rule mt-12">Our services</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {m.prestations.map((p) => (
                <div key={p.title} className="rounded-lg border border-line bg-paper p-5">
                  <h3 className="font-display text-lg text-navy">{p.title}</h3>
                  <p className="mt-1 text-grey">{p.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="title-2 gold-rule mt-12">Typical deliverables</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {m.livrables.map((l) => (
                <span key={l} className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white">
                  {l}
                </span>
              ))}
            </div>

            {m.application && (
              <Callout title="Sector applications" variant="gold">
                {m.application}{" "}
                <Link href={site.ecosystem[0].url} className="font-semibold">
                  AGROVITA
                </Link>{" "}
                ·{" "}
                <Link href={site.ecosystem[1].url} className="font-semibold">
                  ODT
                </Link>
              </Callout>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 h-fit rounded-lg border border-line bg-light p-6">
            <p className="eyebrow mb-2">Our method</p>
            <p className="text-grey text-sm">
              Every assignment follows our 6-phase method, with a verifiable deliverable at each step.
            </p>
            <Link href="/en/methode" className="mt-3 inline-block font-semibold text-royal">
              See the method →
            </Link>
            <hr className="my-5 border-line" />
            <p className="font-semibold text-navy">A project in mind?</p>
            <div className="mt-3">
              <Button href="/en/contact" variant="secondary">
                Let's talk
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="light">
          <h2 className="title-2 gold-rule mb-8">Related references</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <CardReference key={r.slug} r={r} lang="en" />
            ))}
          </div>
        </Section>
      )}

      <CTABanner lang="en" />
    </>
  );
}
