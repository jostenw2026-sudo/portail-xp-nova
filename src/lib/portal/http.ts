import type { NextRequest } from "next/server";
import { portalConfig } from "./config";

/**
 * Origine publique réelle (schéma + hôte), correcte derrière un reverse proxy.
 * Priorité : en-têtes X-Forwarded-* (posés par Traefik) > PORTAL_BASE_URL >
 * Host de la requête. Évite les redirections vers le hostname interne du conteneur.
 */
export function externalOrigin(request: NextRequest): string {
  const xfHost = request.headers.get("x-forwarded-host");
  const xfProto = request.headers.get("x-forwarded-proto");
  if (xfHost) return `${xfProto ?? "https"}://${xfHost.split(",")[0].trim()}`;

  const base = portalConfig.baseUrl();
  if (base && !base.includes("localhost")) return base.replace(/\/+$/, "");

  const host = request.headers.get("host") ?? request.nextUrl.host;
  const proto = request.nextUrl.protocol.replace(":", "") || "https";
  return `${proto}://${host}`;
}

/** URL absolue publique pour un chemin donné. */
export function externalUrl(request: NextRequest, pathAndQuery: string): string {
  return externalOrigin(request) + pathAndQuery;
}
