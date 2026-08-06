import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { metiers, getMetier } from "@/content/metiers";
import { references } from "@/content/references";
import { site } from "@/content/site";
import { Section, Button, Callout } from "@/components/ui";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { CardReference } from "@/components/cards";
import { JsonLd, breadcrumbLd, serviceLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return metiers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMetier(slug);
  if (!m) return {};
  return {
    title: m.seoTitle,
    description: m.metaDescription,
    alternates: { canonical: `/metiers/${m.slug}`, languages: { fr: `/metiers/${m.slug}`, en: `/en/metiers/${m.slug}` } },
  };
}

export default async function MetierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMetier(slug);
  if (!m) notFound();

  const related = references.filter((r) => r.metiers.includes(m.slug)).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Nos métiers" title={m.h1} lead={m.intro} />
      <Breadcrumbs items={[{ label: "Nos métiers", href: "/metiers" }, { label: m.title }]} />
      <JsonLd
        data={breadcrumbLd([
          { label: "Nos métiers", href: "/metiers" },
          { label: m.title, href: `/metiers/${m.slug}` },
        ])}
      />
      <JsonLd data={serviceLd(m.h1, m.metaDescription, m.slug)} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="title-2 gold-rule">Pourquoi ce métier</h2>
            <ul className="mt-6 space-y-3">
              {m.enjeu.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="text-ink/90">{e}</span>
                </li>
              ))}
            </ul>

            <h2 className="title-2 gold-rule mt-12">Nos prestations</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {m.prestations.map((p) => (
                <div key={p.title} className="rounded-lg border border-line bg-paper p-5">
                  <h3 className="font-display text-lg text-navy">{p.title}</h3>
                  <p className="mt-1 text-grey">{p.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="title-2 gold-rule mt-12">Livrables types</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {m.livrables.map((l) => (
                <span key={l} className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white">
                  {l}
                </span>
              ))}
            </div>

            {m.application && (
              <Callout title="Applications sectorielles" variant="gold">
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
            <p className="eyebrow mb-2">Notre méthode</p>
            <p className="text-grey text-sm">
              Chaque mission s&apos;inscrit dans notre méthode en 6 phases, avec un livrable vérifiable
              à chaque étape.
            </p>
            <Link href="/methode" className="mt-3 inline-block font-semibold text-royal">
              Voir la méthode →
            </Link>
            <hr className="my-5 border-line" />
            <p className="font-semibold text-navy">Un projet concerné ?</p>
            <div className="mt-3">
              <Button href="/contact" variant="secondary">
                Parlons-en
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="light">
          <h2 className="title-2 gold-rule mb-8">Références associées</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <CardReference key={r.slug} r={r} />
            ))}
          </div>
        </Section>
      )}

      <CTABanner />
    </>
  );
}
