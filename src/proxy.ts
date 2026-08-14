/**
 * Proxy (ex-middleware, Next.js 16) — protection optimiste des routes du portail.
 * Vérifie uniquement la PRÉSENCE du cookie de session (contrôle rapide). La
 * vérification cryptographique réelle est faite dans le DAL (`verifySession`)
 * au niveau des pages/handlers, au plus près de la donnée.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { externalUrl } from "@/lib/portal/http";

const SESSION_COOKIE = "xpn_portal_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isLogin = pathname === "/portail/login";
  const isProtected = pathname.startsWith("/portail") && !isLogin;

  // Non connecté sur une route protégée → page de connexion
  if (isProtected && !hasSession) {
    return NextResponse.redirect(externalUrl(request, "/portail/login"));
  }

  // Déjà connecté et sur la page de login → tableau de bord
  if (isLogin && hasSession) {
    return NextResponse.redirect(externalUrl(request, "/portail"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portail/:path*"],
};
