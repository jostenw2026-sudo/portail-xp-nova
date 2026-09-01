"use client";

/**
 * TerrainForm — la saisie d'un prospect sur le terrain.
 *
 * Trois contraintes de terrain commandent tout ce qui suit, et expliquent
 * pourquoi ce composant ne ressemble pas au reste du portail :
 *
 *   1. UN TÉLÉPHONE, DEBOUT, PARFOIS SOUS LE SOLEIL. Cibles larges, listes de
 *      boutons plutôt que menus déroulants, aucune saisie libre qu'on puisse
 *      remplacer par un choix.
 *   2. UNE CONNEXION QUI TOMBE. Rien ne se perd : le brouillon est écrit dans
 *      le navigateur à chaque frappe, et une fiche qui n'a pas pu partir entre
 *      dans une file d'attente locale qu'on renvoie plus tard, au bureau.
 *   3. L'AGENT N'EST PAS LE PROMOTEUR. Il ne connaît ni les codes du cycle ni la
 *      grille tarifaire. Les treize étapes sont donc écrites en clair, et
 *      l'offre pressentie se calcule toute seule pendant qu'il saisit — c'est
 *      ce qui permet de parler chiffres devant le prospect, dès le premier
 *      rendez-vous, sans rien inventer.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TYPES_PROSPECT, NIVEAUX, FILIERES, GROUPES_FILIERE, ORDRE_GROUPES, getFiliere,
  NIVEAUX_TRANSFORMATION, cataloguesMobilises, LIBELLE_CATALOGUE, REGIONS, ETAPES_CYCLE,
  BLOCAGES, DOCUMENTS, CAPACITES_FINANCEMENT, ECHEANCES, PARCOURS, FOD, PRODUITS_EN_LIGNE,
  calculerOffre, niveauParDefaut, validerFiche, fcfa, semaines, pourcent,
  GRILLE_REFERENCE,
  type FicheTerrain, type NiveauPrix,
} from "@/lib/portal/terrain";

const CLE_BROUILLON = "xpn.terrain.brouillon";
const CLE_FILE = "xpn.terrain.file";

const VIDE: FicheTerrain = { nomContact: "", documents: [], consentement: false };

/* ------------------------------------------------------------ stockage ----
 * Toujours sous try/catch : en navigation privée, l'accès au stockage lève.
 * Une erreur de stockage ne doit jamais empêcher de saisir une fiche. */
function lire<T>(cle: string, defaut: T): T {
  try {
    const v = window.localStorage.getItem(cle);
    return v ? (JSON.parse(v) as T) : defaut;
  } catch { return defaut; }
}
function ecrire(cle: string, valeur: unknown): void {
  try { window.localStorage.setItem(cle, JSON.stringify(valeur)); } catch { /* sans effet */ }
}

/* -------------------------------------------------------------- briques --- */

