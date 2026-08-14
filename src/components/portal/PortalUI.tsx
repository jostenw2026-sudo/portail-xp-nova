import type { ReactNode } from "react";
import { roleLabels, type PortalRole } from "@/lib/portal/roles";
import type { PortalSession } from "@/lib/portal/session";

/** Bandeau « connecté en tant que … » + déconnexion (form POST, sans JS). */
export function PortalChrome({ session }: { session: PortalSession }) {
  const display = session.name || session.email || session.sub;
  return (
    <div className="bg-navy text-white">
      <div className="container-x flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">Portail XP-NOVA</span>
          <span className="font-semibold">
            {display}
            <span className="ml-2 rounded bg-gold/20 px-2 py-0.5 text-xs font-medium text-gold">
              {roleLabels[session.role]}
            </span>
          </span>
        </div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-navy">{title}</h3>
      <div className="text-grey">{children}</div>
    </div>
  );
}

function Placeholder() {
  return (
    <span className="mt-3 inline-block rounded bg-light px-2 py-0.5 text-xs text-grey">
      Contenu à venir (données de démonstration)
    </span>
  );
}

const dashboards: Record<PortalRole, { title: string; intro: string; cards: string[] }> = {
  client: {
    title: "Espace client",
    intro: "Suivez vos projets, documents et échanges avec XP-NOVA.",
    cards: ["Mes projets", "Mes documents", "Mes demandes", "Facturation"],
  },
  expert: {
    title: "Espace expert",
    intro: "Vos missions, disponibilités et livrables au sein du réseau XP-NOVA.",
    cards: ["Mes missions", "Mon profil / CV", "Mes livrables", "Disponibilités"],
  },
  fournisseur: {
    title: "Espace fournisseur",
    intro: "Vos consultations, commandes et documents contractuels.",
    cards: ["Appels d'offres", "Mes commandes", "Documents contractuels", "Paiements"],
  },
  admin: {
    title: "Administration du portail",
    intro: "Vue interne XP-NOVA : pilotage des accès et des contenus du portail.",
    cards: ["Utilisateurs & rôles", "Projets (tous)", "Demandes entrantes", "Statistiques"],
  },
  invite: {
    title: "Aucun rôle attribué",
    intro:
      "Votre compte est authentifié mais n'est rattaché à aucun groupe (client / expert / fournisseur). Contactez un administrateur XP-NOVA pour obtenir un accès.",
    cards: [],
  },
};

export function RoleDashboard({ session }: { session: PortalSession }) {
  const d = dashboards[session.role];
  return (
    <div className="container-x py-10 md:py-14">
      <p className="eyebrow mb-3">{roleLabels[session.role]}</p>
      <h1 className="title-1 gold-rule text-navy">{d.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-grey">{d.intro}</p>

      {d.cards.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.cards.map((c) => (
            <Card key={c} title={c}>
              <Placeholder />
            </Card>
          ))}
        </div>
      )}

      {session.role === "invite" && (
        <div className="mt-8 rounded-lg border border-line bg-light p-6 text-grey">
          <p className="font-semibold text-navy">Comment obtenir un accès ?</p>
          <p className="mt-2">
            Un administrateur doit vous ajouter à un groupe Authentik
            (<code>XPN-CLIENTS</code>, <code>XPN-EXPERTS</code> ou <code>XPN-FOURNISSEURS</code>)
            et activer le scope <code>groups</code> sur le provider OIDC du portail.
          </p>
        </div>
      )}
    </div>
  );
}
