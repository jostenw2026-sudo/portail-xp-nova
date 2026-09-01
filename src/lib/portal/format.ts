/** Formatage FR pour l'affichage (dates, montants, états Odoo). */

export function formatDate(value?: string | false | null): string {
  if (!value) return "—";
  const d = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });
}

export function formatAmount(value?: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
}

/** Libellé lisible d'un couple Odoo `[id, "Nom"]`. */
export function m2oLabel(v?: [number, string] | false | null, fallback = "—"): string {
  return Array.isArray(v) ? v[1] : fallback;
}

const invoiceStateLabels: Record<string, string> = {
  draft: "Brouillon",
  posted: "Émise",
  cancel: "Annulée",
};
const paymentStateLabels: Record<string, string> = {
  not_paid: "Non payée",
  in_payment: "En paiement",
  paid: "Payée",
  partial: "Partielle",
  reversed: "Extournée",
  invoicing_legacy: "—",
};
export function invoiceStatus(state?: string, paymentState?: string): string {
  const s = state ? (invoiceStateLabels[state] ?? state) : "";
  const p = paymentState ? (paymentStateLabels[paymentState] ?? paymentState) : "";
  return [s, p].filter(Boolean).join(" · ") || "—";
}

const orderStateLabels: Record<string, string> = {
  draft: "Devis",
  sent: "Envoyé",
  to_approve: "À approuver",
  purchase: "Commande",
  done: "Terminé",
  cancel: "Annulé",
};
export function orderStatus(state?: string): string {
  return state ? (orderStateLabels[state] ?? state) : "—";
}