function Section({ n, titre, aide, children }: { n: number; titre: string; aide: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{n}</span>
        <div>
          <h2 className="title-3 text-navy">{titre}</h2>
          <p className="mt-0.5 text-sm text-grey">{aide}</p>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Champ({ label, aide, children }: { label: string; aide?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy">{label}</span>
      {aide && <span className="mt-0.5 block text-xs text-grey">{aide}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none focus:border-royal";

/** Liste de boutons — remplace un menu déroulant partout où les choix tiennent. */
function Choix<T extends string | number>({
  options, valeur, onChange, colonnes = "auto",
}: {
  options: { v: T; label: string; sous?: string }[];
  valeur: T | null | undefined;
  onChange: (v: T | null) => void;
  colonnes?: "auto" | "1" | "2";
}) {
  const grille = colonnes === "1" ? "grid-cols-1" : colonnes === "2" ? "grid-cols-1 sm:grid-cols-2" : "";
  return (
    <div className={grille ? `grid gap-2 ${grille}` : "flex flex-wrap gap-2"}>
      {options.map((o) => {
        const actif = valeur === o.v;
        return (
          <button
            key={String(o.v)} type="button"
            aria-pressed={actif}
            onClick={() => onChange(actif ? null : o.v)}
            className={
              "rounded-md border px-3 py-2.5 text-left text-sm transition-colors " +
              (actif
                ? "border-navy bg-navy text-white"
                : "border-line bg-paper text-ink hover:border-navy hover:bg-light")
            }
          >
            <span className="font-semibold">{o.label}</span>
            {o.sous && <span className={"mt-0.5 block text-xs " + (actif ? "text-white/75" : "text-grey")}>{o.sous}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Cases à cocher en pastilles — pour les documents déjà en main. */
function Pastilles({ options, valeurs, onToggle }: {
  options: readonly { code: string; label: string }[];
  valeurs: string[];
  onToggle: (code: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const actif = valeurs.includes(o.code);
        return (
          <button
            key={o.code} type="button" aria-pressed={actif} onClick={() => onToggle(o.code)}
            className={
              "rounded-full border px-3.5 py-2 text-sm transition-colors " +
              (actif ? "border-navy bg-navy font-semibold text-white" : "border-line bg-paper text-ink hover:border-navy")
            }
          >
            {actif ? "✓ " : ""}{o.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================== le composant = */

export default function TerrainForm({ agent }: { agent: string }) {
  const [f, setF] = useState<FicheTerrain>(VIDE);
  const [file, setFile] = useState<FicheTerrain[]>([]);
  const [etat, setEtat] = useState<"prêt" | "envoi" | "ok" | "erreur">("prêt");
  const [message, setMessage] = useState<string>("");
  const [charge, setCharge] = useState(false);

  /**
   * Reprise du brouillon et de la file d'attente au montage.
   *
   * La règle `set-state-in-effect` est désactivée ici en connaissance de cause :
   * `localStorage` n'existe pas au rendu serveur, et initialiser l'état
   * paresseusement depuis le stockage provoquerait une divergence
   * d'hydratation. Rendre l'état vide puis le remplir au montage — avec le
   * drapeau `charge` qui masque le formulaire entre-temps — est le seul
   * enchaînement correct pour une reprise de brouillon en Next.js.
   */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setF(lire<FicheTerrain>(CLE_BROUILLON, VIDE));
    setFile(lire<FicheTerrain[]>(CLE_FILE, []));
    setCharge(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => { if (charge) ecrire(CLE_BROUILLON, f); }, [f, charge]);
  useEffect(() => { if (charge) ecrire(CLE_FILE, file); }, [file, charge]);

  const maj = useCallback(<K extends keyof FicheTerrain>(k: K, v: FicheTerrain[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setEtat("prêt"); setMessage("");
  }, []);

  const basculerDoc = useCallback((code: string) => {
    setF((p) => {
      const d = p.documents ?? [];
      return { ...p, documents: d.includes(code) ? d.filter((x) => x !== code) : [...d, code] };
    });
  }, []);

  const niveau: NiveauPrix = f.niveau ?? niveauParDefaut(f.typeProspect ?? "");
  const filiereChoisie = getFiliere(f.filiere);
  const catalogues = cataloguesMobilises(f.filiere, f.niveauTransformation);
  const offre = useMemo(
    () => calculerOffre(
      { typeProspect: f.typeProspect, niveau, etapeCycle: f.etapeCycle, blocage: f.blocage,
        documents: f.documents, capex: f.capex, opexAn1: f.opexAn1, capacite: f.capacite, echeance: f.echeance },
      f.parcoursRetenu,
    ),
    [f, niveau],
  );
  const erreurs = useMemo(() => validerFiche(f), [f]);

  async function envoyer(fiche: FicheTerrain): Promise<{ ok: boolean; message: string }> {
    const res = await fetch("/api/portal/terrain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fiche, saisiLe: fiche.saisiLe ?? new Date().toLocaleString("fr-FR") }),
    });
    const data = (await res.json().catch(() => ({}))) as { erreur?: string; parcours?: string; prixIndicatif?: number };
    if (!res.ok) return { ok: false, message: data.erreur ?? `Envoi refusé (${res.status}).` };
    return { ok: true, message: `Fiche enregistrée dans le CRM — ${data.parcours}, ${fcfa(data.prixIndicatif ?? 0)} indicatif.` };
  }

  async function soumettre() {
    if (erreurs.length) { setEtat("erreur"); setMessage(erreurs[0]); return; }
    setEtat("envoi"); setMessage("Envoi en cours…");
    const fiche = { ...f, saisiLe: new Date().toLocaleString("fr-FR") };
    try {
      const r = await envoyer(fiche);
      if (r.ok) { setEtat("ok"); setMessage(r.message); setF(VIDE); }
      else { setEtat("erreur"); setMessage(r.message); }
    } catch {
      // Panne réseau : la fiche entre en file d'attente, elle n'est jamais perdue.
      setFile((q) => [...q, fiche]);
      setF(VIDE);
      setEtat("ok");
      setMessage("Pas de réseau : la fiche est gardée sur cet appareil. Renvoyez-la depuis la file d'attente dès que vous captez.");
    }
  }

  async function viderFile() {
    setEtat("envoi"); setMessage(`Renvoi de ${file.length} fiche(s)…`);
    const restantes: FicheTerrain[] = [];
    let envoyees = 0;
    for (const fiche of file) {
      try {
        const r = await envoyer(fiche);
        if (r.ok) envoyees++; else restantes.push(fiche);
      } catch { restantes.push(fiche); }
    }
    setFile(restantes);
    setEtat(restantes.length ? "erreur" : "ok");
    setMessage(
      restantes.length
        ? `${envoyees} fiche(s) envoyée(s), ${restantes.length} encore en attente.`
        : `${envoyees} fiche(s) envoyée(s). La file est vide.`,
    );
  }

  if (!charge) {
    return <p className="rounded-lg border border-line bg-light p-5 text-grey">Préparation du formulaire…</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="grid gap-5">
        {file.length > 0 && (
          <div className="rounded-lg border border-gold bg-gold/10 p-4">
            <p className="font-semibold text-navy">
              {file.length} fiche{file.length > 1 ? "s" : ""} en attente sur cet appareil
            </p>
            <p className="mt-1 text-sm text-grey">
              Elles n&apos;ont pas pu partir faute de réseau. Elles restent ici, même si vous fermez le navigateur.
            </p>
            <button type="button" onClick={viderFile} disabled={etat === "envoi"}
              className="mt-3 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              Tout renvoyer maintenant
            </button>
          </div>
        )}

        <Section n={1} titre="Qui est en face" aide="Le minimum pour pouvoir le rappeler.">
          <Champ label="Nom du contact"><input className={inputCls} value={f.nomContact}
            onChange={(e) => maj("nomContact", e.target.value)} placeholder="Nom et prénom" autoComplete="off" /></Champ>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Téléphone" aide="WhatsApp de préférence"><input className={inputCls} type="tel" inputMode="tel"
              value={f.telephone ?? ""} onChange={(e) => maj("telephone", e.target.value)} placeholder="+237 6…" /></Champ>
            <Champ label="E-mail"><input className={inputCls} type="email" inputMode="email"
              value={f.email ?? ""} onChange={(e) => maj("email", e.target.value)} /></Champ>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Structure" aide="Vide si c'est un particulier"><input className={inputCls}
              value={f.raisonSociale ?? ""} onChange={(e) => maj("raisonSociale", e.target.value)} /></Champ>
            <Champ label="Sa fonction"><input className={inputCls}
              value={f.fonction ?? ""} onChange={(e) => maj("fonction", e.target.value)} placeholder="Promoteur, président…" /></Champ>
          </div>
          <Champ label="Type de prospect" aide="Détermine le niveau de prix proposé.">
            <Choix colonnes="2" valeur={f.typeProspect ?? null} onChange={(v) => maj("typeProspect", v ?? undefined)}
              options={TYPES_PROSPECT.map((t) => ({ v: t, label: t }))} />
          </Champ>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Ville ou localité"><input className={inputCls}
              value={f.ville ?? ""} onChange={(e) => maj("ville", e.target.value)} /></Champ>
            <Champ label="Région">
              <select className={inputCls} value={f.region ?? ""} onChange={(e) => maj("region", e.target.value || undefined)}>
                <option value="">—</option>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Champ>
          </div>
        </Section>

        <Section n={2} titre="Où en est son projet" aide="C'est cette réponse qui décide du parcours à lui proposer.">
          <Champ label="Filière" aide="Référentiel des 29 filières (note du 29 août 2026).">
            <select className={inputCls} value={f.filiere ?? ""} onChange={(e) => maj("filiere", e.target.value || undefined)}>
              <option value="">—</option>
              {ORDRE_GROUPES.map((g) => (
                <optgroup key={g} label={GROUPES_FILIERE[g]}>
                  {FILIERES.filter((x) => x.groupe === g).map((x) => (
                    <option key={x.code} value={x.code}>
                      {x.code} — {x.nom}{x.statut === "propose" ? " (à confirmer)" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Champ>
          {filiereChoisie?.statut === "propose" && (
            <p className="-mt-2 rounded-md border border-gold bg-gold/10 p-3 text-sm text-ink">
              <b>{filiereChoisie.nom}</b> est une filière proposée, pas encore confirmée au catalogue
              AGROVITA. Le catalogue de prestations peut ne pas la couvrir : signalez-le au promoteur
              avant de vous engager sur un périmètre.
            </p>
          )}
          <Champ label="Transforme-t-il ce qu'il produit ?" aide="Depuis le référentiel du 29 août, la transformation n'est plus une filière à part : c'est un niveau qui s'applique à la sienne.">
            <Choix colonnes="1" valeur={f.niveauTransformation ?? null}
              onChange={(v) => maj("niveauTransformation", v ?? undefined)}
              options={NIVEAUX_TRANSFORMATION.map((n) => ({ v: n.code, label: n.label, sous: n.aide }))} />
          </Champ>
          <Champ label="Étape du projet" aide="Choisissez ce qui décrit le mieux sa situation aujourd'hui.">
            <Choix colonnes="2" valeur={f.etapeCycle ?? null} onChange={(v) => maj("etapeCycle", v)}
              options={ETAPES_CYCLE.map((e) => ({ v: e.n, label: `${e.n}. ${e.titre}`, sous: e.enClair }))} />
          </Champ>
          <Champ label="Ce qui bloque" aide="À situation égale, un blocage change le parcours à proposer.">
            <Choix colonnes="1" valeur={f.blocage ?? null} onChange={(v) => maj("blocage", v ?? undefined)}
              options={BLOCAGES.map((b) => ({ v: b.code, label: b.label }))} />
          </Champ>
          <Champ label="Ce qu'il a déjà en main" aide="Ce qui existe ne se refacture pas — et c'est de quoi parler concrètement au premier rendez-vous.">
            <Pastilles options={DOCUMENTS} valeurs={f.documents ?? []} onToggle={basculerDoc} />
          </Champ>
          <Champ label="Son objectif dans les six mois" aide="Dans ses mots à lui.">
            <input className={inputCls} value={f.objectif ?? ""} onChange={(e) => maj("objectif", e.target.value)}
              placeholder="« Obtenir un crédit de 80 millions pour la ferme »" />
          </Champ>
        </Section>

        <Section n={3} titre="Combien pèse le projet" aide="CAPEX + première année d'OPEX : c'est l'assiette qui fixe le coefficient de taille.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Investissement annoncé (CAPEX)" aide="En FCFA, même approximatif.">
              <input className={inputCls} type="number" inputMode="numeric" min={0} step={1000000}
                value={f.capex ?? ""} onChange={(e) => maj("capex", e.target.value === "" ? null : Number(e.target.value))} />
            </Champ>
            <Champ label="Charges de la 1ʳᵉ année (OPEX)" aide="Si inconnu, laissez vide.">
              <input className={inputCls} type="number" inputMode="numeric" min={0} step={1000000}
                value={f.opexAn1 ?? ""} onChange={(e) => maj("opexAn1", e.target.value === "" ? null : Number(e.target.value))} />
            </Champ>
          </div>
          <Champ label="Avec quel argent">
            <Choix colonnes="2" valeur={f.capacite ?? null} onChange={(v) => maj("capacite", v ?? undefined)}
              options={CAPACITES_FINANCEMENT.map((c) => ({ v: c.code, label: c.label }))} />
          </Champ>
          <Champ label="Pour quand">
            <Choix valeur={f.echeance ?? null} onChange={(v) => maj("echeance", v ?? undefined)}
              options={ECHEANCES.map((c) => ({ v: c.code, label: c.label }))} />
          </Champ>
        </Section>

        <Section n={4} titre="Ce que vous en retenez" aide="Ce que le promoteur relira avant d'écrire la proposition.">
          <Champ label="Niveau de prix" aide="Proposé d'après le type de prospect ; corrigez si la situation le justifie.">
            <Choix valeur={niveau} onChange={(v) => maj("niveau", (v as NiveauPrix) ?? undefined)}
              options={(Object.keys(NIVEAUX) as NiveauPrix[]).map((n) => ({ v: n, label: NIVEAUX[n].label, sous: NIVEAUX[n].coef }))} />
          </Champ>
          <Champ label="Parcours retenu" aide="Laissez vide pour garder la recommandation automatique.">
            <select className={inputCls} value={f.parcoursRetenu ?? ""} onChange={(e) => maj("parcoursRetenu", e.target.value || undefined)}>
              <option value="">Recommandation automatique — {offre.parcours.code} {offre.parcours.nom}</option>
              {PARCOURS.map((p) => <option key={p.code} value={p.code}>{p.code} — {p.nom}</option>)}
            </select>
          </Champ>
          <Champ label="Notes" aide="Ce qui a été dit, ce qui a été promis, ce qui reste à vérifier.">
            <textarea className={inputCls + " min-h-28"} value={f.notes ?? ""} onChange={(e) => maj("notes", e.target.value)} />
          </Champ>
          <label className="flex items-start gap-3 rounded-md border border-line bg-light p-3">
            <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={f.consentement ?? false}
              onChange={(e) => maj("consentement", e.target.checked)} />
            <span className="text-sm text-ink">
              <b>Le prospect est informé</b> que XP-NOVA conserve ses coordonnées pour le recontacter, et il l&apos;accepte.
              <span className="mt-0.5 block text-xs text-grey">Sans cette case, la fiche est enregistrée mais signalée « ne pas démarcher ».</span>
            </span>
          </label>
        </Section>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-paper p-4 shadow-lg">
          <button type="button" onClick={soumettre} disabled={etat === "envoi" || erreurs.length > 0}
            className="rounded-md bg-navy px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-royal disabled:opacity-50">
            {etat === "envoi" ? "Envoi…" : "Enregistrer la fiche"}
          </button>
          <button type="button" onClick={() => { setF(VIDE); setEtat("prêt"); setMessage(""); }}
            className="rounded-md border border-line px-4 py-3 text-sm font-semibold text-grey hover:bg-light">
            Vider
          </button>
          <p aria-live="polite" className={
            "text-sm " + (etat === "ok" ? "font-semibold text-green-700" : etat === "erreur" ? "font-semibold text-red-700" : "text-grey")
          }>
            {message || (erreurs.length ? erreurs[0] : "")}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------- l'offre pressentie */}
      <aside className="lg:sticky lg:top-6">
        <div className="rounded-lg border border-navy bg-navy p-5 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Offre pressentie</p>
          <p className="mt-2 font-display text-2xl leading-tight">{offre.parcours.code} — {offre.parcours.nom}</p>
          <p className="mt-1.5 text-sm text-white/75">{offre.parcours.promesse}</p>

          <div className="mt-4 border-t border-white/20 pt-4">
            <p className="font-display text-3xl text-gold">{fcfa(offre.prixIndexe)}</p>
            <p className="mt-1 text-sm text-white/75">
              {NIVEAUX[offre.niveau].label} · {semaines(offre.delaiSemaines)}
              {offre.assiette ? ` · ${offre.trancheNom} (×${String(offre.coefTaille).replace(".", ",")})` : ""}
            </p>
            <p className="mt-1 text-xs text-white/60">+ {fcfa(FOD)} de frais d&apos;ouverture, imputables sur la première facture.</p>
          </div>

          <p className="mt-4 rounded-md bg-white/10 p-3 text-sm text-white/90">{offre.motif}</p>

          {catalogues.length > 0 && (
            <p className="mt-3 text-sm text-white/75">
              Prestations à puiser dans&nbsp;: {catalogues.map((c) => LIBELLE_CATALOGUE[c]).join(" + ")}.
            </p>
          )}

          {offre.vraisemblable === false && (
            <div className="mt-3 rounded-md bg-white p-3 text-sm text-red-700">
              <p className="font-semibold">
                L&apos;offre pèse {pourcent(offre.partDuProjet)} du coût du projet, au-delà du plafond
                de {pourcent(offre.plafondVraisemblance)}.
              </p>
              {offre.orienterProduitsEnLigne ? (
                <>
                  <p className="mt-1.5 text-ink">
                    Le projet est trop petit pour une mission d&apos;ingénierie, l&apos;offre Essentiel comprise.
                    N&apos;essayez pas de baisser le prix : orientez-le vers un produit en ligne.
                  </p>
                  <ul className="mt-2 grid gap-1 text-ink">
                    {PRODUITS_EN_LIGNE.map((x) => (
                      <li key={x.code} className="flex justify-between gap-3">
                        <span>{x.nom}</span>
                        <span className="shrink-0 font-semibold">{fcfa(x.prix)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-1.5 text-ink">
                  Réduire le périmètre plutôt que le prix — proposez l&apos;offre Essentiel (PT-00).
                </p>
              )}
            </div>
          )}
          {!f.capex && (
            <p className="mt-3 rounded-md bg-white/10 p-3 text-sm text-white/80">
              Renseignez le CAPEX : sans lui, le prix n&apos;est pas indexé sur la taille du projet.
            </p>
          )}
          {offre.alternatives.length > 0 && (
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">À évoquer aussi</p>
              <ul className="mt-2 grid gap-1.5 text-sm">
                {offre.alternatives.map((a) => (
                  <li key={a.parcours.code} className="flex justify-between gap-3">
                    <span className="text-white/85">{a.parcours.code} {a.parcours.nom}</span>
                    <span className="shrink-0 font-semibold text-gold">{fcfa(a.prix)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-grey">
          Prix issus de la grille {GRILLE_REFERENCE}. Montant <b>indicatif</b> : il sert à cadrer la conversation,
          il ne vaut pas devis et sera confirmé au chiffrage. Saisie par {agent}.
        </p>
      </aside>
    </div>
  );
}
