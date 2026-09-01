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
  // `id_token_hint` : indispensable pour un logout Authentik silencieux (sinon
  // l'end-session déclenche un flow interactif qui échoue en CSRF).
  const idHint = request.cookies.get("xpn_oidc_idt")?.value;

  let target = home;
  if (rpLogoutEnabled() && idHint) {
    const q = new URLSearchParams({
      id_token_hint: idHint,
      post_logout_redirect_uri: home,
    });
    target = `${portalConfig.endSessionUrl()}?${q.toString()}`;
  }

  const res = NextResponse.redirect(target);
  // On efface les cookies locaux sur la réponse de redirection elle-même.
  res.cookies.set(portalConfig.sessionCookieName, "", { path: "/", maxAge: 0 });
  res.cookies.set("xpn_oidc_idt", "", { path: "/", maxAge: 0 });
  return res;
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
