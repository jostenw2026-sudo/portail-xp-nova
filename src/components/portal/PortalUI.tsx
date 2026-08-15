import type { ReactNode } from "react";
import { roleLabels, type PortalRole } from "@/lib/portal/roles";
import type { PortalSession } from "@/lib/portal/session";
import {
  ClientProjects,
  ClientInvoices,
  ExpertMissions,
  ExpertPayments,
  VendorOrders,
  VendorInvoices,
  AdminSummaryCards,
  AdminLeads,
  AdminProjects,
  LibraryLink,
} from "./modules";

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

const meta: Record<PortalRole, { title: string; intro: string }> = {
  client: { title: "Espace client", intro: "Suivez vos projets, vos factures et la bibliothèque XP-NOVA." },
  expert: { title: "Espace expert", intro: "Vos missions, vos honoraires et vos ressources." },
  fournisseur: { title: "Espace fournisseur", intro: "Vos commandes, vos factures et vos documents." },
  admin: { title: "Administration du portail", intro: "Vue interne XP-NOVA : projets, demandes et pilotage." },
  invite: { title: "Aucun rôle attribué", intro: "Votre compte est authentifié mais rattaché à aucun espace." },
};

function Grid({ children }: { children: ReactNode }) {
  return <div className="mt-8 grid gap-6">{children}</div>;
}

export function RoleDashboard({ session }: { session: PortalSession }) {
  const role = session.role;
  const m = meta[role];
  const email = session.email;

  return (
    <div className="container-x py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">{roleLabels[role]}</p>
          <h1 className="title-1 gold-rule text-navy">{m.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-grey">{m.intro}</p>
        </div>
        {role !== "invite" && <LibraryLink />}
      </div>

      {role === "client" && (
        <Grid>
          <ClientProjects email={email} />
          <ClientInvoices email={email} />
        </Grid>
      )}

      {role === "expert" && (
        <Grid>
          <ExpertMissions email={email} />
          <ExpertPayments email={email} />
        </Grid>
      )}

      {role === "fournisseur" && (
        <Grid>
          <VendorOrders email={email} />
          <VendorInvoices email={email} />
        </Grid>
      )}

      {role === "admin" && (
        <Grid>
          <AdminSummaryCards />
          <AdminLeads />
          <AdminProjects />
        </Grid>
      )}

      {role === "invite" && (
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
