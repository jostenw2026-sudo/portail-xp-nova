import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section } from "@/components/ui";
import { getJobBySlug } from "@/lib/jobs";

// Fiche d'offre dédiée (/carrieres/[slug] et /en/carrieres/[slug]).
// Rend le descriptif complet de l'offre publiée dans Odoo (website_description)
// et renvoie vers le formulaire de candidature avec le poste pré-sélectionné.

type Lang = "fr" | "en";

export default async function JobDetail({ slug, lang = "fr" }: { slug: string; lang?: Lang }) {
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const en = lang === "en";
  const base = en ? "/en/carrieres" : "/carrieres";

  const T = en
    ? {
        eyebrow: "Job opening · Careers", crumb: "Careers", postesUnit: "position(s)",
        detailsLabel: "At a glance", contract: "Contract type", location: "Location",
        department: "Department", positions: "Openings", descTitle: "Job description",
        noDesc: "The detailed description for this position will be provided soon. You can already apply below.",
        apply: "Apply to this position", allOffers: "← All positions",
      }
    : {
        eyebrow: "Offre d'emploi · Carrières", crumb: "Carrières", postesUnit: "poste(s)",
        detailsLabel: "En bref", contract: "Type de contrat", location: "Lieu",
        department: "Département", positions: "Postes à pourvoir", descTitle: "Descriptif du poste",
        noDesc: "Le descriptif détaillé de ce poste sera précisé prochainement. Vous pouvez déjà postuler ci-dessous.",
        apply: "Postuler à ce poste", allOffers: "← Toutes les offres",
      };

  const metaLine = [
    job.contractType,
    job.location,
    job.department,
    job.positions ? `${job.positions} ${T.postesUnit}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const applyHref = `${base}?poste=${encodeURIComponent(job.name)}#candidature`;

  const rows: { label: string; value: string }[] = [];
  if (job.contractType) rows.push({ label: T.contract, value: job.contractType });
  if (job.location) rows.push({ label: T.location, value: job.location });
  if (job.department) rows.push({ label: T.department, value: job.department });
  if (job.positions) rows.push({ label: T.positions, value: String(job.positions) });

  return (
    <>
      <PageHero eyebrow={T.eyebrow} title={job.name} lead={metaLine || undefined} />
      <Breadcrumbs items={[{ label: T.crumb, href: base }, { label: job.name }]} lang={lang} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="title-2 gold-rule">{T.descTitle}</h2>
            {job.description ? (
              <div
                className="prose-x mt-4 max-w-none text-ink/90"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p className="mt-4 text-grey">{T.noDesc}</p>
            )}
          </div>

          <aside className="space-y-6">
            {rows.length > 0 && (
              <div className="rounded-lg border border-line bg-navy p-6 text-white">
                <p className="eyebrow">{T.detailsLabel}</p>
                <dl className="mt-4 space-y-3">
                  {rows.map((r) => (
                    <div key={r.label}>
                      <dt className="text-sm text-white/70">{r.label}</dt>
                      <dd className="font-semibold text-gold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <Link
              href={applyHref}
              className="block rounded-md bg-gold px-6 py-3 text-center font-semibold text-navy no-underline hover:bg-gold-soft"
            >
              {T.apply}
            </Link>
            <Link
              href={base}
              className="block rounded-md border border-line bg-paper px-6 py-3 text-center font-semibold text-navy no-underline hover:border-gold"
            >
              {T.allOffers}
            </Link>
          </aside>
        </div>
      </Section>

      <CTABanner lang={lang} />
    </>
  );
}
