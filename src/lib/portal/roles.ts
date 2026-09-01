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

/**
 * Rôles autorisés à saisir une fiche prospect sur le terrain
 * (`/portail/terrain`).
 *
 * Par défaut « admin » et « expert » : un agent de terrain reçoit le groupe
 * Authentik `XPN-EXPERTS`, ce qui coûte zéro licence Odoo — c'est tout l'intérêt
 * de faire écrire le serveur avec le compte de service plutôt que de donner un
 * accès Odoo à chaque agent.
 *
 * La liste est surchargeable par `PORTAL_TERRAIN_ROLES` pour que l'ajout d'un
 * groupe dédié (par exemple `XPN-TERRAIN` mappé sur un rôle existant) ne demande
 * pas de modification du code.
 */
export function rolesTerrain(): PortalRole[] {
  const brut = process.env.PORTAL_TERRAIN_ROLES?.trim();
  const noms = (brut ? brut.split(",") : ["admin", "expert"]).map((r) => r.trim().toLowerCase());
  const connus: PortalRole[] = ["admin", "client", "expert", "fournisseur", "invite"];
  return connus.filter((r) => noms.includes(r));
}

/** Dossiers Odoo Documents visibles selon le rôle (bibliothèque). */
export const roleFolders: Record<PortalRole, string[]> = {
  admin: ["Public", "Clients", "Experts", "Fournisseurs", "Interne"],
  client: ["Public", "Clients"],
  expert: ["Public", "Experts"],
  fournisseur: ["Public", "Fournisseurs"],
  invite: ["Public"],
};
