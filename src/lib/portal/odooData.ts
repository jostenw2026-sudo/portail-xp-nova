/**
 * Couche de données métier du portail (lecture Odoo).
 * Chaque fonction est filtrée par le PARTENAIRE lié à l'utilisateur connecté,
 * sauf les fonctions "admin" (vue transversale).
 *
 * ⚠️ Points de CALIBRAGE : les domaines/champs marqués `// CALIBRAGE` reposent
 * sur des conventions Odoo standard ; ils pourront nécessiter un ajustement
 * après le 1er branchement sur les vraies données (cf. CDC §12.2).
 */
import { cache } from "react";
import { searchRead, searchCount } from "./odoo";

/* ------------------------------------------------------------------ Identité */

export interface OdooPartner {
  id: number;
  name: string;
  email?: string;
}

/** Relie l'e-mail de session au res.partner Odoo (mémoïsé par rendu). */
export const resolvePartnerId = cache(async (email?: string): Promise<number | null> => {
  if (!email) return null;
  const rows = await searchRead<OdooPartner>(
    "res.partner",
    [["email", "=ilike", email]],
    { fields: ["id", "name", "email"], limit: 1 },
  );
  return rows[0]?.id ?? null;
});

/* -------------------------------------------------------------------- Client */

export interface ProjectRow {
  id: number;
  name: string;
  date_start?: string | false;
}
export async function getClientProjects(partnerId: number): Promise<ProjectRow[]> {
  return searchRead<ProjectRow>(
    "project.project",
    [["partner_id", "=", partnerId]], // CALIBRAGE: relation client<->projet
    { fields: ["name", "date_start"], order: "date_start desc", limit: 50 },
  );
}

export interface InvoiceRow {
  id: number;
  name: string;
  invoice_date?: string | false;
  invoice_date_due?: string | false;
  amount_total: number;
  amount_residual: number;
  state: string;
  payment_state?: string;
}
export async function getClientInvoices(partnerId: number): Promise<InvoiceRow[]> {
  return searchRead<InvoiceRow>(
    "account.move",
    [
      ["partner_id", "=", partnerId],
      ["move_type", "in", ["out_invoice", "out_refund"]],
    ],
    {
      fields: ["name", "invoice_date", "invoice_date_due", "amount_total", "amount_residual", "state", "payment_state"],
      order: "invoice_date desc",
      limit: 50,
    },
  );
}

/* ------------------------------------------------------------------- Expert */

export interface TaskRow {
  id: number;
  name: string;
  project_id?: [number, string] | false;
  stage_id?: [number, string] | false;
  date_deadline?: string | false;
}
export async function getExpertTasks(partnerId: number): Promise<TaskRow[]> {
  return searchRead<TaskRow>(
    "project.task",
    [["user_ids.partner_id", "=", partnerId]], // CALIBRAGE: mission = tâche assignée à l'utilisateur lié
    { fields: ["name", "project_id", "stage_id", "date_deadline"], order: "date_deadline asc", limit: 50 },
  );
}

/** Honoraires/paiements de l'expert = factures fournisseur à son nom. */
export async function getExpertPayments(partnerId: number): Promise<InvoiceRow[]> {
  return searchRead<InvoiceRow>(
    "account.move",
    [
      ["partner_id", "=", partnerId],
      ["move_type", "in", ["in_invoice", "in_refund"]],
    ],
    {
      fields: ["name", "invoice_date", "amount_total", "amount_residual", "state", "payment_state"],
      order: "invoice_date desc",
      limit: 50,
    },
  );
}

/* --------------------------------------------------------------- Fournisseur */

export interface PurchaseRow {
  id: number;
  name: string;
  date_order?: string | false;
  amount_total: number;
  state: string;
}
export async function getVendorOrders(partnerId: number): Promise<PurchaseRow[]> {
  return searchRead<PurchaseRow>(
    "purchase.order",
    [["partner_id", "=", partnerId]],
    { fields: ["name", "date_order", "amount_total", "state"], order: "date_order desc", limit: 50 },
  );
}
export async function getVendorInvoices(partnerId: number): Promise<InvoiceRow[]> {
  return getExpertPayments(partnerId); // mêmes factures fournisseur (in_invoice/in_refund)
}

/* --------------------------------------------------------------------- Admin */

