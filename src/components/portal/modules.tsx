import Link from "next/link";
import { Panel, Table, withData, EmptyState } from "./dataStates";
import {
  resolvePartnerId,
  getClientProjects,
  getClientInvoices,
  getExpertTasks,
  getExpertPayments,
  getVendorOrders,
  getVendorInvoices,
  getAdminSummary,
  getRecentLeads,
  getRecentProjects,
} from "@/lib/portal/odooData";
import { formatAmount, formatDate, invoiceStatus, m2oLabel, orderStatus } from "@/lib/portal/format";

/** Encart affiché quand l'utilisateur n'est relié à aucun partenaire Odoo. */
function NoPartner() {
  return (
    <p className="rounded-md border border-line bg-light p-3 text-sm text-grey">
      Votre compte n'est pas encore relié à une fiche partenaire dans Odoo (même e-mail).
      Un administrateur peut faire le lien pour activer vos données.
    </p>
  );
}

async function withPartner(
  email: string | undefined,
  render: (partnerId: number) => Promise<React.ReactNode>,
): Promise<React.ReactNode> {
  return withData(
    async () => resolvePartnerId(email),
    async (partnerId) => (partnerId ? await render(partnerId) : <NoPartner />),
  );
}

/* =============================================================== B2 — CLIENT */

export async function ClientProjects({ email }: { email?: string }) {
  return (
    <Panel title="Mes projets">
      {await withPartner(email, async (pid) =>
        withData(
          () => getClientProjects(pid),
          (rows) => (
            <Table
              head={["Projet", "Démarrage"]}
              rows={rows.map((p) => [p.name, formatDate(p.date_start)])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

export async function ClientInvoices({ email }: { email?: string }) {
  return (
    <Panel title="Mes factures">
      {await withPartner(email, async (pid) =>
        withData(
          () => getClientInvoices(pid),
          (rows) => (
            <Table
              head={["Facture", "Date", "Montant", "Reste dû", "Statut"]}
              rows={rows.map((f) => [
                f.name,
                formatDate(f.invoice_date),
                formatAmount(f.amount_total),
                formatAmount(f.amount_residual),
                invoiceStatus(f.state, f.payment_state),
              ])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

/* =============================================================== B3 — EXPERT */

export async function ExpertMissions({ email }: { email?: string }) {
  return (
    <Panel title="Mes missions">
      {await withPartner(email, async (pid) =>
        withData(
          () => getExpertTasks(pid),
          (rows) => (
            <Table
              head={["Mission", "Projet", "Étape", "Échéance"]}
              rows={rows.map((t) => [
                t.name,
                m2oLabel(t.project_id),
                m2oLabel(t.stage_id),
                formatDate(t.date_deadline),
              ])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

export async function ExpertPayments({ email }: { email?: string }) {
  return (
    <Panel title="Mes honoraires & paiements">
      {await withPartner(email, async (pid) =>
        withData(
          () => getExpertPayments(pid),
          (rows) => (
            <Table
              head={["Pièce", "Date", "Montant", "Reste dû", "Statut"]}
              rows={rows.map((f) => [
                f.name,
                formatDate(f.invoice_date),
                formatAmount(f.amount_total),
                formatAmount(f.amount_residual),
                invoiceStatus(f.state, f.payment_state),
              ])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

/* ========================================================== B3 — FOURNISSEUR */

export async function VendorOrders({ email }: { email?: string }) {
  return (
    <Panel title="Mes commandes">
      {await withPartner(email, async (pid) =>
        withData(
          () => getVendorOrders(pid),
          (rows) => (
            <Table
              head={["Commande", "Date", "Montant", "Statut"]}
              rows={rows.map((o) => [o.name, formatDate(o.date_order), formatAmount(o.amount_total), orderStatus(o.state)])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

export async function VendorInvoices({ email }: { email?: string }) {
  return (
    <Panel title="Mes factures & paiements">
      {await withPartner(email, async (pid) =>
        withData(
          () => getVendorInvoices(pid),
          (rows) => (
            <Table
              head={["Pièce", "Date", "Montant", "Reste dû", "Statut"]}
              rows={rows.map((f) => [
                f.name,
                formatDate(f.invoice_date),
                formatAmount(f.amount_total),
                formatAmount(f.amount_residual),
                invoiceStatus(f.state, f.payment_state),
              ])}
            />
          ),
        ),
      )}
    </Panel>
  );
}

/* ================================================================ B4 — ADMIN */

export async function AdminSummaryCards() {
  return withData(
    () => getAdminSummary(),
    (s) => (
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "Projets", v: s.projects },
          { k: "Factures à encaisser", v: s.openInvoices },
          { k: "Opportunités", v: s.leads },
        ].map((c) => (
          <div key={c.k} className="rounded-lg border border-line bg-paper p-5 text-center shadow-sm">
            <div className="font-display text-3xl text-navy">{c.v}</div>
            <div className="mt-1 text-sm text-grey">{c.k}</div>
          </div>
        ))}
      </div>
    ),
  );
}

export async function AdminLeads() {
  return (
    <Panel title="Demandes entrantes (CRM)">
      {await withData(
        () => getRecentLeads(),
        (rows) =>
          rows.length ? (
            <Table
              head={["Sujet", "Contact", "Étape", "Reçu le"]}
              rows={rows.map((l) => [l.name, l.contact_name || "—", m2oLabel(l.stage_id), formatDate(l.create_date)])}
            />
          ) : (
            <EmptyState />
          ),
      )}
    </Panel>
  );
}

export async function AdminProjects() {
  return (
    <Panel title="Projets récents (tous)">
      {await withData(
        () => getRecentProjects(),
        (rows) => <Table head={["Projet", "Démarrage"]} rows={rows.map((p) => [p.name, formatDate(p.date_start)])} />,
      )}
    </Panel>
  );
}

/* --------- lien vers la bibliothèque (module partagé, dans chaque espace) --- */
export function LibraryLink() {
  return (
    <Link
      href="/portail/bibliotheque"
      className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-royal"
    >
      📚 Ouvrir la bibliothèque
    </Link>
  );
}

/**
 * Alias vers l'administration AGROVITA (agrovita.xp-nova.com/admin) — décision
 * du 30/08/2026 : le panneau reste sur AGROVITA, avec sa propre authentification ;
 * ce lien passe par /portail/admin, qui exige le rôle admin avant de renvoyer.
 */
export function AgrovitaAdminLink() {
  return (
    <Link
      href="/portail/admin"
      className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy no-underline transition-colors hover:bg-navy hover:text-white"
    >
      🛠️ Administration AGROVITA
    </Link>
  );
}

/**
 * Lien vers la saisie terrain (/portail/terrain) — affiché aux profils qui y
 * ont droit. La page revérifie le rôle : ce lien est un raccourci, pas une garde.
 */
export function TerrainLink() {
  return (
    <Link
      href="/portail/terrain"
      className="inline-flex items-center gap-2 rounded-md bg-gold-deep px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-navy"
    >
      📋 Saisir un prospect
    </Link>
  );
}
