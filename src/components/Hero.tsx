import { Button } from "./ui";
import { HeroBlueprint } from "./illustrations";
import { site, cta } from "@/content/site";
import { siteEn, ctaEn } from "@/content/en";

// Accroches courtes bilingues des deux pôles (noms/URL depuis site.ecosystem).
const POLE_TAGLINES: Record<string, { fr: string; en: string }> = {
  agrovita: { fr: "Agriculture & agro-industrie", en: "Agriculture & agri-business" },
  odt: { fr: "Développement territorial", en: "Territorial development" },
};

export default function Hero({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const en = lang === "en";
  const CTA = en ? ctaEn : cta;

  const poles = site.ecosystem.map((e) => ({
    key: e.key,
    name: e.name,
    url: e.url,
    tagline: en ? (POLE_TAGLINES[e.key]?.en ?? e.tagline) : (POLE_TAGLINES[e.key]?.fr ?? e.tagline),
  }));

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Grille subtile */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <HeroBlueprint className="pointer-events-none absolute -right-20 -top-12 h-[540px] w-[540px] md:right-0" />
      <div className="container-x relative py-16 md:py-24">
        <p className="eyebrow mb-4">{en ? siteEn.baseline : site.baseline}</p>
        {en ? (
          <h1 className="title-hero max-w-4xl !text-white">
            Projects rarely lack ambition.
            <br />
            They lack <span className="text-gold">engineering</span>.
          </h1>
        ) : (
          <h1 className="title-hero max-w-4xl !text-white">
            Les projets ne manquent pas d&apos;ambition.
            <br />
            Ils manquent d&apos;<span className="text-gold">ingénierie</span>.
          </h1>
        )}
        <p className="mt-6 max-w-2xl text-xl text-white/80 font-light">
          {en
            ? "We design, structure, steer and secure public, private and territorial projects — from the idea to measured impact."
            : "Nous concevons, structurons, pilotons et sécurisons les projets publics, privés et territoriaux — de l'idée à l'impact mesuré."}
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button href={CTA.secondary.href} variant="primary">
            {CTA.secondary.label}
          </Button>
          <Button href={CTA.primary.href} variant="ghost">
            {CTA.primary.label}
          </Button>
        </div>

        {/* Devise */}
        <p className="mt-10 text-gold font-display text-lg tracking-wide">
          « {en ? siteEn.devise : site.devise} »
        </p>

        {/* Écosystème — orientation directe vers les deux pôles */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            {en ? "Our two divisions" : "Nos deux pôles"}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {poles.map((p) => (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-4 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-4 no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold text-xl font-extrabold text-navy">
                  {p.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="text-lg font-extrabold leading-tight text-white">{p.name}</span>
                  <span className="text-sm text-white/70">{p.tagline}</span>
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                  className="ml-1 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gold" />
    </section>
  );
}
