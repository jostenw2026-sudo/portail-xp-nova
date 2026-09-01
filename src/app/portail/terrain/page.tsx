/**
 * /portail/terrain — saisie d'un prospect sur le terrain.
 *
 * Page protégée : `verifySession()` fait la vérification cryptographique réelle
 * (le proxy ne contrôle que la présence du cookie), puis le rôle est vérifié
 * ici, AVANT de rendre le formulaire. Un client connecté ne doit pas même voir
 * l'écran de saisie.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { verifySession } from "@/lib/portal/dal";
import { roleLabels, rolesTerrain } from "@/lib/portal/roles";
import { PortalChrome } from "@/components/portal/PortalUI";
import TerrainForm from "@/components/portal/TerrainForm";

export const metadata: Metadata = {
  title: "Saisie terrain",
  description: "Enregistrer un prospect rencontré sur le terrain.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function TerrainPage() {
  const session = await verifySession();
  const autorise = rolesTerrain().includes(session.role);

  return (
    <>
      <PortalChrome session={session} />
      <div className="container-x py-8 md:py-12">
        <p className="eyebrow mb-3">{roleLabels[session.role]}</p>
        <h1 className="title-1 gold-rule text-navy">Saisie terrain</h1>
        <p className="mt-3 max-w-2xl text-lg text-grey">
          Une fiche par prospect rencontré. Le parcours et le prix indicatif se calculent pendant
          que vous saisissez : vous pouvez annoncer un ordre de grandeur sur place, sans rien inventer.
        </p>

        {autorise ? (
          <div className="mt-8">
            <TerrainForm agent={session.name || session.email || session.sub} />
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-line bg-light p-6">
            <p className="font-semibold text-navy">Cet écran n&apos;est pas ouvert à votre profil.</p>
            <p className="mt-2 max-w-2xl text-grey">
              La saisie de prospects est réservée aux agents de terrain et à l&apos;administration.
              Un administrateur peut vous y donner accès en vous ajoutant au groupe Authentik{" "}
              <code>XPN-EXPERTS</code>.
            </p>
            <Link href="/portail" className="mt-4 inline-block font-semibold text-royal">
              Retour au tableau de bord
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
