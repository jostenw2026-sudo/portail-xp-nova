/**
 * Gestion de session stateless : un JWT signé (HS256, jose) stocké dans un
 * cookie httpOnly. Ne contient que le minimum (identité + rôle), jamais de jeton
 * d'accès ni de données sensibles.
 */
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { portalConfig } from "./config";
import type { PortalRole } from "./roles";

export interface PortalSession {
  sub: string;
  email?: string;
  name?: string;
  role: PortalRole;
  groups: string[];
  [key: string]: unknown;
}

function key(): Uint8Array {
  const secret = portalConfig.sessionSecret();
  if (!secret) throw new Error("PORTAL_SESSION_SECRET manquant.");
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: PortalSession): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${portalConfig.sessionMaxAge}s`)
    .sign(key());
}

export async function decryptSession(token: string | undefined): Promise<PortalSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload as unknown as PortalSession;
  } catch {
    return null;
  }
}

export async function createSession(data: PortalSession): Promise<void> {
  const token = await encryptSession(data);
  const store = await cookies();
  store.set(portalConfig.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: portalConfig.sessionMaxAge,
  });
}

export async function getSession(): Promise<PortalSession | null> {
  const store = await cookies();
  const token = store.get(portalConfig.sessionCookieName)?.value;
  return decryptSession(token);
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(portalConfig.sessionCookieName);
}
