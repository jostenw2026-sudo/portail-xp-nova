import { redirect } from "next/navigation";
import { verifySession } from "@/lib/portal/dal";

/**
 * /portail/admin/* — alias vers l'administration AGROVITA (agrovita.xp-nova.com/admin).
 *
 * Décision du 30/08/2026 : un ALIAS d'URL, pas une migration. Le panneau reste
 * exactement où il est — code, base de données et authentification par mot de
 * passe inchangés côté AGROVITA. Ce que cette page ajoute : la porte d'entrée
 * xp-nova.com/portail/admin passe par la session Authentik du portail et exige
 * le rôle `admin` (groupes XPN-ADMINS/XPN-STAFF) avant de renvoyer vers
 * AGROVITA, qui reste protégé par sa propre connexion.
 *
 * Redirection TEMPORAIRE (307), volontairement : un alias se change facilement,
 * un 308 se met en cache par les navigateurs et serait pénible à défaire si une
 * vraie migration (nouvelles vues alimentées par une API AGROVITA ou par Odoo)
 * est décidée plus tard.
 */
export const dynamic = "force-dynamic";

const AGROVITA_ADMIN_BASE = "https://agrovita.xp-nova.com/admin";

export default async function PortailAdminAlias({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await verifySession(); // redirige vers /portail/login si non connecté
  if (session.role !== "admin") redirect("/portail");

  const { path } = await params;
  const suffix = path?.length ? `/${path.map(encodeURIComponent).join("/")}` : "";

  const qs = await searchParams;
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(qs)) {
    if (Array.isArray(v)) v.forEach((x) => query.append(k, x));
    else if (v !== undefined) query.set(k, v);
  }
  const queryStr = query.toString();

  redirect(`${AGROVITA_ADMIN_BASE}${suffix}${queryStr ? `?${queryStr}` : ""}`);
}
