import type { Metadata } from "next";
import { PageHero, Breadcrumbs, CTABanner, Trajectoire, StatsBar } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "The Firm",
  description:
    "20 years of existence, 37 years of engineering experience: vision, values, governance and track record of the XP-NOVA firm in Yaoundé.",
  alternates: { canonical: "/en/cabinet", languages: { fr: "/cabinet", en: "/en/cabinet" } },
};

const valeurs = [
  { t: "Excellence", d: "Technical rigour in every deliverable." },
  { t: "Innovation", d: "The tools that make decisions reliable, from BIM to data monitoring." },
  { t: "Impact", d: "Projects that produce measurable, lasting results." },
  { t: "Responsibility", d: "Transparency and compliance as the bedrock of trust." },
];

export default function CabinetPageEn() {
  return (
    <>
      <PageHero
        eyebrow="The Firm"
        title="XP-NOVA, Engineering & Advisory Firm"
        lead="An established engineering firm that puts decades of major-project practice at the service of a simple method: each phase produces a verifiable deliverable."
      />
      <Breadcrumbs items={[{ label: "The Firm" }]} lang="en" />

      <Section>
        <div className="prose-x max-w-3xl">
          <SectionTitle eyebrow="Who are we?" title="A proven continuity, not an opportunistic creation" />
          <p>
            XP-NOVA is an engineering company under Cameroonian law, incorporated in 2006 and
            repositioned in 2026 as an Engineering & Advisory Firm. It builds on the track record of
            its promoter, an electromechanical engineer with more than 37 years of practice on major
            public-facility projects.
          </p>
          <p>
            This continuity is not merely declared: it is recorded in the trade register and
            verifiable. It is precisely this traceability that we put forward to our partners and to
            development partners.
          </p>
        </div>
      </Section>

      <StatsBar tone="light" lang="en" />

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="title-2 gold-rule">Our vision</h2>
            <p className="mt-4 text-ink/90">
              To make XP-NOVA the reference engineering and advisory firm in Central Africa for the
              design, structuring and steering of complex projects.
            </p>
          </div>
          <div>
            <h2 className="title-2 gold-rule">Our mission</h2>
            <p className="mt-4 text-ink/90">
              To design, structure, steer and secure public, private and territorial projects, from
              the idea through to measured impact.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionTitle eyebrow="Our values" title="What guides every assignment" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map((v) => (
            <div key={v.t} className="rounded-lg border border-line bg-paper p-6">
              <div className="mb-3 h-1 w-8 bg-gold rounded" />
              <h3 className="title-3 text-navy">{v.t}</h3>
              <p className="mt-2 text-grey">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Our track record"
          title="The company since 2006, the promoter since 1989"
          intro="Two distinct, openly stated histories: that of the company, and that of the engineer who leads it."
        />
        <Trajectoire lang="en" />
      </Section>

      <Section tone="light">
        <SectionTitle eyebrow="Our governance" title="A clear structure and a mobilisation capacity" />
        <div className="prose-x max-w-3xl">
          <p>
            XP-NOVA SARL is a multi-member company with capital of {site.legal.capital}, whose
            governance brings together a statutory manager and associates — among them GEQUIPS, a
            long-standing technical partner.
          </p>
          <p>
            For its assignments, the firm mobilises a permanent core, a network of associate experts
            and, as needed, the capacities of its associates and third parties, contracted through
            written commitment — in line with the rules of public procurement and development partners.
          </p>
        </div>
        <Callout title="Legal identity" variant="navy">
          {site.legalName} · {site.legal.forme} · Capital {site.legal.capital} · RCCM {site.legal.rccm}{" "}
          · NIU {site.legal.niu} · Registered office: {site.address}
        </Callout>
      </Section>

      <CTABanner lang="en" />
    </>
  );
}