export interface AdminSummary {
  projects: number;
  openInvoices: number;
  leads: number;
}
export async function getAdminSummary(): Promise<AdminSummary> {
  const [projects, openInvoices, leads] = await Promise.all([
    searchCount("project.project", []),
    searchCount("account.move", [
      ["move_type", "in", ["out_invoice", "out_refund"]],
      ["payment_state", "in", ["not_paid", "partial"]], // CALIBRAGE: états de paiement
    ]),
    searchCount("crm.lead", [["type", "=", "opportunity"]]), // CALIBRAGE: lead vs opportunity
  ]);
  return { projects, openInvoices, leads };
}

export interface LeadRow {
  id: number;
  name: string;
  contact_name?: string | false;
  create_date?: string | false;
  stage_id?: [number, string] | false;
}
export async function getRecentLeads(): Promise<LeadRow[]> {
  return searchRead<LeadRow>(
    "crm.lead",
    [["type", "=", "opportunity"]],
    { fields: ["name", "contact_name", "create_date", "stage_id"], order: "create_date desc", limit: 20 },
  );
}
export async function getRecentProjects(): Promise<ProjectRow[]> {
  return searchRead<ProjectRow>(
    "project.project",
    [],
    { fields: ["name", "date_start"], order: "create_date desc", limit: 20 },
  );
}

/* ---------------------------------------------------------------- Documents
 *
 * Odoo 18/19 : le modèle `documents.folder` a disparu ; les dossiers sont
 * désormais des `documents.document` de `type = "folder"`, et un document
 * pointe vers son dossier parent via `folder_id`.
 *
 * La bibliothèque du portail est ISOLÉE sous un espace de travail parent
 * nommé `Portail` contenant les sous-dossiers d'audience Public / Clients /
 * Experts / Fournisseurs / Interne. On ne lit donc jamais les dossiers métier
 * de l'entreprise (pas de collision de noms, ex. un « Interne » déjà existant).
 */

const PORTAL_ROOT = "Portail"; // nom de l'espace de travail parent (cf. RAPPORT-PHASE-B)

export interface FolderRow {
  id: number;
  name: string;
}
export interface DocumentRow {
  id: number;
  name: string;
  folder_id?: [number, string] | false;
  create_date?: string | false;
  mimetype?: string | false;
}

/** Sous-dossiers d'audience situés SOUS l'espace parent `Portail`. */
const getPortalAudienceFolders = cache(async (): Promise<FolderRow[]> => {
  const roots = await searchRead<FolderRow>(
    "documents.document",
    [["type", "=", "folder"], ["name", "=", PORTAL_ROOT]],
    { fields: ["id", "name"], limit: 1 },
  );
  const rootId = roots[0]?.id;
  if (!rootId) return [];
  return searchRead<FolderRow>(
    "documents.document",
    [["type", "=", "folder"], ["folder_id", "=", rootId]],
    { fields: ["id", "name"], limit: 20 },
  );
});

/** Ids des sous-dossiers autorisés pour une liste de noms d'audience. */
export async function getRoleFolderIds(folderNames: string[]): Promise<number[]> {
  const folders = await getPortalAudienceFolders();
  return folders.filter((f) => folderNames.includes(f.name)).map((f) => f.id);
}

/**
 * Documents visibles selon les dossiers d'audience autorisés pour le rôle.
 * `folderNames` = sous-dossiers sous `Portail` (ex. ["Public","Clients"]).
 */
export async function getDocuments(folderNames: string[]): Promise<DocumentRow[]> {
  const ids = await getRoleFolderIds(folderNames);
  if (ids.length === 0) return [];
  return searchRead<DocumentRow>(
    "documents.document",
    [["type", "!=", "folder"], ["folder_id", "in", ids]],
    { fields: ["name", "folder_id", "create_date", "mimetype"], order: "create_date desc", limit: 100 },
  );
}

export interface DocumentBinary {
  id: number;
  name: string;
  mimetype?: string | false;
  datas?: string | false; // base64
  folder_id?: [number, string] | false;
}
/** Lecture binaire d'un document (pour téléchargement contrôlé). */
export async function getDocumentBinary(id: number): Promise<DocumentBinary | null> {
  const rows = await searchRead<DocumentBinary>(
    "documents.document",
    [["id", "=", id]],
    { fields: ["name", "mimetype", "datas", "folder_id"], limit: 1 },
  );
  return rows[0] ?? null;
}
