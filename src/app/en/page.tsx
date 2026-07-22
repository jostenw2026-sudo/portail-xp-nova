import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { Section, SectionTitle, Button } from "@/components/ui";
import { CardMetier, CardReference, EcosystemBlock } from "@/components/cards";
import { StatsBar, ProcessTimeline, Trajectoire, Pillars, CTABanner } from "@/components/blocks";
import { metiersEn, featuredReferencesEn } from "@/content/en";

export const metadata: Metadata = {
  title: "Engineering & Advisory Firm",
  description:
    "XP-NOVA — Engineering & Advisory Firm: feasibility studies, engineering, owner's engineering, project management, structuring and M&E of public and private projects in Central Africa.",
  alternates: { canonical: "/en", languages: { fr: "/", en: "/en" } },
};

const AUDIENCES = [
  { t: "States & ministries", d: "Public policy, sector programmes, public project ownership." },
  { t: "Local authorities", d: "Municipalities, departments, regions: local projects and infrastructure." },
  { t: "Development partners, banks & insurers", d: "Bankable projects, milestone disbursements, impact reporting." },
  { t: "NGOs & development projects", d: "Structuring, economic anchoring and measurable accountability." },
  { t: "Standards & certification bodies", d: "Compliance, quality and access to demanding markets." },
  { t: "Public agencies & institutions", d: "Owner's engineering and operations steering." },
];

export default function HomeEn() {
  return (
    <>
      <Hero lang="en" />
      <StatsBar tone="light" lang="en" />

      <Section>
        <SectionTitle
          eyebrow="Our practices"
          title="The skills that secure projects"
          intro="Seven engineering practices, mobilised on their own or as a chain, from upstream studies to impact monitoring."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metiersEn.map((m) => (
            <CardMetier key={m.slug} m={m} lang="en" />
          ))}
        </div>
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Our method"
          title="Results-oriented engineering"
          intro="Six phases, a verifiable deliverable at each step. Project risk is not endured: it is examined, traced and steered."
        />
        <ProcessTimeline compact lang="en" />
        <div className="mt-8">
          <Button href="/en/methode" variant="secondary">
            Explore the method
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="The XP-NOVA ecosystem"
          title="Two branches of the Engineering & Advisory Firm"
          intro="ODT applies XP-NOVA engineering to territorial development; AGROVITA to agriculture and agri-business. Discover our dedicated sites."
        />
        <EcosystemBlock lang="en" />
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Who we serve"
          title="For institutions and territories"
          intro="XP-NOVA supports public and institutional actors in designing, financing and delivering structuring projects."
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
        <SectionTitle eyebrow="Why XP-NOVA" title="Four reasons to entrust us with your project" />
        <Pillars lang="en" />
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Our track record"
          title="An established company, led by a field engineer"
          intro="The company has existed since 2006; it draws on the track record of its promoter, an engineer since 1989."
        />
        <Trajectoire lang="en" />
      </Section>

      <Section tone="light">
        <SectionTitle
          eyebrow="Selected references"
          title="Projects delivered in demanding contexts"
          intro="Each reference states its scope of engagement — transparency is our first proof."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredReferencesEn.slice(0, 6).map((r) => (
            <CardReference key={r.slug} r={r} lang="en" />
          ))}
        </div>
        <div className="mt-8">
          <Button href="/en/references" variant="secondary">
            All references
          </Button>
        </div>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
