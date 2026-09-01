/**
 * lib/portal/terrainCrm.ts — traduire une fiche terrain en piste Odoo.
 *
 * Serveur uniquement : ce module lit les identifiants Odoo de l'environnement.
 * Il s'appuie sur `@/lib/odoo` (le client d'écriture déjà utilisé par les
 * formulaires publics du site) et non sur `@/lib/portal/odoo`, qui est en
 * lecture seule avec un compte de service distinct.
 *
 * Il reprend, à l'identique, la mécanique de résolution du site AgroVita
 * (`lib/crm.ts`, évolutions E3/E4/E7 de la note NS-20260824/DG/XPN) — équipe,
 * étape, provenance — pour une raison simple : les pistes des deux sites
 * doivent atterrir dans le même pipeline, avec les mêmes étiquettes, sinon les
 * rapports d'Odoo comptent deux fois la même chose.
 *
 * PRINCIPE DIRECTEUR, hérité de la note : RIEN N'EST OBLIGATOIRE. Tant que
 * l'exploitant n'a pas créé les équipes, les étapes ou les champs dans Odoo, ce
 * module pose simplement moins de valeurs et la piste est créée sans elles.
 * Une configuration Odoo incomplète ne doit jamais faire perdre une fiche —
 * et sur le terrain, une fiche perdue ne se rattrape pas.
 */
import { odooCreate, odooSearchRead } from "@/lib/odoo";
import {
  calculerOffre, fcfa, getFiliere, getParcours, semaines, pourcent,
  BLOCAGES, DOCUMENTS, CAPACITES_FINANCEMENT, ECHEANCES, ETAPES_CYCLE, NIVEAUX_TRANSFORMATION, cataloguesMobilises, LIBELLE_CATALOGUE,
  NIVEAUX, GRILLE_REFERENCE, FOD, PRODUITS_EN_LIGNE,
  type FicheTerrain,
} from "./terrain";

/** Provenance UTM propre à la saisie terrain — la distinguer des cinq sources du site. */
const UTM_SOURCE = "XP-NOVA — saisie terrain (portail)";
const UTM_MEDIUM = "Terrain";

/** Noms d'équipe acceptés, par ordre de préférence — voir `lib/crm.ts` d'AgroVita.
 *  Les variantes ne sont pas de la coquetterie : l'apostrophe typographique de
 *  « Missions d'ingénierie » ne survit pas toujours à une saisie au clavier. */
const EQUIPES = ["Missions d’ingénierie", "Missions d'ingénierie", "Missions ingenierie", "Missions"];
/** « À qualifier » est contractuel : c'est le nom que les deux sites cherchent. */
const ETAPES_ENTREE = ["À qualifier", "A qualifier", "Nouveau", "New"];

/* --------------------------------------------------------------- cache ---
 * On ne mémorise QUE les résultats positifs. Un `null` — l'équipe n'existe pas
 * encore — n'est jamais caché : sinon l'exploitant la créerait dans Odoo et le
 * portail continuerait à l'ignorer pendant toute la durée du cache. */
const TTL = 30 * 60 * 1000;
const memo = new Map<string, { v: number; exp: number }>();
const lu = (k: string): number | null => {
  const e = memo.get(k);
  if (!e) return null;
  if (Date.now() > e.exp) { memo.delete(k); return null; }
  return e.v;
};
const ecrit = (k: string, v: number): number => { memo.set(k, { v, exp: Date.now() + TTL }); return v; };
export const oublierConfigurationCrm = (): void => void memo.clear();

async function teamId(): Promise<number | null> {
  const k = "team";
  const c = lu(k);
  if (c !== null) return c;
  const rows = await odooSearchRead("crm.team", [["name", "in", EQUIPES]], ["id", "name"]);
  for (const nom of EQUIPES) {
    const r = rows.find((x) => String(x.name) === nom);
    if (r) return ecrit(k, r.id as number);
  }
  return null;
}

/** Étape d'entrée DANS le pipeline visé. À nom égal : l'étape de l'équipe, puis
 *  une étape partagée, puis n'importe laquelle (instance non configurée). */
