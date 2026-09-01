/**
 * Callback OIDC : valide state, échange le code, vérifie l'id_token, récupère
 * les claims (userinfo), déduit le rôle et ouvre la session portail.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCode, fetchUserinfo, verifyIdToken, type IdClaims } from "@/lib/portal/oidc";
import { encryptSession, type PortalSession } from "@/lib/portal/session";
import { roleFromGroups } from "@/lib/portal/roles";
import { portalConfig } from "@/lib/portal/config";
import { externalUrl } from "@/lib/portal/http";

function loginError(request: NextRequest, code: string, msg?: string) {
  const q = msg ? `&msg=${encodeURIComponent(msg.slice(0, 300))}` : "";
  return NextResponse.redirect(externalUrl(request, `/portail/login?error=${code}${q}`));
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const err = params.get("error");
  if (err) return loginError(request, "oidc", params.get("error_description") ?? err);

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) return loginError(request, "params");

  const cookieState = request.cookies.get("xpn_oidc_state")?.value;
  const nonce = request.cookies.get("xpn_oidc_nonce")?.value;
  const verifier = request.cookies.get("xpn_oidc_verifier")?.value;

  if (!cookieState || state !== cookieState || !nonce || !verifier) {
    return loginError(request, "state");
  }

  try {
    const tokens = await exchangeCode(code, verifier);
    const claims: IdClaims = await verifyIdToken(tokens.id_token, nonce);

    // Compléter avec userinfo (email/name/groups fiables)
    let info: IdClaims = claims;
    try {
      info = { ...claims, ...(await fetchUserinfo(tokens.access_token)) };
    } catch {
      // userinfo optionnel : on garde les claims de l'id_token
    }

    const groups = Array.isArray(info.groups) ? info.groups : [];
    const session: PortalSession = {
      sub: info.sub,
      email: info.email,
      name: info.name ?? info.preferred_username,
      role: roleFromGroups(groups),
      groups,
    };

    const token = await encryptSession(session);
    const res = NextResponse.redirect(externalUrl(request, "/portail"));
    res.cookies.set(portalConfig.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: portalConfig.sessionMaxAge,
    });
    // Conserver l'id_token (assertion d'identité, pas un jeton d'accès) dans un
    // cookie httpOnly dédié : sert uniquement d'`id_token_hint` à la déconnexion
    // OIDC (logout silencieux Authentik, sans écran CSRF).
    res.cookies.set("xpn_oidc_idt", tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: portalConfig.sessionMaxAge,
    });
    // Nettoyer les cookies temporaires
    for (const c of ["xpn_oidc_state", "xpn_oidc_nonce", "xpn_oidc_verifier"]) {
      res.cookies.set(c, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur d'authentification";
    return loginError(request, "exchange", msg);
  }
}
