/**
 * lib/jobs.ts — Offres d'emploi publiées, lues depuis Odoo (module Recrutement,
 * `hr.job` avec `is_published = true`). Publier/dépublier un poste dans Odoo se
 * reflète ici sous ~1 minute (cache mémoire 60 s). Si Odoo n'est pas configuré
 * ou indisponible, la liste est simplement vide (la page reste fonctionnelle).
 */
import { odooConfigured, odooSearchRead } from "@/lib/odoo";

export interface Job {
  id: number;
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
    const jobs: Job[] = rows.map((r) => ({
      id: r.id as number,
      name: str(r.name),
      description: str(r.website_description) || str(r.description),
      department: rel(r.department_id),
      contractType: rel(r.contract_type_id),
      location: rel(r.address_id),
      positions: typeof r.no_of_recruitment === "number" ? r.no_of_recruitment : undefined,
    }));
    cache = { data: jobs, ts: Date.now() };
    return jobs;
  } catch {
    return cache?.data ?? [];
  }
}
