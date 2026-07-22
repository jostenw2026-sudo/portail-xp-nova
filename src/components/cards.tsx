import Link from "next/link";
import type { Metier } from "@/content/metiers";
import type { Reference } from "@/content/references";
import type { Expert } from "@/content/experts";
import { site } from "@/content/site";
import { MetierIcon, RefIllustration, refCategory } from "./illustrations";

export function CardMetier({ m }: { m: Metier }) {
  return (
    <Link
      href={`/metiers/${m.slug}`}
      className="group block rounded-lg border border-line bg-paper p-6 no-underline transition-shadow hover:shadow-lg"
    >
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-navy text-gold transition-colors group-hover:bg-royal">
        <MetierIcon slug={m.slug} className="h-6 w-6" />
      </div>
      <h3 className="title-3 text-navy group-hover:text-royal">{m.title}</h3>
      <p className="mt-2 text-grey">{m.short}</p>
      <span className="mt-4 inline-block text-royal font-semibold">Découvrir →</span>
    </Link>
  );
}

export function CardReference({ r }: { r: Reference }) {
  return (
    <Link
      href={`/references/${r.slug}`}
      className="group flex flex-col rounded-lg border border-line bg-paper overflow-hidden no-underline transition-shadow hover:shadow-lg"
    >
      <div className="relative overflow-hidden bg-navy text-white p-5">
        <RefIllustration
          category={refCategory(r.slug)}
          className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 opacity-25"
        />
        <div className="relative flex items-center justify-between text-xs text-gold font-semibold uppercase tracking-wide">
          <span>{r.pays}</span>
          <span>{r.annees}</span>
        </div>
        <h3 className="relative mt-2 font-display text-lg leading-snug text-white group-hover:text-gold-soft">
          {r.title}
        </h3>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-sm text-grey">{r.typeMission}</p>
        <p className="mt-1 text-sm text-ink/80">
          <span className="font-semibold">Donneur d&apos;ordre :</span> {r.client}
        </p>
        <span className="mt-auto pt-4 text-royal font-semibold">Voir la référence →</span>
      </div>
    </Link>
  );
}

export function CardExpert({ e }: { e: Expert }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-6">
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-navy text-2xl font-display font-bold text-gold"
          aria-hidden
        >
          {e.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <h3 className="title-3 text-navy">{e.name}</h3>
          <p className="text-sm text-grey">{e.role}</p>
        </div>
      </div>
      <p className="mt-4 text-ink/90">{e.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {e.expertises.slice(0, 6).map((x) => (
          <span key={x} className="rounded bg-light px-2.5 py-1 text-xs text-navy">
            {x}
          </span>
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-grey">Langues</dt>
          <dd className="font-semibold text-ink">{e.langues.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-grey">Pays</dt>
          <dd className="font-semibold text-ink">{e.pays.join(", ")}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-grey">{e.ordre}</p>
    </div>
  );
}

export function CardSecteur({
  name,
  tagline,
  url,
}: {
  name: string;
  tagline: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className="group flex flex-col justify-between rounded-lg border border-line bg-light p-6 no-underline transition-colors hover:border-gold"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">
          Écosystème XP-NOVA · site dédié
        </span>
        <h3 className="title-3 mt-2 text-navy">{name}</h3>
        <p className="mt-1 text-grey">{tagline}</p>
      </div>
      <span className="mt-6 font-semibold text-royal">Visiter {name} →</span>
    </a>
  );
}

export function EcosystemBlock() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {site.ecosystem.map((e) => (
        <CardSecteur key={e.key} name={e.name} tagline={e.tagline} url={e.url} />
      ))}
    </div>
  );
}
