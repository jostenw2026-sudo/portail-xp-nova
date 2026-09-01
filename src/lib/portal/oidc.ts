/**
 * Helpers OIDC (Authorization Code Flow + PKCE) pour le portail XP-NOVA.
 * S'appuie sur Authentik. Utilise Web Crypto (disponible côté Node 20+ et Edge).
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { portalConfig } from "./config";

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

/** Génère un couple PKCE (verifier + challenge S256). */
export async function createPkce(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomString(48);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = base64url(new Uint8Array(digest));
  return { verifier, challenge };
}

export function createState(): string {
  return randomString(24);
}

export function createNonce(): string {
  return randomString(24);
}

/** Construit l'URL d'autorisation Authentik. */
export function buildAuthorizeUrl(params: {
  state: string;
  nonce: string;
  codeChallenge: string;
}): string {
  const q = new URLSearchParams({
    response_type: "code",
    client_id: portalConfig.clientId(),
    redirect_uri: portalConfig.redirectUri(),
    scope: process.env.PORTAL_OIDC_SCOPES ?? "openid email profile",
    state: params.state,
    nonce: params.nonce,
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${portalConfig.authorizeUrl()}?${q.toString()}`;
}

export interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
}

/** Échange le code d'autorisation contre des jetons (token endpoint). */
export async function exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: portalConfig.redirectUri(),
    code_verifier: codeVerifier,
    client_id: portalConfig.clientId(),
    client_secret: portalConfig.clientSecret(),
  });

  const res = await fetch(portalConfig.tokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Échec de l'échange de jeton (${res.status}): ${text.slice(0, 300)}`);
  }
  return (await res.json()) as TokenResponse;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(portalConfig.jwksUrl()));
  return jwks;
}

export interface IdClaims extends JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  groups?: string[];
}

/** Vérifie la signature + l'émetteur + l'audience + le nonce de l'id_token. */
export async function verifyIdToken(idToken: string, expectedNonce: string): Promise<IdClaims> {
  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: portalConfig.issuer(),
    audience: portalConfig.clientId(),
  });
  if (payload.nonce !== expectedNonce) {
    throw new Error("Nonce OIDC invalide (protection anti-rejeu).");
  }
  return payload as IdClaims;
}

/** Récupère les claims depuis le endpoint userinfo (email, name, groups…). */
export async function fetchUserinfo(accessToken: string): Promise<IdClaims> {
  const res = await fetch(portalConfig.userinfoUrl(), {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Échec userinfo (${res.status})`);
  return (await res.json()) as IdClaims;
}
