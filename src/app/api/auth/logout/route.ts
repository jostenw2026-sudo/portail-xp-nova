/**
 * Déconnexion : supprime la session portail et redirige vers l'accueil.
 * (RP-initiated logout Authentik possible via end_session — désactivé par défaut
 * pour éviter de déconnecter l'utilisateur de tout le SSO.)
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { portalConfig } from "@/lib/portal/config";

function handle(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.nextUrl));
  res.cookies.set(portalConfig.sessionCookieName, "", { path: "/", maxAge: 0 });
  return res;
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
