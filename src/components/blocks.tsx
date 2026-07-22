import Link from "next/link";
import { phases } from "@/content/methode";
import { site, cta } from "@/content/site";
import { Button } from "./ui";
import { HeroBlueprint } from "./illustrations";

// Bandeau chiffres de preuve — charte §6.4
export function StatsBar({ tone = "navy" }: { tone?: "navy" | "light" }) {
  const dark = tone === "navy";
  return (
    <div className={dark ? "bg-navy text-white" : "bg-light text-ink"}>
      <div className="container-x grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {site.proofStats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl font-extrabold text-gold">{s.value}</div>
            <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-grey"}`}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Méthode 6 phases (C10)
export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {phases.map((p) => (
        <li key={p.key} className="rounded-lg border border-line bg-paper p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-bold text-navy">
              {p.n}
            </span>
            <h3 className="title-3 text-navy">{p.title}</h3>
          </div>
          <p className="mt-1 text-sm font-semibold text-gold uppercase tracking-wide">{p.baseline}</p>
          <p className="mt-2 text-grey">{p.objectif}</p>
          {!compact && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.activites.map((a) => (
                <li key={a} className="rounded bg-light px-2.5 py-1 text-xs text-navy">
                  {a}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

// Trajectoire à 2 niveaux — société vs promoteur (C5/C6)
export function Trajectoire() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-lg border border-line bg-paper p-6">
        <p className="eyebrow mb-4">La société</p>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="font-display text-2xl font-bold text-gold">2006</span>
            <span className="text-ink/90">
              Constitution de la société (sous la dénomination INNOVA SARL).
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-bold text-gold">2026</span>
            <span className="text-ink/90">
              Repositionnement en XP-NOVA — Bureau d&apos;Ingénierie Conseil.
            </span>
          </li>
        </ul>
      </div>
      <div className="rounded-lg border border-line bg-light p-6">
        <p className="eyebrow mb-4">Le promoteur</p>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="font-display text-2xl font-bold text-navy">1989</span>
            <span className="text-ink/90">
              Débuts à la Direction Générale des Grands Travaux du Cameroun (DGTC).
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-bold text-navy">1997</span>
            <span className="text-ink/90">
              Figure technique de référence de GEQUIPS, partenaire historique.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// 4 piliers — "Pourquoi XP-NOVA" (D5 conservé — CDC §2.1)
export function Pillars() {
  const pillars = [
    { t: "Expérience", d: "37 ans de pratique des grands projets, dans 6 pays." },
    { t: "Méthode", d: "Six phases outillées, un livrable vérifiable à chaque étape." },
    { t: "Réseau d'experts", d: "Un noyau permanent et des capacités mobilisables en groupement." },
    { t: "Orientation résultats", d: "Des projets sécurisés, finançables et durables." },
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <div key={p.t} className="rounded-lg border border-line bg-paper p-6">
          <div className="mb-3 h-1 w-8 bg-gold rounded" />
          <h3 className="title-3 text-navy">{p.t}</h3>
          <p className="mt-2 text-grey">{p.d}</p>
        </div>
      ))}
    </div>
  );
}

// Bandeau CTA final
export function CTABanner() {
  return (
    <div className="bg-navy">
      <div className="container-x py-16 text-center">
        <h2 className="title-1 !text-white">Parlons de votre projet</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/80 text-lg">
          Décrivez votre besoin : un expert vous répond sous {site.responsePromise}.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href={cta.primary.href} variant="primary">
            {cta.primary.label}
          </Button>
        </div>
      </div>
      <div className="h-1.5 bg-gold" />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="container-x py-4 text-sm text-grey">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-royal no-underline">
            Accueil
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {it.href ? (
              <Link href={it.href} className="hover:text-royal no-underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// En-tête de page interne — surtitre + H1 accentué (charte §6.3)
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <HeroBlueprint className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] opacity-80" />
      <div className="container-x relative flex flex-col gap-4 py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="title-1 !text-white gold-rule">{title}</h1>
        {lead && <p className="max-w-2xl text-lg text-white/80">{lead}</p>}
      </div>
      <div className="h-1 bg-gold" />
    </section>
  );
}
