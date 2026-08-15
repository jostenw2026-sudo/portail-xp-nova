/**
 * Détermination du rôle du portail à partir des groupes Authentik (claim `groups`).
 * Priorité : admin > client > expert > fournisseur.
 */
import { portalConfig } from "./config";

export type PortalRole = "admin" | "client" | "expert" | "fournisseur" | "invite";

function has(groups: string[], names: string[]): boolean {
  const set = new Set(groups.map((g) => g.trim().toLowerCase()));
  return names.some((n) => set.has(n.trim().toLowerCase()));
}

export function roleFromGroups(groups: string[] = []): PortalRole {
  const g = portalConfig.groups;
  if (has(groups, g.admin)) return "admin";
  if (has(groups, g.client)) return "client";
  if (has(groups, g.expert)) return "expert";
  if (has(groups, g.fournisseur)) return "fournisseur";
  return "invite";
}

export const roleLabels: Record<PortalRole, string> = {
  admin: "Administration XP-NOVA",
  client: "Client",
  expert: "Expert",
  fournisseur: "Fournisseur",
  invite: "Invité (aucun rôle attribué)",
};

/** Dossiers Odoo Documents visibles selon le rôle (bibliothèque). */
export const roleFolders: Record<PortalRole, string[]> = {
  admin: ["Public", "Clients", "Experts", "Fournisseurs", "Interne"],
  client: ["Public", "Clients"],
  expert: ["Public", "Experts"],
  fournisseur: ["Public", "Fournisseurs"],
  invite: ["Public"],
};
