"use client";

/**
 * Volets « guide pratique » de la procédure d'exportation : Incoterms et
 * simulateur de prix, vérification des acheteurs, diagnostic des dix erreurs,
 * fiches filières et bibliothèque des modèles de documents.
 *
 * Montés par `ProcedureExport`, qui porte les onglets, le thème et la recherche.
 */

import { useMemo, useState } from "react";
import { Callout } from "./ui";
import {
  CATEGORIES_MODELES,
  CRITERES_ARNAQUE,
  ERREURS_EXPORT,
  FILIERES,
  INCOTERMS,
  INCOTERMS_NOTE,
  MARGE_DEFAUT,
  MODELES_AVERTISSEMENT,
  MODELES_DOCUMENTS,
  NIVEAUX_RISQUE,
  OUTILS_VERIFICATION,
  POSTES_COUT,
  REFLEXES,
  SALONS,
  TAUX_FCFA_USD,
  type CategorieModele,
  type ModeleDocument,
} from "@/content/procedure-guide";

const nombre = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const entier = (n: number) => Math.round(n).toLocaleString("fr-FR");

const PANNEAU = "rounded-lg border border-line bg-paper p-6";
const CHAMP =
  "mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 font-semibold text-navy focus:border-gold focus:outline-none";

/* ───────────────── Incoterms & simulateur ───────────────── */

export function VueIncoterms() {
  const [couts, setCouts] = useState<Record<string, number>>(
    Object.fromEntries(POSTES_COUT.map((p) => [p.id, p.defaut])),
  );
  const [marge, setMarge] = useState(MARGE_DEFAUT);
  const [taux, setTaux] = useState(TAUX_FCFA_USD);

  const fob = (couts.produit + couts.conditionnement + couts.transit) * (1 + marge / 100);
  const cif = fob + couts.fret;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className={PANNEAU}>
        <h3 className="title-3 text-navy">Les Incoterms 2020 en pratique</h3>
        <p className="mt-1 text-sm text-grey">
          Qui paie quoi, et surtout : à partir d&apos;où la marchandise voyage à vos risques.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          {INCOTERMS.map((i) => (
            <div key={i.sigle} className="rounded-md border border-line bg-light p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-navy px-3 py-1 font-display text-lg font-extrabold text-gold">
                  {i.sigle}
                </span>
                <span>
                  <b className="block text-navy">{i.nom}</b>
                  <span className="text-sm text-grey">{i.lieu}</span>
                </span>
                <span className="ml-auto rounded bg-gold/15 px-2 py-0.5 text-xs font-bold text-navy">
                  {i.etiquette}
                </span>
              </div>
              <dl className="flex flex-col gap-2 text-sm">
                <Paire label="Vendeur" valeur={i.vendeur} />
                <Paire label="Acheteur" valeur={i.acheteur} />
                <Paire label="Transfert du risque" valeur={i.transfertRisque} />
              </dl>
            </div>
          ))}
        </div>
        <Callout title="À retenir" variant="gold">
          {INCOTERMS_NOTE}
        </Callout>
      </div>

      <div className={PANNEAU}>
        <h3 className="title-3 text-navy">Simulateur de prix d&apos;export</h3>
        <p className="mt-1 text-sm text-grey">Estimation par tonne, à partir de vos coûts réels.</p>

        <div className="mt-5 flex flex-col gap-4">
          {POSTES_COUT.map((p) => (
            <label key={p.id} className="block">
              <span className="block text-sm font-bold text-navy">{p.label}</span>
              <span className="block text-xs text-grey">{p.aide}</span>
              <input
                type="number"
                min={0}
                step={10}
                value={couts[p.id]}
                onChange={(e) => setCouts((c) => ({ ...c, [p.id]: Number(e.target.value) || 0 }))}
                className={CHAMP}
              />
            </label>
          ))}
          <label className="block">
            <span className="block text-sm font-bold text-navy">Marge commerciale (%)</span>
            <span className="block text-xs text-grey">
              Appliquée aux coûts jusqu&apos;à la mise à bord.
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={marge}
              onChange={(e) => setMarge(Number(e.target.value) || 0)}
              className={CHAMP}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-bold text-navy">
              Taux de conversion (FCFA pour 1 USD)
            </span>
            <span className="block text-xs text-grey">
              Le cours du jour, à préciser dans toute offre.
            </span>
            <input
              type="number"
              min={1}
              step={5}
              value={taux}
              onChange={(e) => setTaux(Number(e.target.value) || 1)}
              className={CHAMP}
            />
          </label>
        </div>

        <div className="mt-5 rounded-md border border-gold bg-gold/10 p-5">
          <Resultat label="Prix FOB estimé" valeur={`${nombre(fob)} USD / t`} />
          <Resultat label="soit environ" valeur={`${entier(fob * taux)} FCFA / t`} secondaire />
          <Resultat label="Prix CIF estimé" valeur={`${nombre(cif)} USD / t`} />
          <Resultat label="soit environ" valeur={`${entier(cif * taux)} FCFA / t`} secondaire />
        </div>
        <p className="mt-4 text-sm text-grey">
          Estimation indicative : l&apos;assurance, les frais bancaires, les droits de sortie
          éventuels et le coût du crédit ne sont pas inclus.
        </p>
      </div>
    </div>
  );
}

