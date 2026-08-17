"use client";

/**
 * Procédure d'exportation agricole — vue interactive (3 onglets).
 *
 * 1. Étapes    : les 9 étapes réparties en 3 phases, reliées par la ligne de
 *                flux, filtrables par acteur ;
 * 2. Acteurs   : la matrice des responsabilités, une ligne par intervenant ;
 * 3. Documents : la checklist des 18 pièces, cochable et imprimable.
 *
 * Le détail d'une étape s'ouvre dans un panneau latéral (précédent / suivant,
 * fermeture par Échap). Une bascule clair / sombre s'applique au seul module.
 * Tokens de la charte : navy · royal · gold. Pictogrammes SVG maison ;
 * ligne de flux et bascule sombre dans `globals.css`.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Callout } from "./ui";
import { ProcedureIcone } from "./ProcedureIcones";
import {
  PROCEDURE_ACTEURS,
  PROCEDURE_ETAPES,
  PROCEDURE_FROID,
  PROCEDURE_PHASES,
  PROCEDURE_RISQUES,
  tousLesDocuments,
  type ActeurId,
  type ProcedureEtape,
} from "@/content/procedure-export";

type Vue = "etapes" | "acteurs" | "documents";
type Filtre = ActeurId | "tous";

const VUES: { id: Vue; label: string }[] = [
  { id: "etapes", label: "Les 9 étapes" },
  { id: "acteurs", label: "Qui fait quoi" },
  { id: "documents", label: "Dossier documentaire" },
];

// Repère de phase porté par la pastille, l'étiquette et le bandeau du panneau.
// Classes écrites en entier pour rester détectables par Tailwind.
const PHASE: Record<1 | 2 | 3, { puce: string; chip: string; bandeau: string }> = {
  1: {
    puce: "bg-royal text-white",
    chip: "bg-royal/10 text-royal",
    bandeau: "bg-gradient-to-br from-royal to-navy",
  },
  2: {
    puce: "bg-navy text-white",
    chip: "bg-navy/10 text-navy",
    bandeau: "bg-gradient-to-br from-navy to-ink",
  },
  3: {
    puce: "bg-gold text-navy",
    chip: "bg-gold/15 text-navy",
    // Or profond en départ : le gold clair ne porte pas du texte blanc.
    bandeau: "bg-gradient-to-br from-gold-deep to-gold",
  },
};

const DOCUMENTS = tousLesDocuments();

function concerne(etape: ProcedureEtape, filtre: Filtre): boolean {
  return filtre === "tous" || etape.acteurs.some((a) => a.id === filtre);
}

function acteur(id: ActeurId) {
  return PROCEDURE_ACTEURS.find((a) => a.id === id);
}

export default function ProcedureExport() {
  const [vue, setVue] = useState<Vue>("etapes");
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [sombre, setSombre] = useState(false);
  const [etapeOuverte, setEtapeOuverte] = useState<number | null>(null);
  const [cochees, setCochees] = useState<Record<string, boolean>>({});
  const panneauRef = useRef<HTMLDivElement>(null);

  const etape = etapeOuverte ? (PROCEDURE_ETAPES.find((e) => e.id === etapeOuverte) ?? null) : null;
  const nbConcernees = PROCEDURE_ETAPES.filter((e) => concerne(e, filtre)).length;
  const nbCochees = DOCUMENTS.filter((d) => cochees[d.code]).length;
  const razPossible = filtre !== "tous" || nbCochees > 0;

  const fermer = useCallback(() => setEtapeOuverte(null), []);
  const naviguer = useCallback((sens: -1 | 1) => {
    setEtapeOuverte((id) => {
      if (id === null) return id;
      const suivant = id + sens;
      if (suivant < 1) return PROCEDURE_ETAPES.length;
      if (suivant > PROCEDURE_ETAPES.length) return 1;
      return suivant;
    });
  }, []);

  /** Remet la vue à zéro : plus de filtre, plus de case cochée. */
  const raz = () => {
    setFiltre("tous");
    setCochees({});
  };

  useEffect(() => {
    if (!etape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panneauRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [etape, fermer]);

  /** N'imprime que la checklist : en-tête, pied de page et onglets sont masqués. */
  const imprimer = () => {
    document.body.classList.add("pex-print");
    const nettoyer = () => {
      document.body.classList.remove("pex-print");
      window.removeEventListener("afterprint", nettoyer);
    };
    window.addEventListener("afterprint", nettoyer);
    window.print();
    window.setTimeout(nettoyer, 1500);
  };

  const chip = (actif: boolean) =>
    `inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      actif ? "border-gold bg-gold text-navy" : "border-line bg-paper text-navy hover:border-gold"
    }`;

  return (
    <div className={sombre ? "pex-dark rounded-lg p-5 -m-1" : ""}>
      {/* ── Onglets, thème, filtre ── */}
      <div className="print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <div
            role="tablist"
            aria-label="Vues de la procédure"
            className="flex flex-1 flex-wrap gap-1 rounded-lg border border-line bg-light p-1.5"
          >
            {VUES.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                id={`pex-tab-${v.id}`}
                aria-selected={vue === v.id}
                aria-controls={`pex-panel-${v.id}`}
                onClick={() => setVue(v.id)}
                className={`flex-1 rounded-md px-4 py-2.5 text-base font-semibold transition-colors ${
                  vue === v.id ? "bg-paper text-navy shadow-sm" : "text-grey hover:text-navy"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={sombre}
            onClick={() => setSombre((v) => !v)}
            title="Basculer l'affichage de la procédure en clair ou en sombre"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-gold"
          >
            <span aria-hidden>{sombre ? "☀" : "☾"}</span>
            {sombre ? "Affichage clair" : "Affichage sombre"}
          </button>
        </div>

        {vue !== "documents" && (
          <div className="mt-5">
            <p id="pex-filtre-label" className="eyebrow mb-2">
              Filtrer par acteur
            </p>
            <div role="group" aria-labelledby="pex-filtre-label" className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={filtre === "tous"}
                onClick={() => setFiltre("tous")}
                className={chip(filtre === "tous")}
              >
                Tous les intervenants ({PROCEDURE_ACTEURS.length})
              </button>
              {PROCEDURE_ACTEURS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={filtre === a.id}
                  onClick={() => setFiltre(a.id)}
                  className={chip(filtre === a.id)}
                >
                  <ProcedureIcone nom={a.icone} taille={16} />
                  {a.nom}
                </button>
              ))}
              <button
                type="button"
                onClick={raz}
                disabled={!razPossible}
                className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-sm font-bold text-grey transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                RAZ
              </button>
            </div>
            <p className="mt-3 text-sm text-grey" aria-live="polite">
              <b className="text-navy">{nbConcernees}</b> étape{nbConcernees > 1 ? "s" : ""} sur{" "}
              {PROCEDURE_ETAPES.length}
              {filtre === "tous" ? "" : " pour cet acteur"}
            </p>
          </div>
        )}
      </div>

      {/* ── Vue 1 : les 9 étapes ── */}
      {vue === "etapes" && (
        <div id="pex-panel-etapes" role="tabpanel" aria-labelledby="pex-tab-etapes" className="mt-8">
          <ol className="mb-8 grid gap-4 md:grid-cols-3">
            {PROCEDURE_PHASES.map((p) => (
              <li key={p.n} className="flex items-start gap-3 rounded-lg border border-line bg-light p-4">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md font-bold ${PHASE[p.n].puce}`}>
                  {p.n}
                </span>
                <span>
                  <b className="block text-navy">
                    Phase {p.n} — {p.titre}
                  </b>
                  <span className="text-sm text-grey">{p.desc}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="pex-flow grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCEDURE_ETAPES.map((e) => {
              const actif = concerne(e, filtre);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEtapeOuverte(e.id)}
                  className={`flex flex-col gap-2 rounded-lg border border-line bg-paper p-5 text-left transition-shadow hover:shadow-lg ${
                    actif ? "" : "opacity-45"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`grid h-9 w-9 place-items-center rounded-md text-sm font-bold ${PHASE[e.phase].puce}`}>
                      {String(e.id).padStart(2, "0")}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${PHASE[e.phase].chip}`}>
                      Phase {e.phase}
                    </span>
                  </span>
                  <span className={`mt-1 grid h-10 w-10 place-items-center rounded-md ${PHASE[e.phase].chip}`}>
                    <ProcedureIcone nom={e.icone} taille={22} />
                  </span>
                  <span className="font-display text-lg font-bold leading-snug text-navy">{e.titre}</span>
                  <span className="text-sm text-grey">{e.sousTitre}</span>
                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                    <span className="flex gap-1.5">
                      {e.acteurs.map((a) => {
                        const ref = acteur(a.id);
                        return (
                          <span
                            key={a.id}
                            title={ref?.nom ?? a.nom}
                            className="grid h-7 w-7 place-items-center rounded-full border border-line bg-light text-navy"
                          >
                            <ProcedureIcone nom={ref?.icone ?? "bouclier"} taille={15} />
                          </span>
                        );
                      })}
                    </span>
                    <span className="text-sm font-semibold text-royal">Détails →</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Vue 2 : matrice des responsabilités ── */}
      {vue === "acteurs" && (
        <div id="pex-panel-acteurs" role="tabpanel" aria-labelledby="pex-tab-acteurs" className="mt-8 flex flex-col gap-4">
          {PROCEDURE_ACTEURS.map((a) => {
            const etapes = PROCEDURE_ETAPES.filter((e) => e.acteurs.some((x) => x.id === a.id));
            const attenue = filtre !== "tous" && filtre !== a.id;
            return (
              <div
                key={a.id}
                className={`grid gap-5 rounded-lg border border-line bg-paper p-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] ${
                  attenue ? "opacity-45" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy text-gold">
                    <ProcedureIcone nom={a.icone} taille={22} />
                  </span>
                  <span>
                    <b className="block leading-snug text-navy">{a.nom}</b>
                    <span className="mt-1 block text-sm text-grey">{a.role}</span>
                    <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-gold">
                      {etapes.length} intervention{etapes.length > 1 ? "s" : ""}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {etapes.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEtapeOuverte(e.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold text-navy transition-shadow hover:shadow-md"
                    >
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${PHASE[e.phase].puce}`}>
                        {String(e.id).padStart(2, "0")}
                      </span>
                      <ProcedureIcone nom={e.icone} taille={16} />
                      {e.titre}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Vue 3 : dossier documentaire ── */}
      {vue === "documents" && (
        <div
          id="pex-panel-documents"
          role="tabpanel"
          aria-labelledby="pex-tab-documents"
          className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
        >
          <div className="rounded-lg border border-line bg-paper p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="title-3 text-navy">Dossier de conformité et de dédouanement</h3>
                <p className="mt-1 text-sm text-grey">
                  Les {DOCUMENTS.length} pièces produites ou exigées tout au long de la chaîne.
                </p>
              </div>
              <div className="flex items-center gap-3 print:hidden">
                <span className="text-sm text-grey">
                  <b className="text-navy">{nbCochees}</b> / {DOCUMENTS.length} réunies
                </span>
                <button
                  type="button"
                  onClick={imprimer}
                  className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold"
                >
                  Imprimer la checklist
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {DOCUMENTS.map((d) => (
                <li
                  key={d.code}
                  className="flex items-center gap-3 rounded-md border border-line px-4 py-3 break-inside-avoid"
                >
                  <input
                    type="checkbox"
                    id={`pex-doc-${d.code}`}
                    checked={Boolean(cochees[d.code])}
                    onChange={(ev) => setCochees((prev) => ({ ...prev, [d.code]: ev.target.checked }))}
                    className="h-4 w-4 shrink-0 accent-royal"
                  />
                  <label htmlFor={`pex-doc-${d.code}`} className="min-w-0 cursor-pointer">
                    <b className="block text-sm text-navy">{d.nom}</b>
                    <span className="block text-xs text-grey">
                      Étape {String(d.etapeId).padStart(2, "0")} — {d.etapeTitre}
                    </span>
                  </label>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    <span className="rounded border border-line bg-light px-2 py-0.5 text-xs font-bold text-navy">
                      {d.code}
                    </span>
                    <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-bold text-navy">{d.type}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-4 print:hidden">
            <div className="rounded-lg bg-navy p-5 text-white">
              <h4 className="title-3 !text-gold">Point critique : la chaîne du froid</h4>
              <p className="mt-2 text-sm text-white/80">
                Pour les produits frais, l&apos;inspection du conteneur frigorifique et le réglage de la
                température comme de la ventilation conditionnent l&apos;obtention du bon à enlever.
              </p>
              <dl className="mt-4 flex flex-col gap-2 rounded-md bg-white/10 p-4 text-sm">
                {PROCEDURE_FROID.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3">
                    <dt className="text-white/75">{f.label}</dt>
                    <dd className="m-0 text-right font-bold text-gold">{f.valeur}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-lg border border-line bg-paper p-5">
              <h4 className="title-3 text-navy">Risques majeurs</h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/90">
                {PROCEDURE_RISQUES.map((r) => (
                  <li key={r} className="border-l-2 border-gold pl-3">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* ── Panneau de détail ── */}
      {etape && (
        <div className={`fixed inset-0 z-50 print:hidden ${sombre ? "pex-dark" : ""}`}>
          <button
            type="button"
            aria-label="Fermer le détail de l'étape"
            onClick={fermer}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-navy/60"
          />
          <div
            ref={panneauRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pex-drawer-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-paper shadow-2xl"
          >
            <div
              data-phase={etape.phase}
              className={`flex items-start justify-between gap-3 p-6 text-white ${PHASE[etape.phase].bandeau}`}
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-md bg-white/20">
                  <ProcedureIcone nom={etape.icone} taille={24} />
                </span>
                <div>
                  <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
                    Étape {String(etape.id).padStart(2, "0")} · Phase {etape.phase}
                  </span>
                  <h2 id="pex-drawer-title" className="title-2 mt-3 !text-white">
                    {etape.titre}
                  </h2>
                  <p className="mt-1 text-sm text-white/85">{etape.sousTitre}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fermer}
                aria-label="Fermer"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/20 text-white hover:bg-black/40"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <section>
                <p className="eyebrow mb-2">Description opérationnelle</p>
                <p className="rounded-md border border-line bg-light p-4 text-ink/90">{etape.description}</p>
              </section>

              <section>
                <p className="eyebrow mb-2">Actions et exigences</p>
                <ul className="flex flex-col gap-2 text-ink/90">
                  {etape.actions.map((a) => (
                    <li key={a} className="border-l-2 border-gold pl-3">
                      {a}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="eyebrow mb-2">Intervenants</p>
                <div className="flex flex-wrap gap-2">
                  {etape.acteurs.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-2 rounded-md border border-line bg-light px-3 py-1.5 text-sm font-semibold text-navy"
                    >
                      <ProcedureIcone nom={acteur(a.id)?.icone ?? "bouclier"} taille={15} />
                      {a.nom}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <p className="eyebrow mb-2">Documents produits ou exigés</p>
                <ul className="flex flex-col gap-2">
                  {etape.documents.map((d) => (
                    <li
                      key={d.code}
                      className="flex items-center justify-between gap-3 rounded-md border border-line px-3.5 py-2.5 text-sm text-ink/90"
                    >
                      <span>{d.nom}</span>
                      <span className="rounded border border-line bg-light px-2 py-0.5 text-xs font-bold text-navy">
                        {d.code}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="eyebrow mb-2">Repères Cameroun</p>
                <ul className="flex flex-col gap-2 text-ink/90">
                  {etape.reperesCm.map((r) => (
                    <li key={r} className="border-l-2 border-gold pl-3">
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              <Callout title="Point de vigilance" variant="gold">
                {etape.vigilance}
              </Callout>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line bg-light px-6 py-4">
              <button
                type="button"
                onClick={() => naviguer(-1)}
                className="rounded-md border border-line bg-paper px-4 py-2 text-sm font-semibold text-navy hover:border-gold"
              >
                ← Précédent
              </button>
              <span className="text-sm text-grey">
                Étape {etape.id} sur {PROCEDURE_ETAPES.length}
              </span>
              <button
                type="button"
                onClick={() => naviguer(1)}
                className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-soft"
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