async function stageId(team: number | null): Promise<number | null> {
  const k = `stage:${team ?? 0}`;
  const c = lu(k);
  if (c !== null) return c;
  const rows = await odooSearchRead("crm.stage", [["name", "in", ETAPES_ENTREE]], ["id", "name", "team_id"]);
  const equipeDe = (r: Record<string, unknown>) => (Array.isArray(r.team_id) ? (r.team_id[0] as number) : null);
  const parNom = (garde: (r: Record<string, unknown>) => boolean) => {
    for (const nom of ETAPES_ENTREE) {
      const r = rows.find((x) => String(x.name) === nom && garde(x));
      if (r) return r.id as number;
    }
    return null;
  };
  const trouve =
    (team ? parNom((r) => equipeDe(r) === team) : null) ??
    (team ? parNom((r) => equipeDe(r) === null) : null) ??
    parNom(() => true);
  return trouve === null ? null : ecrit(k, trouve);
}

async function utmId(modele: "utm.source" | "utm.medium", nom: string): Promise<number | null> {
  const k = `${modele}:${nom}`;
  const c = lu(k);
  if (c !== null) return c;
  const rows = await odooSearchRead(modele, [["name", "=", nom]], ["id"], { limit: 1 });
  if (rows.length) return ecrit(k, rows[0].id as number);
  return ecrit(k, await odooCreate(modele, { name: nom }));
}

/** Étiquettes CRM : recherche par nom EXACT, crée les manquantes.
 *  Une majuscule ou un accent de différence crée un doublon — d'où les chaînes
 *  figées ici et dans `terrain.ts`, jamais reconstruites à la volée. */
async function tagIds(noms: string[]): Promise<number[]> {
  const uniques = Array.from(new Set(noms.map((n) => n.trim()).filter(Boolean)));
  if (!uniques.length) return [];
  const existants = await odooSearchRead("crm.tag", [["name", "in", uniques]], ["id", "name"]);
  const ids = existants.map((r) => r.id as number);
  const connus = new Set(existants.map((r) => String(r.name)));
  for (const n of uniques) if (!connus.has(n)) ids.push(await odooCreate("crm.tag", { name: n }));
  return ids;
}

/* ------------------------------------------------------- le récapitulatif --
 * Odoo affiche la description en HTML. C'est là que vit tout ce qui n'a pas de
 * champ dédié — et c'est ce que le promoteur relira avant d'écrire l'offre, donc
 * il est écrit pour être lu, pas pour être stocké. */
const ech = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const libelle = (liste: readonly { code: string; label: string }[], code?: string) =>
  liste.find((x) => x.code === code)?.label ?? "";