function Paire({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-3">
      <dt className="font-bold text-navy">{label}</dt>
      <dd className="m-0 text-ink/90">{valeur}</dd>
    </div>
  );
}

function Resultat({
  label,
  valeur,
  secondaire,
}: {
  label: string;
  valeur: string;
  secondaire?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 ${
        secondaire ? "mb-2 border-b border-gold/40 pb-2 text-sm text-grey last:mb-0 last:border-0" : "text-navy"
      }`}
    >
      <span>{label}</span>
      <b className={secondaire ? "" : "text-lg"}>{valeur}</b>
    </div>
  );
}

/* ───────────────── Acheteurs & indice de suspicion ───────────────── */

const TON = {
  ok: "border-emerald-300 bg-emerald-50 text-emerald-800",
  attention: "border-amber-300 bg-amber-50 text-amber-800",
  alerte: "border-rose-300 bg-rose-50 text-rose-800",
} as const;

export function VueAcheteurs() {
  const [coches, setCoches] = useState<Record<string, boolean>>({});
  const score = CRITERES_ARNAQUE.filter((c) => coches[c.id]).length;
  const niveau =
    NIVEAUX_RISQUE.find((n) => score >= n.seuil) ?? NIVEAUX_RISQUE[NIVEAUX_RISQUE.length - 1];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className={PANNEAU}>
        <h3 className="title-3 text-navy">Vérifier un acheteur avant de s&apos;engager</h3>
        <p className="mt-1 text-sm text-grey">
          Cochez ce que vous observez dans les premiers échanges. Chaque signal compte.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {CRITERES_ARNAQUE.map((c) => (
            <Case
              key={c.id}
              actif={Boolean(coches[c.id])}
              onChange={(v) => setCoches((p) => ({ ...p, [c.id]: v }))}
              titre={c.titre}
              detail={c.detail}
            />
          ))}
        </div>

        <div
          aria-live="polite"
          className={`mt-5 flex flex-wrap items-center justify-between gap-5 rounded-md border p-5 ${TON[niveau.ton]}`}
        >
          <div className="max-w-xl">
            <b className="block text-base">{niveau.titre}</b>
            <p className="mt-1 text-sm">{niveau.conduite}</p>
          </div>
          <span className="text-right font-display text-3xl font-extrabold">
            {score}/{CRITERES_ARNAQUE.length}
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide">signaux</span>
          </span>
        </div>
      </div>

      <div className={PANNEAU}>
        <h3 className="title-3 text-navy">Où vérifier</h3>
        <p className="mt-1 text-sm text-grey">Recouper trois sources vaut mieux qu&apos;une intuition.</p>
        <ul className="mt-4 flex flex-col gap-2">
          {OUTILS_VERIFICATION.map((o) => (
            <li
              key={o.etiquette}
              className="flex flex-col gap-2 rounded-md border border-line px-4 py-3"
            >
              <span className="self-start rounded bg-gold/15 px-2 py-0.5 text-xs font-bold text-navy">
                {o.etiquette}
              </span>
              <span className="text-sm text-grey">{o.usage}</span>
              <span className="flex flex-wrap gap-2">
                {o.services.map((s) => (
                  <LienService key={s.url} url={s.url} nom={s.nom} detail={s.domaine} />
                ))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-md border border-line bg-light p-5">
          <h4 className="title-3 text-navy">Rencontrer les acheteurs</h4>
          <p className="mt-2 text-sm text-grey">
            Les salons professionnels restent le canal le plus sûr pour qualifier un acheteur : on y
            voit l&apos;entreprise, ses équipes et ses autres fournisseurs.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SALONS.map((s) => (
              <LienService key={s.url} url={s.url} nom={s.nom} detail={s.lieu} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lien sortant vers un service ou un salon, avec son domaine ou son lieu. */
function LienService({ url, nom, detail }: { url: string; nom: string; detail: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-2 rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-semibold text-navy no-underline transition-colors hover:border-gold"
    >
      {nom}
      <span className="text-xs font-medium text-grey">{detail} ↗</span>
    </a>
  );
}

function Case({
  actif,
  onChange,
  titre,
  detail,
}: {
  actif: boolean;
  onChange: (v: boolean) => void;
  titre: string;
  detail?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
        actif ? "border-gold bg-gold/10" : "border-line bg-paper hover:border-gold"
      }`}
    >
      <input
        type="checkbox"
        checked={actif}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-royal"
      />
      <span>
        <b className="block text-sm font-semibold text-navy">{titre}</b>
        {detail && <span className="mt-0.5 block text-xs text-grey">{detail}</span>}
      </span>
    </label>
  );
}

