/**
 * Configuration OIDC + portail, lue depuis les variables d'environnement.
 * Aucune valeur secrète n'est codée en dur : elles proviennent de `.env.local`
 * (voir PORTAIL.md). Les getters sont paresseux pour ne pas casser le build
 * si une variable manque au moment de la compilation.
 */

const BASE = process.env.PORTAL_AUTHENTIK_BASE_URL ?? "https://auth.xp-nova.com";
const SLUG = process.env.PORTAL_OIDC_SLUG ?? "portail";

export const portalConfig = {
  /** URL publique du site (pour construire la redirect_uri). */
  baseUrl: () => process.env.PORTAL_BASE_URL ?? "http://localhost:3000",

  authentikBase: () => BASE,
  slug: () => SLUG,

  clientId: () => process.env.PORTAL_OIDC_CLIENT_ID ?? "",
  clientSecret: () => process.env.PORTAL_OIDC_CLIENT_SECRET ?? "",

  sessionSecret: () => process.env.PORTAL_SESSION_SECRET ?? "",

  // Endpoints OIDC Authentik (dérivés de la base + slug de l'application)
  issuer: () => `${BASE}/application/o/${SLUG}/`,
  authorizeUrl: () => `${BASE}/application/o/authorize/`,
  tokenUrl: () => `${BASE}/application/o/token/`,
  userinfoUrl: () => `${BASE}/application/o/userinfo/`,
  jwksUrl: () => `${BASE}/application/o/${SLUG}/jwks/`,
  endSessionUrl: () => `${BASE}/application/o/${SLUG}/end-session/`,

  redirectUri: () =>
    `${process.env.PORTAL_BASE_URL ?? "http://localhost:3000"}/api/auth/callback`,

  /** Noms des groupes Authentik → rôles du portail (surchargeables par env). */
  groups: {
    admin: (process.env.PORTAL_GROUP_ADMIN ?? "XPN-ADMINS,XPN-STAFF").split(","),
    client: (process.env.PORTAL_GROUP_CLIENT ?? "XPN-CLIENTS").split(","),
    expert: (process.env.PORTAL_GROUP_EXPERT ?? "XPN-EXPERTS").split(","),
    fournisseur: (process.env.PORTAL_GROUP_FOURNISSEUR ?? "XPN-FOURNISSEURS").split(","),
  },

  sessionCookieName: "xpn_portal_session",
  /** Durée de session (secondes). */
  sessionMaxAge: 60 * 60 * 8, // 8 h
};

export function assertOidcConfigured(): void {
  if (!portalConfig.clientId() || !portalConfig.clientSecret()) {
    throw new Error(
      "Configuration OIDC portail incomplète : définissez PORTAL_OIDC_CLIENT_ID et PORTAL_OIDC_CLIENT_SECRET (voir PORTAIL.md).",
    );
  }
  if (!portalConfig.sessionSecret()) {
    throw new Error(
      "PORTAL_SESSION_SECRET manquant : générez-le avec `openssl rand -base64 32` (voir PORTAIL.md).",
    );
  }
}
