import type { Metadata } from "next";
import { PageHero, Breadcrumbs } from "@/components/blocks";
import { Section } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Décrivez votre projet : un expert vous répond sous 48 h. Yaoundé, Cameroun — interventions en Afrique centrale et de l'Ouest.",
  alternates: { canonical: "/contact", languages: { fr: "/contact", en: "/en/contact" } },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        lead="La prise de contact est libre et sans engagement. Un expert vous répond sous 48 h ouvrées."
      />
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <JsonLd data={breadcrumbLd([{ label: "Contact", href: "/contact" }])} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <ContactForm />
          <aside className="h-fit rounded-lg border border-line bg-light p-6">
            <p className="eyebrow mb-3">Nous joindre</p>
            <address className="not-italic space-y-3 text-ink/90">
              <p>{site.address}</p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold text-royal">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="font-semibold text-royal">
                  {site.email}
                </a>
              </p>
            </address>
            <hr className="my-5 border-line" />
            <p className="text-sm text-grey">
              {site.legalName} · {site.legal.forme}
              <br />
              RCCM {site.legal.rccm} · NIU {site.legal.niu}
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
