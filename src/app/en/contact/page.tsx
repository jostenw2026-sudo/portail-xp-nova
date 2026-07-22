import type { Metadata } from "next";
import { PageHero, Breadcrumbs } from "@/components/blocks";
import { Section } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project: an expert replies within 48 h. Yaoundé, Cameroon — operations across Central and West Africa.",
  alternates: { canonical: "/en/contact", languages: { fr: "/contact", en: "/en/contact" } },
};

export default function ContactPageEn() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's discuss your project"
        lead="Getting in touch is free and without commitment. An expert replies within 48 business hours."
      />
      <Breadcrumbs items={[{ label: "Contact" }]} lang="en" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <ContactForm lang="en" />
          <aside className="h-fit rounded-lg border border-line bg-light p-6">
            <p className="eyebrow mb-3">Reach us</p>
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
