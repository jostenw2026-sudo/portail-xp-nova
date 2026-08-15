import type { ReactNode } from "react";
import { OdooNotConfiguredError } from "@/lib/portal/odoo";

/** Encart standard d'un module. */
export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg text-navy">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ label = "Aucun élément à afficher." }: { label?: string }) {
  return <p className="text-sm text-grey">{label}</p>;
}

export function NotConfiguredState() {
  return (
    <p className="rounded-md border border-gold/40 bg-gold/10 p-3 text-sm text-navy">
      Connexion Odoo non configurée. Ce module s'activera dès que les variables
      <code className="mx-1">ODOO_*</code> seront renseignées (voir le guide de déploiement).
    </p>
  );
}

export function UnavailableState({ detail }: { detail?: string }) {
  return (
    <p className="rounded-md border border-line bg-light p-3 text-sm text-grey">
      Données momentanément indisponibles.{detail ? ` (${detail})` : ""}
    </p>
  );
}

/**
 * Exécute un chargement de données et rend l'état approprié :
 * données OK → render(data) ; non configuré → encart ; erreur → indisponible.
 */
export async function withData<T>(
  loader: () => Promise<T>,
  render: (data: T) => ReactNode,
): Promise<ReactNode> {
  try {
    const data = await loader();
    return render(data);
  } catch (e) {
    if (e instanceof OdooNotConfiguredError) return <NotConfiguredState />;
    const detail = e instanceof Error ? e.message : undefined;
    return <UnavailableState detail={detail} />;
  }
}

/** Tableau simple réutilisable. */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-grey">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/60">
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4 align-top text-ink">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
