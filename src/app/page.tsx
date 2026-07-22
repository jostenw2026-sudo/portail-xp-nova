import Hero from "@/components/Hero";
import { Section, SectionTitle, Button } from "@/components/ui";
import { CardMetier, CardReference, EcosystemBlock } from "@/components/cards";
import { StatsBar, ProcessTimeline, Trajectoire, Pillars, CTABanner } from "@/components/blocks";
import { metiers } from "@/content/metiers";
import { featuredReferences } from "@/content/references";

// Audiences institutionnelles servies par ODT (issues du support « Institutions »).
const AUDIENCES = [
  { t: "États & ministères", d: "Politiques publiques, programmes sectoriels, maîtrise d'ouvrage publique." },
  { t: "Collectivités territoriales", d: "Communes, départements, régions : projets et infrastructures locales." },
  { t: "Bailleurs, banques & assurances", d: "Projets bancables, décaissements sur jalons, reporting d'impact." },
  { t: "ONG & projets de développement", d: "Structuration, ancrage économique et redevabilité mesurable." },
  { t: "Agences de normalisation & certification", d: "Conformité, qualité et accès aux marchés exigeants." },
  { t: "Agences & établissements publics", d: "Assistance à maîtrise d'ouvrage et pilotage d'opérations." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar tone="light" />

      <Section>
        <SectionTitle
          eyebrow="Nos métiers"
          title="Les compétences qui sécurisent les projets"
          intro="Sept métiers d'ingénierie, mobilisés seuls ou en chaîne, de l'étude amont au suivi d'impact."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metiers.map((m) => (
            <CardMetier key={m.slug} m={m} />
          ))}
        </div>
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Notre méthode"
          title="Une ingénierie orientée résultats"
          intro="Six phases, un livrable vérifiable à chaque étape. Le risque projet n'est pas subi : il est instruit, tracé et piloté."
        />
        <ProcessTimeline compact />
        <div className="mt-8">
          <Button href="/methode" variant="secondary">
            Découvrir la méthode
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="L'écosystème XP-NOVA"
          title="ODT, une branche du Bureau d'Ingénierie Conseil"
          intro="ODT applique l'ingénierie XP-NOVA au développement territorial. Découvrez le portail du cabinet et notre branche agricole & agro-industrielle."
        />
        <EcosystemBlock />
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Pour qui ?"
          title="Au service des institutions et des territoires"
          intro="ODT accompagne les acteurs publics et institutionnels dans la conception, le financement et la mise en œuvre de projets structurants."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.t} className="rounded-lg border border-line bg-paper p-6">
              <div className="mb-3 h-1 w-8 rounded bg-gold" />
              <h3 className="title-3 text-navy">{a.t}</h3>
              <p className="mt-2 text-grey">{a.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle eyebrow="Pourquoi XP-NOVA" title="Quatre raisons de nous confier votre projet" />
        <Pillars />
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Notre trajectoire"
          title="Une société établie, portée par un ingénieur de terrain"
          intro="La société existe depuis 2006 ; elle s'adosse à la trajectoire de son promoteur, ingénieur depuis 1989."
        />
        <Trajectoire />
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Quelques références"
          title="Des projets menés dans des contextes exigeants"
          intro="Chaque référence indique son cadre d'intervention — la transparence est notre première preuve."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredReferences.slice(0, 6).map((r) => (
            <CardReference key={r.slug} r={r} />
          ))}
        </div>
        <div className="mt-8">
          <Button href="/references" variant="secondary">
            Toutes les références
          </Button>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
