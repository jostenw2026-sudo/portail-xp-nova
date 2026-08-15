/**
 * Déconnexion complète (RP-initiated logout OIDC) :
 *  1. supprime la session du portail ;
 *  2. termine la session Authentik via l'end-session endpoint, puis revient à
 *     l'accueil du portail.
 * Ainsi l'utilisateur peut se reconnecter avec un AUTRE compte (le SSO ne le
 * reconnecte plus automatiquement).
 *
 * Désactivable via `PORTAL_OIDC_RP_LOGOUT=0` → déconnexion locale seule
 * (utile si le provider Authentik n'autorise pas le post_logout_redirect_uri).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { portalConfig } from "@/lib/portal/config";
import { externalUrl } from "@/lib/portal/http";

function rpLogoutEnabled(): boolean {
  const v = (process.env.PORTAL_OIDC_RP_LOGOUT ?? "1").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function handle(request: NextRequest) {
  const home = externalUrl(request, "/");

  let target = home;
  if (rpLogoutEnabled() && portalConfig.clientId()) {
    const q = new URLSearchParams({
      post_logout_redirect_uri: home,
      client_id: portalConfig.clientId(),
    });
    target = `${portalConfig.endSessionUrl()}?${q.toString()}`;
  }

  const res = NextResponse.redirect(target);
  // On efface la session locale sur la réponse de redirection elle-même.
  res.cookies.set(portalConfig.sessionCookieName, "", { path: "/", maxAge: 0 });
  return res;
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