function recapitulatif(f: FicheTerrain, agent: string): string {
  const o = calculerOffre(
    { typeProspect: f.typeProspect, niveau: f.niveau, etapeCycle: f.etapeCycle, blocage: f.blocage,
      documents: f.documents, capex: f.capex, opexAn1: f.opexAn1, capacite: f.capacite, echeance: f.echeance },
    f.parcoursRetenu,
  );
  const etape = ETAPES_CYCLE.find((e) => e.n === f.etapeCycle);
  const docs = (f.documents ?? []).map((c) => libelle(DOCUMENTS, c)).filter(Boolean);
  const fil = getFiliere(f.filiere);

  const ligne = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:2px 12px 2px 0;color:#5a6072">${ech(k)}</td><td style="padding:2px 0"><b>${ech(v)}</b></td></tr>` : "";

  const situation = [
    ligne("Étape du cycle", etape ? `${etape.n} — ${etape.titre} (${etape.enClair})` : null),
    ligne("Ce qui bloque", f.blocage && f.blocage !== "aucun" ? libelle(BLOCAGES, f.blocage) : null),
    ligne("Filière", fil ? `${fil.code} — ${fil.nom}${fil.statut === "propose" ? " (filière proposée, à confirmer)" : ""}` : null),
    ligne("Niveau de transformation", NIVEAUX_TRANSFORMATION.find((n) => n.code === f.niveauTransformation)?.label),
    ligne("Catalogue(s) à mobiliser",
      cataloguesMobilises(f.filiere, f.niveauTransformation).map((c) => LIBELLE_CATALOGUE[c]).join(" + ") || null),
    ligne("Objectif à six mois", f.objectif),
    ligne("CAPEX déclaré", f.capex ? fcfa(f.capex) : null),
    ligne("OPEX première année", f.opexAn1 ? fcfa(f.opexAn1) : null),
    ligne("Assiette d'indexation", o.assiette ? `${fcfa(o.assiette)} — ${o.trancheNom}` : null),
    ligne("Capacité de financement", libelle(CAPACITES_FINANCEMENT, f.capacite)),
    ligne("Échéance visée", libelle(ECHEANCES, f.echeance)),
    ligne("Documents déjà en main", docs.length ? docs.join(" · ") : "aucun document déclaré"),
  ].join("");

  const alertes: string[] = [];
  if (o.vraisemblable === false) {
    alertes.push(
      `Contrôle de vraisemblance NON PASSÉ : l'offre représente ${pourcent(o.partDuProjet)} du coût de projet, ` +
      `au-delà du plafond de ${pourcent(o.plafondVraisemblance)} pour cette famille de parcours. ` +
      (o.orienterProduitsEnLigne
        ? `Même l'offre Essentiel dépasserait le plafond : ce projet est trop petit pour une mission. ` +
          `Orienter vers un produit en ligne — ${PRODUITS_EN_LIGNE.map((x) => `${x.nom} ${fcfa(x.prix)}`).join(" · ")}.`
        : `Réduire le périmètre (offre Essentiel, PT-00) plutôt que le prix.`),
    );
  }
  if (o.plafonne) alertes.push(`Multiplicateur combiné plafonné à ×2,00 (§ 6.1 de la note tarifaire).`);
  if (!f.capex) alertes.push(`CAPEX non renseigné : le prix affiché n'est pas indexé sur la taille du projet.`);
  if (f.consentement === false) alertes.push(`Le prospect n'a PAS consenti au traitement de ses données — ne pas le démarcher.`);
  if (fil?.statut === "propose") {
    alertes.push(
      `${fil.code} est une filière PROPOSÉE par le référentiel du 29/08, pas confirmée au catalogue AGROVITA : ` +
      `vérifier que le cahier des prestations la couvre avant de s'engager sur un périmètre.`,
    );
  }

  const offre =
    `<table style="border-collapse:collapse">` +
    ligne("Parcours pressenti", `${o.parcours.code} — ${o.parcours.nom}`) +
    ligne("Pourquoi", o.motif) +
    ligne("Niveau de prix", `${NIVEAUX[o.niveau].label} (${NIVEAUX[o.niveau].coef})`) +
    ligne("Prix de grille", fcfa(o.prixBase)) +
    ligne("Coefficient de taille", o.assiette ? `×${String(o.coefTaille).replace(".", ",")} — ${o.trancheNom}` : null) +
    ligne("PRIX INDICATIF", `${fcfa(o.prixIndexe)} · ${semaines(o.delaiSemaines)}`) +
    ligne("Part du coût de projet", o.partDuProjet != null ? `${pourcent(o.partDuProjet)} (plafond ${pourcent(o.plafondVraisemblance)})` : null) +
    ligne("Frais d'ouverture de dossier", `${fcfa(FOD)}, imputables sur la première facture`) +
    ligne("À proposer aussi", o.alternatives.map((a) => `${a.parcours.code} ${a.parcours.nom} (${fcfa(a.prix)})`).join(" · ") || null) +
    `</table>`;

  return [
    `<p><b>Fiche saisie sur le terrain</b> par ${ech(agent)}${f.saisiLe ? ` le ${ech(f.saisiLe)}` : ""}.</p>`,
    `<h3>Situation du prospect</h3><table style="border-collapse:collapse">${situation}</table>`,
    `<h3>Offre pressentie</h3>${offre}`,
    alertes.length ? `<h3>Points d'attention</h3><ul>${alertes.map((a) => `<li>${ech(a)}</li>`).join("")}</ul>` : "",
    f.notes ? `<h3>Notes de l'agent</h3><p>${ech(f.notes).replace(/\n/g, "<br>")}</p>` : "",
    `<p style="color:#5a6072;font-size:12px">Prix issus de la grille ${ech(GRILLE_REFERENCE)}. ` +
    `Montant indicatif calculé à la saisie : il ne vaut pas devis et doit être confirmé au chiffrage.</p>`,
  ].filter(Boolean).join("");
}

/* ----------------------------------------------------------- l'écriture -- */

export interface ResultatCreation {
  leadId: number;
  parcours: string;
  prixIndicatif: number;
}

