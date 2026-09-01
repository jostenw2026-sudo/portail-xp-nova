/**
 * Client Odoo (JSON-RPC, lecture seule) pour le portail.
 * - Compte de service dédié (env), jamais les identifiants d'un client.
 * - Timeout + dégradation gracieuse : en cas d'absence de config ou d'Odoo
 *   injoignable, on lève une erreur typée que l'UI convertit en message propre
 *   (le portail ne plante jamais).
 *
 * Variables d'environnement attendues (voir PORTAIL-CDC-PHASE-B.md) :
 *   ODOO_URL           ex. http://172.16.1.1:8019  (accès interne recommandé)
 *   ODOO_DB            ex. xpnovadb
 *   ODOO_SERVICE_LOGIN ex. svc-portail@xp-nova.com
 *   ODOO_SERVICE_APIKEY clé API du compte de service
 */

export class OdooNotConfiguredError extends Error {
  constructor() {
    super("Connexion Odoo non configurée");
    this.name = "OdooNotConfiguredError";
  }
}
export class OdooUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OdooUnavailableError";
  }
}

function env(name: string): string {
  return process.env[name] ?? "";
}

export function isOdooConfigured(): boolean {
  return Boolean(
    env("ODOO_URL") && env("ODOO_DB") && env("ODOO_SERVICE_LOGIN") && env("ODOO_SERVICE_APIKEY"),
  );
}

const TIMEOUT_MS = 8000;

async function rpc<T>(service: string, method: string, args: unknown[]): Promise<T> {
  if (!isOdooConfigured()) throw new OdooNotConfiguredError();
  const url = `${env("ODOO_URL").replace(/\/+$/, "")}/jsonrpc`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: { service, method, args },
        id: Math.floor(Date.now() % 1e9),
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new OdooUnavailableError(`Odoo HTTP ${res.status}`);
    const data = (await res.json()) as { result?: T; error?: { data?: { message?: string } } };
    if (data.error) {
      throw new OdooUnavailableError(data.error.data?.message ?? "Erreur Odoo");
    }
    return data.result as T;
  } catch (e) {
    if (e instanceof OdooNotConfiguredError) throw e;
    const msg = e instanceof Error ? e.message : "Odoo injoignable";
    throw new OdooUnavailableError(msg);
  } finally {
    clearTimeout(timer);
  }
}

// Cache mémoire léger de l'uid (par process), TTL raisonnable.
let cachedUid: { uid: number; at: number } | null = null;
const UID_TTL = 5 * 60 * 1000;

async function uid(): Promise<number> {
  if (cachedUid && Date.now() - cachedUid.at < UID_TTL) return cachedUid.uid;
  const result = await rpc<number | false>("common", "authenticate", [
    env("ODOO_DB"),
    env("ODOO_SERVICE_LOGIN"),
    env("ODOO_SERVICE_APIKEY"),
    {},
  ]);
  if (!result || typeof result !== "number") {
    throw new OdooUnavailableError("Authentification Odoo refusée (login/clé API du compte de service).");
  }
  cachedUid = { uid: result, at: Date.now() };
  return result;
}

export type OdooDomain = Array<unknown>;

export interface SearchReadOptions {
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}

/** search_read en lecture seule. */
export async function searchRead<T = Record<string, unknown>>(
  model: string,
  domain: OdooDomain = [],
  options: SearchReadOptions = {},
): Promise<T[]> {
  const id = await uid();
  return rpc<T[]>("object", "execute_kw", [
    env("ODOO_DB"),
    id,
    env("ODOO_SERVICE_APIKEY"),
    model,
    "search_read",
    [domain],
    {
      fields: options.fields ?? [],
      limit: options.limit ?? 80,
      offset: options.offset ?? 0,
      order: options.order ?? "",
    },
  ]);
}

/** search_count en lecture seule. */
export async function searchCount(model: string, domain: OdooDomain = []): Promise<number> {
  const id = await uid();
  return rpc<number>("object", "execute_kw", [
    env("ODOO_DB"),
    id,
    env("ODOO_SERVICE_APIKEY"),
    model,
    "search_count",
    [domain],
  ]);
}
