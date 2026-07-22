import { Button } from "./ui";
import { HeroBlueprint } from "./illustrations";
import { site, cta } from "@/content/site";
import { siteEn, ctaEn } from "@/content/en";

export default function Hero({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const en = lang === "en";
  const CTA = en ? ctaEn : cta;
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
      <div className="container-x relative py-20 md:py-28">
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
        <p className="mt-14 text-gold font-display text-lg tracking-wide">
          « {en ? siteEn.devise : site.devise} »
        </p>
      </div>
      <div className="h-1.5 bg-gold" />
    </section>
  );
}
