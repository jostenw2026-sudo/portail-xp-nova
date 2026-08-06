import type { Metadata } from "next";
import { PageHero, Breadcrumbs } from "@/components/blocks";
import { Section } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de XP-NOVA SARL — Bureau d'Ingénierie Conseil.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

export default function MentionsPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <Breadcrumbs items={[{ label: "Mentions légales" }]} />
      <Section>
        <div className="prose-x max-w-3xl">
          <h2 className="title-3 text-navy">Éditeur du site</h2>
          <p>
            {site.legalName} — {site.baseline}
            <br />
            {site.legal.forme} au capital de {site.legal.capital}
            <br />
            Siège social : {site.address}
            <br />
            RCCM : {site.legal.rccm} · NIU : {site.legal.niu}
            <br />
            Téléphone : {site.phone} · E-mail : {site.email}
          </p>
          <h2 className="title-3 text-navy mt-8">Directeur de la publication</h2>
          <p>Le gérant statutaire de {site.legalName}.</p>
          <h2 className="title-3 text-navy mt-8">Hébergement</h2>
          <p>
            Le site est hébergé par son prestataire d&apos;infrastructure. Les coordonnées de
            l&apos;hébergeur sont disponibles sur demande.
          </p>
          <h2 className="title-3 text-navy mt-8">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus (textes, visuels, marque XP-NOVA, logo) est protégé. Toute
            reproduction sans autorisation est interdite.
          </p>
        </div>
      </Section>
    </>
  );
}
