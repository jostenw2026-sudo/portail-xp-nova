/**
 * Démarre le flux OIDC : génère state/nonce/PKCE, les stocke dans des cookies
 * httpOnly courts, puis redirige vers Authentik.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertOidcConfigured } from "@/lib/portal/config";
import { buildAuthorizeUrl, createNonce, createPkce, createState } from "@/lib/portal/oidc";
import { externalUrl } from "@/lib/portal/http";

export async function GET(request: NextRequest) {
  try {
    assertOidcConfigured();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Configuration OIDC invalide";
    return NextResponse.redirect(
      externalUrl(request, `/portail/login?error=config&msg=${encodeURIComponent(msg)}`),
    );
  }

  const state = createState();
  const nonce = createNonce();
  const { verifier, challenge } = await createPkce();

  const authorizeUrl = buildAuthorizeUrl({ state, nonce, codeChallenge: challenge });
  const res = NextResponse.redirect(authorizeUrl);

  const opts = {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600, // 10 min
  };
  res.cookies.set("xpn_oidc_state", state, opts);
  res.cookies.set("xpn_oidc_nonce", nonce, opts);
  res.cookies.set("xpn_oidc_verifier", verifier, opts);

  return res;
}
