/**
 * lib/jobs.ts — Offres d'emploi publiées, lues depuis Odoo (module Recrutement,
 * `hr.job` avec `is_published = true`). Publier/dépublier un poste dans Odoo se
 * reflète ici sous ~1 minute (cache mémoire 60 s). Si Odoo n'est pas configuré
 * ou indisponible, la liste est simplement vide (la page reste fonctionnelle).
 *
 * Filtrage par site :
 *   Ce site (portail XP-NOVA) n'affiche que ses offres. La clé de site vaut
 *   "XP-NOVA" par défaut, surchargeable par la variable d'environnement
 *   JOBS_DEPARTMENTS (liste séparée par des virgules, ex. "XP-NOVA").
 *   Une offre est retenue si l'une des clés correspond à son DÉPARTEMENT ou à
 *   son LIEU DE TRAVAIL dans Odoo (comparaison insensible à la casse).
 *   Mettre JOBS_DEPARTMENTS="*" (ou une valeur vide) pour afficher toutes les
 *   offres publiées, sans filtre.
 */
import { odooConfigured, odooSearchRead } from "@/lib/odoo";

export interface Job {
  id: number;
  slug: string;
  name: string;
  description: string;
  department?: string;
  contractType?: string;
  location?: string;
  positions?: number;
}

function rel(v: unknown): string | undefined {
  return Array.isArray(v) ? (v[1] as string) : undefined;
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Slug URL stable et unique : titre translittéré + id Odoo (ex. "ingenieur-agronome-senior-12"). */
export function jobSlug(name: string, id: number): string {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "offre"}-${id}`;
}

/** Clé(s) de site (JOBS_DEPARTMENTS), normalisées en minuscules. Défaut : "XP-NOVA". */
const DEFAULT_SITE_KEYS = "XP-NOVA";
function siteKeys(): string[] {
  const raw = process.env.JOBS_DEPARTMENTS ?? DEFAULT_SITE_KEYS;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

let cache: { data: Job[]; ts: number } | null = null;
const TTL_MS = 60_000;

export async function getPublishedJobs(): Promise<Job[]> {
  if (!odooConfigured()) return [];
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.data;
  try {
    const rows = await odooSearchRead(
      "hr.job",
      [["is_published", "=", true]],
      ["id", "name", "website_description", "description", "department_id", "contract_type_id", "address_id", "no_of_recruitment"],
      { limit: 100 },
    );
    let jobs: Job[] = rows.map((r) => {
      const id = r.id as number;
      const name = str(r.name);
      return {
        id,
        slug: jobSlug(name, id),
        name,
        description: str(r.website_description) || str(r.description),
        department: rel(r.department_id),
        contractType: rel(r.contract_type_id),
        location: rel(r.address_id),
        positions: typeof r.no_of_recruitment === "number" ? r.no_of_recruitment : undefined,
      };
    });
    const keys = siteKeys();
    const showAll = keys.length === 0 || keys.includes("*") || keys.includes("all");
    if (!showAll) {
      jobs = jobs.filter((j) =>
        [j.department, j.location]
          .filter((v): v is string => Boolean(v))
          .some((v) => keys.includes(v.toLowerCase())),
      );
    }
    cache = { data: jobs, ts: Date.now() };
    return jobs;
  } catch {
    return cache?.data ?? [];
  }
}

/** Retourne une offre publiée (et visible sur ce site) par son slug, ou null. */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getPublishedJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}