/**
 * Crée la piste dans `crm.lead` et renvoie de quoi confirmer à l'agent.
 *
 * L'ordre compte : l'équipe d'abord (l'étape en dépend), puis les résolutions
 * accessoires, chacune sous son propre filet. Seul `odooCreate` peut faire
 * échouer l'appel — c'est voulu : tout le reste est du confort de rapport, et
 * aucun confort de rapport ne justifie de perdre une fiche saisie en brousse.
 */
export async function creerPisteTerrain(f: FicheTerrain, agent: { nom: string; email?: string }): Promise<ResultatCreation> {
  const offre = calculerOffre(
    { typeProspect: f.typeProspect, niveau: f.niveau, etapeCycle: f.etapeCycle, blocage: f.blocage,
      documents: f.documents, capex: f.capex, opexAn1: f.opexAn1, capacite: f.capacite, echeance: f.echeance },
    f.parcoursRetenu,
  );

  const valeurs: Record<string, unknown> = {
    name: `[terrain] ${f.nomContact}${f.raisonSociale ? ` — ${f.raisonSociale}` : ""} · ${offre.parcours.code}`,
    contact_name: f.nomContact,
    description: recapitulatif(f, agent.nom),
    expected_revenue: offre.prixIndexe,
  };
  if (f.email) valeurs.email_from = f.email;
  if (f.telephone) valeurs.phone = f.telephone;
  if (f.raisonSociale) valeurs.partner_name = f.raisonSociale;
  if (f.ville) valeurs.city = f.ville;
  // Priorité Odoo : '0' à '3', en chaîne. Une échéance immédiate se voit d'un coup d'œil.
  if (f.echeance === "immediat") valeurs.priority = "2";

  let team: number | null = null;
  try {
    team = await teamId();
    if (team) valeurs.team_id = team;
  } catch (e) { console.warn(`[terrain] équipe non résolue : ${(e as Error).message}`); }

  try {
    const s = await stageId(team);
    if (s) valeurs.stage_id = s;
  } catch (e) { console.warn(`[terrain] étape non résolue : ${(e as Error).message}`); }

  try {
    const [src, med] = await Promise.all([utmId("utm.source", UTM_SOURCE), utmId("utm.medium", UTM_MEDIUM)]);
    if (src) valeurs.source_id = src;
    if (med) valeurs.medium_id = med;
  } catch (e) { console.warn(`[terrain] provenance UTM non posée : ${(e as Error).message}`); }

  try {
    // Étiquettes : mêmes chaînes que le site AgroVita, pour ne pas dédoubler les
    // familles d'étiquettes dans Odoo. La filière est posée sous son seul NOM.
    const noms = ["Saisie terrain", `Parcours ${offre.parcours.nom}`];
    const fil = getFiliere(f.filiere);
    if (fil) noms.push(fil.nom);
    if (f.niveauTransformation && f.niveauTransformation !== "N0") noms.push(`Transformation ${f.niveauTransformation}`);
    if (f.etapeCycle) noms.push(etiquetteEtapeCycle(f.etapeCycle));
    if (offre.vraisemblable === false) noms.push("Vraisemblance à revoir");
    if (f.blocage && f.blocage !== "aucun") noms.push(libelle(BLOCAGES, f.blocage));
    const ids = await tagIds(noms);
    if (ids.length) valeurs.tag_ids = [[6, 0, ids]];
  } catch (e) { console.warn(`[terrain] étiquettes non posées : ${(e as Error).message}`); }

  const leadId = await odooCreate("crm.lead", valeurs);
  return { leadId, parcours: `${offre.parcours.code} — ${offre.parcours.nom}`, prixIndicatif: offre.prixIndexe };
}

/** Étiquette d'étape dans le vocabulaire du cycle — même forme que le site AgroVita
 *  depuis l'évolution E6 (« Cycle · étapes 6 à 8 »), pour réutiliser ses étiquettes. */
function etiquetteEtapeCycle(n: number): string {
  const groupes: number[][] = [[1, 2], [3, 4], [5], [6, 7, 8], [9], [10], [11, 12, 13]];
  const g = groupes.find((x) => x.includes(n)) ?? [n];
  if (g.length === 1) return `Cycle · étape ${g[0]}`;
  if (g.length === 2) return `Cycle · étapes ${g[0]} et ${g[1]}`;
  return `Cycle · étapes ${g[0]} à ${g[g.length - 1]}`;
}

export { getParcours };