/* ───────────────── Diagnostic : les 10 erreurs ───────────────── */

export function VueDiagnostic() {
  const [coches, setCoches] = useState<boolean[]>(() => ERREURS_EXPORT.map(() => false));
  const acquis = coches.filter(Boolean).length;
  const pct = Math.round((acquis / ERREURS_EXPORT.length) * 100);
  const couleur = pct < 50 ? "text-rose-600" : pct < 80 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className={PANNEAU}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="title-3 text-navy">Votre niveau de préparation à l&apos;export</h3>
            <p className="mt-1 text-sm text-grey">
              Cochez ce que votre organisation maîtrise réellement, pas ce qu&apos;elle projette de
              faire.
            </p>
          </div>
          <span className={`font-display text-3xl font-extrabold ${couleur}`}>{pct}%</span>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {ERREURS_EXPORT.map((e, i) => (
            <Case
              key={e}
              actif={coches[i]}
              onChange={(v) => setCoches((p) => p.map((x, j) => (j === i ? v : x)))}
              titre={`${i + 1}. ${e}`}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-grey" aria-live="polite">
          <b className="text-navy">{acquis}</b> point{acquis > 1 ? "s" : ""} maîtrisé
          {acquis > 1 ? "s" : ""} sur {ERREURS_EXPORT.length}. Chaque case décochée est une cause
          connue de refoulement ou d&apos;impayé.
        </p>
      </div>

      <div className={PANNEAU}>
        <h3 className="title-3 text-navy">Trois réflexes qui évitent les litiges</h3>
        <div className="mt-4 flex flex-col gap-4">
          {REFLEXES.map((r) => (
            <div key={r.titre} className="rounded-md border border-line bg-light p-5">
              <b className="block text-navy">{r.titre}</b>
              <p className="mt-1 text-sm text-grey">{r.texte}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Fiches filières ───────────────── */

export function VueFilieres() {
  return (
    <div>
      <h3 className="title-3 text-navy">Exigences par filière</h3>
      <p className="mt-1 text-sm text-grey">
        Humidité, calibre, emballage, traitement, température : ce que le marché contrôle en premier.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FILIERES.map((f) => (
          <div key={f.nom} className={PANNEAU}>
            <h4 className="font-display text-lg font-bold text-navy">{f.nom}</h4>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              {f.exigences.map((e) => (
                <div key={e.critere}>
                  <dt className="font-bold text-navy">{e.critere}</dt>
                  <dd className="m-0 text-grey">{e.valeur}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── Bibliothèque des modèles ───────────────── */

const LIBELLE_CAT: Record<CategorieModele, string> = {
  commercial: "Commercial",
  sanitaire: "Sanitaire",
  douane: "Douane",
  transport: "Transport",
};

export function VueModeles({ recherche }: { recherche: string }) {
  const [categorie, setCategorie] = useState<CategorieModele | "tous">("tous");
  const [ouvert, setOuvert] = useState<string | null>(null);

  const liste = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return MODELES_DOCUMENTS.filter((m) => {
      const catOk = categorie === "tous" || m.categorie === categorie;
      const texte = `${m.code} ${m.titre} ${m.objet} ${m.emetteur}`.toLowerCase();
      return catOk && (!q || texte.includes(q));
    });
  }, [categorie, recherche]);

  const modele = ouvert ? (MODELES_DOCUMENTS.find((m) => m.code === ouvert) ?? null) : null;

  return (
    <div>
      <h3 className="title-3 text-navy">
        Modèles de documents ({MODELES_DOCUMENTS.length} pièces)
      </h3>
      <p className="mt-1 text-sm text-grey">
        La structure et les rubriques de chaque pièce de la chaîne, avec les erreurs qui la font
        recaler.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        {CATEGORIES_MODELES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={categorie === c.id}
            onClick={() => setCategorie(c.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              categorie === c.id
                ? "border-gold bg-gold text-navy"
                : "border-line bg-paper text-navy hover:border-gold"
            }`}
          >
            {c.label}
            {c.id === "tous" ? ` (${MODELES_DOCUMENTS.length})` : ""}
          </button>
        ))}
      </div>

      <Callout title="Avertissement" variant="gold">
        {MODELES_AVERTISSEMENT}
      </Callout>

      {liste.length === 0 ? (
        <p className="text-sm text-grey">Aucun modèle ne correspond à cette recherche.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((m) => (
            <button
              key={m.code}
              type="button"
              onClick={() => setOuvert(m.code)}
              className="flex flex-col gap-2 rounded-lg border border-line bg-paper p-5 text-left transition-shadow hover:shadow-lg"
            >
              <span className="flex items-center justify-between">
                <span className="rounded border border-line bg-light px-2 py-0.5 text-xs font-bold text-navy">
                  {m.code}
                </span>
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-navy">
                  {LIBELLE_CAT[m.categorie]}
                </span>
              </span>
              <span className="font-display text-lg font-bold leading-snug text-navy">{m.titre}</span>
              <span className="text-sm text-grey">{m.objet}</span>
              <span className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                <span className="text-grey">{m.rubriques.length} rubriques</span>
                <span className="font-semibold text-royal">Ouvrir le modèle →</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {modele && <ModeleModal modele={modele} onClose={() => setOuvert(null)} />}
    </div>
  );
}

function ModeleModal({ modele, onClose }: { modele: ModeleDocument; onClose: () => void }) {
  const imprimer = () => {
    document.body.classList.add("pex-print-modele");
    const nettoyer = () => {
      document.body.classList.remove("pex-print-modele");
      window.removeEventListener("afterprint", nettoyer);
    };
    window.addEventListener("afterprint", nettoyer);
    window.print();
    window.setTimeout(nettoyer, 1500);
  };

  return (
    <div className="pex-modale fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="Fermer le modèle"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-navy/60 print:hidden"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pex-modele-titre"
        className="pex-modale__box relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 bg-navy p-5 text-white print:hidden">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
              {modele.code}
            </span>
            <h3 id="pex-modele-titre" className="title-3 mt-2 !text-white">
              {modele.titre}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={imprimer}
              className="rounded-md bg-gold px-3.5 py-2 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              Imprimer
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="grid h-9 w-9 place-items-center rounded-full bg-black/25 text-white hover:bg-black/40"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="pex-modale__corps flex-1 overflow-y-auto bg-light p-6">
          <div className="rounded-lg border border-line bg-paper p-6">
            <span className="inline-block rounded border border-gold bg-gold/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-navy">
              Modèle — document de travail, sans valeur officielle
            </span>
            <h4 className="title-2 mt-4 text-navy">{modele.titre}</h4>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <Paire label="Établi ou délivré par" valeur={modele.emetteur} />
              <Paire label="Objet" valeur={modele.objet} />
            </dl>

            <p className="eyebrow mt-6 mb-2">Rubriques à renseigner</p>
            <ol className="flex list-decimal flex-col gap-3.5 pl-5">
              {modele.rubriques.map((r) => (
                <li key={r.label}>
                  <b className="text-navy">{r.label}</b>
                  <span className="block text-xs text-grey">{r.indication}</span>
                  <span
                    aria-hidden
                    className="mt-2 block h-px bg-[repeating-linear-gradient(90deg,var(--color-line)_0_8px,transparent_8px_14px)]"
                  />
                </li>
              ))}
            </ol>

            {modele.tableau && (
              <>
                <p className="eyebrow mt-6 mb-2">{modele.tableau.intitule}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {modele.tableau.colonnes.map((c) => (
                          <th
                            key={c}
                            className="border-b border-line px-3 py-2 text-left font-bold text-navy"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map((i) => (
                        <tr key={i}>
                          {modele.tableau!.colonnes.map((c) => (
                            <td key={c} className="border-b border-line px-3 py-4">
                              &nbsp;
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <p className="eyebrow mt-6 mb-2">Ce qui fait recaler la pièce</p>
            <ul className="flex flex-col gap-2 text-sm text-ink/90">
              {modele.pieges.map((p) => (
                <li key={p} className="border-l-2 border-gold pl-3">
                  {p}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-line pt-4 text-xs text-grey">
              {MODELES_AVERTISSEMENT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
