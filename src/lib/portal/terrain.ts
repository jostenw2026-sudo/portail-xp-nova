/**
 * lib/portal/terrain.ts — le référentiel et le calcul de la saisie terrain.
 *
 * Ce module est PUR : aucune dépendance serveur, aucun accès réseau. Il est
 * importé à la fois par le composant client (le formulaire) et par la route
 * d'API (la validation et l'écriture dans Odoo), de sorte que les deux côtés
 * appliquent exactement les mêmes règles. Toute divergence entre ce que l'agent
 * voit à l'écran et ce qui part dans le CRM viendrait d'ici, et de nulle part
 * ailleurs.
 *
 * Ce que la fiche doit permettre — et qui commande sa structure : connaître
 * assez le prospect pour lui faire une offre personnalisée. Trois choses
 * suffisent à cela, et le formulaire ne demande rien d'autre au-delà :
 *
 *   1. OÙ EN EST LE PROJET   → quel parcours type lui correspond (étape 1 à 13)
 *   2. COMBIEN IL PÈSE       → quel coefficient de taille s'applique (CAPEX + OPEX an 1)
 *   3. QUI EST EN FACE       → quel niveau de prix s'applique (Proximité / Référence / Bailleur)
 *
 * Les prix sont ceux de la grille tarifaire GT-20260826/DG/XPN, onglets
 * « 5_Parcours » et « 9_Indexation », recopiés sans arrondi supplémentaire.
 * Ils ne sont PAS calculés ici : les recalculer à partir des efforts
 * reproduirait la chaîne (aléa → taux mixte → plancher de marge → arrondi) et
 * dériverait de la grille au premier changement de paramètre. La grille reste
 * la source ; ce fichier en est une copie datée, et c'est écrit dans l'écran.
 */

export const GRILLE_REFERENCE = "GT-20260826/DG/XPN, grille du 26 août 2026";

/* ═══════════════════════════════════════════════════ 1. QUI EST EN FACE ═══ */

export const TYPES_PROSPECT = [
  "Promoteur individuel (personne physique)",
  "GIC / Coopérative",
  "Entreprise / société (SARL, SA…)",
  "Bailleur / institution / banque / EMF / ONG",
] as const;
export type TypeProspect = (typeof TYPES_PROSPECT)[number];

export type NiveauPrix = "proximite" | "reference" | "bailleur";

export const NIVEAUX: Record<NiveauPrix, { label: string; coef: string }> = {
  proximite: { label: "Proximité", coef: "×0,80" },
  reference: { label: "Référence", coef: "×1,00" },
  bailleur: { label: "Bailleur & institution", coef: "×1,25" },
};

/**
 * Niveau de prix suggéré par le type d'acteur — § 3 de la note tarifaire.
 * SUGGÉRÉ, pas imposé : l'agent peut le corriger, et une coopérative adossée à
 * un programme bailleur ne relève pas du niveau Proximité.
 */
export function niveauParDefaut(type: string): NiveauPrix {
  if (type === TYPES_PROSPECT[0] || type === TYPES_PROSPECT[1]) return "proximite";
  if (type === TYPES_PROSPECT[3]) return "bailleur";
  return "reference";
}

/* ══════════════════════════════════════════════════════ 2. LES FILIÈRES ═══ */

/**
 * Les 29 filières du référentiel NS-20260829/DG/XPN-REF1 (nomenclature V6),
 * arrêté par la Direction Générale le 30/08/2026 comme référentiel unique.
 *
 * Quatre domaines : FV végétal (9), FA animal / élevage terrestre (9),
 * FH halieutique et aquacole (3), FF forestier (8).
 *
 * ⚠ CE RÉFÉRENTIEL REMPLACE celui de `lib/taxonomy.ts` du site AgroVita
 * (19 filières FV/FE/FT). Trois écarts ont des conséquences opérationnelles,
 * et il faut les avoir en tête en lisant les anciennes pistes du CRM :
 *
 *   — les volailles passent de FE05 à FA01, les bovins de FE01 à FA04 ;
 *   — « Caprins » et « Ovins », séparés jusqu'ici, FUSIONNENT en FA03 ;
 *   — le groupe FT (Transformation végétale / animale / mixte…) DISPARAÎT en
 *     tant que filière. En V6 la transformation n'est plus une filière mais un
 *     NIVEAU appliqué à chacune des 29 — d'où le champ `niveauTransformation`
 *     ci-dessous, sans lequel un projet d'unité de transformation deviendrait
 *     inclassable.
 *
 * Le `statut` reprend celui de la note : « confirme » = filière publiée sur
 * agrovita.xp-nova.com/filieres ; « propose » = filière complémentaire que la
 * note elle-même donne à confiance faible à moyenne. Le formulaire le signale
 * à l'agent plutôt que de le laisser croire à un référentiel homogène.
 */
export type DomaineCatalogue = "FV" | "FA" | "FH" | "FF" | "FT" | "FI";

export interface Filiere {
  code: string;
  nom: string;
  groupe: "FV" | "FA" | "FH" | "FF";
  statut: "confirme" | "propose";
  /**
   * Domaine du CATALOGUE de prestations qui sert cette filière — le préfixe des
   * codes `XX-Pn-Em-nn`.
   *
   * Depuis la grille GT-20260831 les deux nomenclatures COÏNCIDENT : le
   * catalogue a été mis en conformité avec le V6, les domaines FH et FF ont été
   * créés (treize prestations chacun), et FT et FI ont cessé d'être des
   * domaines de production pour devenir des volets de transformation appelés
   * par le niveau déclaré. Chaque filière a donc un catalogue ; le type garde
   * `| null` par sécurité, mais plus aucune filière ne le vaut.
   */
  catalogue: DomaineCatalogue | null;
}
export const FILIERES: Filiere[] = [
  { code: "FV01", nom: "Cultures de rente", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV02", nom: "Cultures vivrières", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV03", nom: "Filière maraîchère", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV04", nom: "Fruits tropicaux", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV05", nom: "Huiles & oléagineux", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV06", nom: "Plantes médicinales", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV07", nom: "Plantes aromatiques & épices", groupe: "FV", statut: "confirme" , catalogue: "FV" },
  { code: "FV08", nom: "Semencière", groupe: "FV", statut: "propose" , catalogue: "FV" },
  { code: "FV09", nom: "Floricole / horticulture ornementale", groupe: "FV", statut: "propose" , catalogue: "FV" },
  { code: "FA01", nom: "Volailles", groupe: "FA", statut: "confirme" , catalogue: "FA" },
  { code: "FA02", nom: "Porcins", groupe: "FA", statut: "confirme" , catalogue: "FA" },
  { code: "FA03", nom: "Caprins & ovins", groupe: "FA", statut: "confirme" , catalogue: "FA" },
  { code: "FA04", nom: "Bovins (viande & lait)", groupe: "FA", statut: "confirme" , catalogue: "FA" },
  { code: "FA05", nom: "Apicole", groupe: "FA", statut: "propose" , catalogue: "FA" },
  { code: "FA06", nom: "Cunicole", groupe: "FA", statut: "propose" , catalogue: "FA" },
  { code: "FA07", nom: "Équine & asine", groupe: "FA", statut: "propose" , catalogue: "FA" },
  { code: "FA08", nom: "Cynégétique / élevage de gibier", groupe: "FA", statut: "propose" , catalogue: "FA" },
  { code: "FA09", nom: "Héliciicole", groupe: "FA", statut: "propose" , catalogue: "FA" },
  { code: "FH01", nom: "Aquaculture", groupe: "FH", statut: "confirme" , catalogue: "FH" },
  { code: "FH02", nom: "Halieutique marine", groupe: "FH", statut: "propose" , catalogue: "FH" },
  { code: "FH03", nom: "Halieutique continentale", groupe: "FH", statut: "propose" , catalogue: "FH" },
  { code: "FF01", nom: "Bois d'œuvre et de service", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF02", nom: "Miel forestier (sauvage)", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF03", nom: "Fruits, graines & oléagineux sauvages", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF04", nom: "Champignons & insectes comestibles", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF05", nom: "Boissons fermentées de sève (vin de palme / raphia)", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF06", nom: "PFNL non alimentaires", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF07", nom: "Bambou", groupe: "FF", statut: "propose" , catalogue: "FF" },
  { code: "FF08", nom: "Reboisement, foresterie communautaire & carbone", groupe: "FF", statut: "propose" , catalogue: "FF" },
];
export const GROUPES_FILIERE: Record<Filiere["groupe"], string> = {
  FV: "Végétal",
  FA: "Animal — élevage terrestre",
  FH: "Halieutique et aquacole",
  FF: "Forestier",
};
export const ORDRE_GROUPES: Filiere["groupe"][] = ["FV", "FA", "FH", "FF"];
export const getFiliere = (code?: string | null): Filiere | undefined =>
  code ? FILIERES.find((f) => f.code === code.toUpperCase()) : undefined;

export const LIBELLE_CATALOGUE: Record<DomaineCatalogue, string> = {
  FV: "Catalogue végétal",
  FA: "Catalogue élevage",
  FH: "Catalogue halieutique",
  FF: "Catalogue forestier",
  FT: "Volet transformation agroalimentaire",
  FI: "Volet transformation industrielle",
};

/**
 * Les domaines du catalogue mobilisés par une situation donnée.
 *
 * Une filière en apporte un (celui de sa production) ; un niveau de
 * transformation N2 ou plus en ajoute un second — c'est précisément ce que
 * l'ancien groupe FT portait comme filière et que le V6 porte comme niveau.
 * N4 (valorisation des co-produits) relève de l'industrie.
 */
export function cataloguesMobilises(codeFiliere?: string | null, niveauTransfo?: string | null): DomaineCatalogue[] {
  // N1 n'appelle aucun volet : conditionner n'est pas transformer.
  const out: DomaineCatalogue[] = [];
  const f = getFiliere(codeFiliere);
  if (f?.catalogue) out.push(f.catalogue);
  if (niveauTransfo === "N2" || niveauTransfo === "N3") out.push("FT");
  if (niveauTransfo === "N4") out.push("FI");
  return Array.from(new Set(out));
}

/**
 * Niveaux de transformation N1–N4 — Partie II du référentiel V6.
 *
 * Ce champ porte à lui seul ce que l'ancien groupe FT décrivait par des
 * filières séparées. Il est donc obligatoire au sens métier dès qu'il y a
 * transformation, sans quoi « manioc » ne distingue plus le producteur de
 * tubercules du fabricant de farine conditionnée.
 *
 * Il ne modifie AUCUN prix : la grille tarifaire ne comporte pas de coefficient
 * de transformation, et en inventer un serait exactement le genre de chiffre
 * dont personne ne saurait plus d'où il sort. Il sert au ciblage de l'offre et
 * au choix du catalogue, pas au chiffrage.
 */
export const NIVEAUX_TRANSFORMATION = [
  { code: "N0", label: "Aucune — production primaire seulement", aide: "Il vend sa récolte ou ses bêtes telles quelles." },
  { code: "N1", label: "N1 — première transformation", aide: "Trié, lavé, calibré, emballé. Rien n'est modifié chimiquement." },
  { code: "N2", label: "N2 — seconde transformation", aide: "Ingrédients et intrants vendus à d'autres entreprises (farine, huile brute…)." },
  { code: "N3", label: "N3 — troisième transformation", aide: "Produit fini étiqueté, vendu au consommateur ou à la restauration." },
  { code: "N4", label: "N4 — valorisation des co-produits", aide: "Économie circulaire : déchets et sous-produits valorisés." },
] as const;

export const REGIONS = [
  "Adamaoua", "Centre", "Est", "Extrême-Nord", "Littoral",
  "Nord", "Nord-Ouest", "Ouest", "Sud", "Sud-Ouest", "Hors Cameroun",
] as const;

/* ═════════════════════════════════════════════ 3. OÙ EN EST LE PROJET ═════ */

/**
 * Les treize étapes du cycle. C'est la question qui commande le parcours, donc
 * l'offre : elle est posée en toutes lettres, dans les mots du promoteur, parce
 * qu'un agent de terrain ne fera pas la conversion « étape 6 » tout seul.
 */
export interface EtapeCycle {
  n: number;
  titre: string;
  enClair: string;
}
export const ETAPES_CYCLE: EtapeCycle[] = [
  { n: 1, titre: "Cadrer l'idée", enClair: "Il a une idée, rien n'est écrit." },
  { n: 2, titre: "Analyser le problème", enClair: "Il cerne le besoin et le terrain." },
  { n: 3, titre: "Étudier le marché", enClair: "Il cherche à savoir si ça se vend." },
  { n: 4, titre: "Concevoir l'offre", enClair: "Il définit son produit et ses clients." },
  { n: 5, titre: "Concevoir l'outil de production", enClair: "Il dimensionne l'exploitation ou l'usine." },
  { n: 6, titre: "Modéliser les finances", enClair: "Il chiffre son investissement." },
  { n: 7, titre: "Monter le business plan", enClair: "Il a, ou veut, un dossier bancable." },
  { n: 8, titre: "Boucler le financement", enClair: "Il démarche banques et bailleurs." },
  { n: 9, titre: "Construire et réceptionner", enClair: "Le chantier est lancé ou imminent." },
  { n: 10, titre: "Exploiter", enClair: "L'exploitation tourne." },
  { n: 11, titre: "Préparer la mise en marché", enClair: "Il prépare la commercialisation." },
  { n: 12, titre: "Vendre", enClair: "Il vend ses premiers volumes." },
  { n: 13, titre: "Encaisser et tenir", enClair: "Il vend mais l'argent ne rentre pas bien." },
];

/**
 * Ce qui bloque. Deuxième entrée de la recommandation : à étape égale, un
 * dossier refusé par la banque relève de PT-08 (revue) et non de PT-04
 * (financer) — on ne remonte pas un dossier qu'on n'a pas d'abord relu.
 */
export const BLOCAGES = [
  { code: "aucun", label: "Rien de particulier — il avance normalement" },
  { code: "refus_banque", label: "Un dossier a déjà été refusé par une banque ou un bailleur" },
  { code: "exploitation_degradee", label: "L'activité existe mais perd de l'argent" },
  { code: "conformite", label: "Une exigence de conformité, d'ESG ou de certification le bloque" },
  { code: "competences", label: "L'équipe n'a pas les compétences pour tenir l'exploitation" },
] as const;

/**
 * Documents déjà en main. Sert à deux choses, et c'est le champ le plus
 * rentable de la fiche : il dit ce qu'il ne faut PAS refacturer, et il permet
 * d'ouvrir la conversation sur du concret dès le premier rendez-vous.
 */
export const DOCUMENTS = [
  { code: "idee_ecrite", label: "Une note d'idée ou un descriptif écrit" },
  { code: "etude_marche", label: "Une étude de marché" },
  { code: "business_plan", label: "Un business plan" },
  { code: "modele_financier", label: "Un modèle financier chiffré (Excel)" },
  { code: "devis_equipements", label: "Des devis d'équipements" },
  { code: "titre_foncier", label: "Un titre foncier ou un bail sur le site" },
  { code: "statuts", label: "Des statuts et un RCCM" },
  { code: "etats_financiers", label: "Des états financiers des exercices passés" },
  { code: "accord_financement", label: "Un accord ou une promesse de financement" },
] as const;

export const CAPACITES_FINANCEMENT = [
  { code: "fonds_propres", label: "Fonds propres disponibles" },
  { code: "instruction", label: "Financement en cours d'instruction" },
  { code: "programme", label: "Programme d'appui ou bailleur identifié" },
  { code: "aucune", label: "Aucune ressource identifiée à ce jour" },
] as const;

export const ECHEANCES = [
  { code: "immediat", label: "Tout de suite — moins d'un mois" },
  { code: "trimestre", label: "Ce trimestre" },
  { code: "semestre", label: "Dans les six mois" },
  { code: "indetermine", label: "Pas de date" },
] as const;

/* ═══════════════════════════════════════════ 4. LES PARCOURS ET LES PRIX ═══ */

export type FamilleParcours = "entree" | "cycle" | "transversal";

export interface Parcours {
  code: string;
  nom: string;
  famille: FamilleParcours;
  /** Étapes du cycle couvertes — vide pour les parcours transversaux. */
  etapes: number[];
  /** Prix ferme, niveau Référence, avant coefficient de taille (onglet 5_Parcours). */
  prix: Record<NiveauPrix, number>;
  /** Délai de réalisation, en semaines (onglet 5_Parcours). */
  delaiSemaines: number;
  /** Effort, en jours-homme — sert à expliquer le prix, jamais à le recalculer. */
  effort: number;
  /** Ce que le parcours règle, en une phrase, dans les mots du promoteur. */
  promesse: string;
}

export const PARCOURS: Parcours[] = [
  { code: "PT-00", nom: "Essentiel — dossier bancable", famille: "entree", etapes: [3, 4, 6, 7],
    prix: { proximite: 4350000, reference: 5300000, bailleur: 6400000 }, delaiSemaines: 13, effort: 47,
    promesse: "Le chemin le plus court vers un dossier présentable en banque, sans le cycle complet." },
  { code: "PT-01", nom: "Préqualifier", famille: "cycle", etapes: [1, 2],
    prix: { proximite: 1300000, reference: 1400000, bailleur: 1600000 }, delaiSemaines: 4.5, effort: 14,
    promesse: "Savoir si l'idée tient debout avant d'y engager le moindre franc." },
  { code: "PT-02", nom: "Décider d'investir", famille: "cycle", etapes: [3, 4],
    prix: { proximite: 2200000, reference: 2450000, bailleur: 2800000 }, delaiSemaines: 7, effort: 25,
    promesse: "Établir que le marché existe et arrêter l'offre à vendre." },
  { code: "PT-03", nom: "Concevoir l'outil", famille: "cycle", etapes: [5],
    prix: { proximite: 3000000, reference: 3750000, bailleur: 4700000 }, delaiSemaines: 10.5, effort: 34.5,
    promesse: "Dimensionner l'exploitation ou l'unité, et écrire son cahier des charges." },
  { code: "PT-04", nom: "Financer", famille: "cycle", etapes: [6, 7, 8],
    prix: { proximite: 7000000, reference: 8800000, bailleur: 10900000 }, delaiSemaines: 20.5, effort: 68.5,
    promesse: "Du modèle financier au décaissement : le dossier, sa défense et son bouclage." },
  { code: "PT-05", nom: "Construire et réceptionner", famille: "cycle", etapes: [9],
    prix: { proximite: 4150000, reference: 4900000, bailleur: 6200000 }, delaiSemaines: 14.5, effort: 48,
    promesse: "Suivre le chantier et réceptionner une installation qui fonctionne vraiment." },
  { code: "PT-06", nom: "Exploiter et tenir", famille: "cycle", etapes: [10],
    prix: { proximite: 2600000, reference: 3050000, bailleur: 3700000 }, delaiSemaines: 10, effort: 30.5,
    promesse: "Mettre en route l'exploitation et la tenir au niveau de performance prévu." },
  { code: "PT-07", nom: "Vendre et encaisser", famille: "cycle", etapes: [11, 12, 13],
    prix: { proximite: 3850000, reference: 4750000, bailleur: 5800000 }, delaiSemaines: 20, effort: 50.5,
    promesse: "Mettre le produit sur le marché et faire rentrer l'argent." },
  { code: "PT-08", nom: "Revue de dossier", famille: "transversal", etapes: [],
    prix: { proximite: 1450000, reference: 1900000, bailleur: 2350000 }, delaiSemaines: 3.5, effort: 12,
    promesse: "Dire pourquoi le dossier a été refusé, et ce qu'il faut reprendre." },
  { code: "PT-09", nom: "Redresser", famille: "transversal", etapes: [],
    prix: { proximite: 3300000, reference: 4000000, bailleur: 4900000 }, delaiSemaines: 12, effort: 36.5,
    promesse: "Diagnostiquer une exploitation qui perd de l'argent et la remettre à flot." },
  { code: "PT-10", nom: "Conformité et ESG", famille: "transversal", etapes: [],
    prix: { proximite: 3700000, reference: 4500000, bailleur: 5600000 }, delaiSemaines: 20.5, effort: 45.5,
    promesse: "Atteindre le niveau de conformité qu'exigent le bailleur ou le marché visé." },
  { code: "PT-11", nom: "Renforcement des capacités", famille: "transversal", etapes: [],
    prix: { proximite: 2700000, reference: 3200000, bailleur: 3850000 }, delaiSemaines: 18, effort: 40.5,
    promesse: "Former l'équipe à tenir l'exploitation sans nous." },
];
export const getParcours = (code?: string | null): Parcours | undefined =>
  code ? PARCOURS.find((p) => p.code === code) : undefined;

/* ══════════════════════════════════════ 5. INDEXATION SUR LE COÛT PROJET ══ */

/** Coefficient de taille — onglet 9_Indexation, section A. */
export const TRANCHES_TAILLE = [
  { nom: "Micro-projet", de: 0, a: 50_000_000, coef: 0.85 },
  { nom: "Petit projet", de: 50_000_000, a: 150_000_000, coef: 1.0 },
  { nom: "Projet moyen", de: 150_000_000, a: 400_000_000, coef: 1.2 },
  { nom: "Grand projet", de: 400_000_000, a: 1_000_000_000, coef: 1.45 },
  { nom: "Très grand projet", de: 1_000_000_000, a: Infinity, coef: 1.75 },
] as const;

/** Plafond du multiplicateur combiné niveau × taille — onglet 9_Indexation, section A. */
export const PLAFOND_MULTIPLICATEUR = 2.0;

/** Contrôle de vraisemblance — onglet 9_Indexation, section C. */
export const PLAFONDS_VRAISEMBLANCE: Record<FamilleParcours, number> = {
  entree: 0.1,
  cycle: 0.08,
  transversal: 0.03,
};

/** Frais d'ouverture de dossier, imputables sur la première facture (onglet 7). */
export const FOD = 250_000;

export function trancheDe(coutProjet: number) {
  return TRANCHES_TAILLE.find((t) => coutProjet >= t.de && coutProjet < t.a) ?? TRANCHES_TAILLE[0];
}

/**
 * Arrondi commercial — onglet 2_Paramètres. Le prix indexé n'est pas un montant
 * brut : il remonte au palier supérieur, comme tout prix ferme XP-NOVA.
 */
export function arrondiCommercial(montant: number): number {
  const palier = montant < 250_000 ? 5_000 : montant < 1_000_000 ? 25_000 : montant < 5_000_000 ? 50_000 : 100_000;
  return Math.ceil(montant / palier) * palier;
}

/* ═══════════════════════════════════════════ 6. LA RECOMMANDATION D'OFFRE ══ */

export interface Diagnostic {
  typeProspect?: string;
  niveau?: NiveauPrix;
  etapeCycle?: number | null;
  blocage?: string;
  documents?: string[];
  capex?: number | null;
  opexAn1?: number | null;
  capacite?: string;
  echeance?: string;
}

export interface OffreCalculee {
  parcours: Parcours;
  /** Pourquoi ce parcours, en une phrase — affiché à l'agent et écrit dans le CRM. */
  motif: string;
  niveau: NiveauPrix;
  prixBase: number;
  coefTaille: number;
  trancheNom: string;
  /** Multiplicateur combiné réellement appliqué, après plafonnement à ×2,00. */
  multiplicateur: number;
  plafonne: boolean;
  prixIndexe: number;
  delaiSemaines: number;
  /** Assiette d'indexation = CAPEX + première année pleine d'OPEX. */
  assiette: number | null;
  /** Part du coût de projet que représente l'offre, quand l'assiette est connue. */
  partDuProjet: number | null;
  plafondVraisemblance: number;
  vraisemblable: boolean | null;
  /** Alternatives à proposer dans la même conversation, avec leur prix indexé. */
  alternatives: { parcours: Parcours; prix: number }[];
  /**
   * Le projet est-il trop petit pour toute mission d'ingénierie ? Vrai quand
   * même l'offre Essentiel dépasse le plafond de vraisemblance : la réponse
   * n'est alors ni une remise ni un périmètre réduit, mais les produits en
   * ligne — c'est le rôle que leur donne la note de modèle économique.
   */
  orienterProduitsEnLigne: boolean;
}

/** Produits en ligne — onglet 7 de la grille. La sortie par le bas du marché. */
export const PRODUITS_EN_LIGNE = [
  { code: "BAN-1", nom: "AGROBANCABLE — note d'avis", prix: 35_000 },
  { code: "BAN-2", nom: "AGROBANCABLE — revue de crédibilité par un expert", prix: 150_000 },
  { code: "AGB-1", nom: "AGROBOUSSOLE — avis simple", prix: 25_000 },
  { code: "AGB-2", nom: "AGROBOUSSOLE — avis de préqualification complet", prix: 100_000 },
] as const;

/** Coefficient de niveau, tel qu'il figure dans la note (× 0,80 / 1,00 / 1,25). */
const COEF_NIVEAU: Record<NiveauPrix, number> = { proximite: 0.8, reference: 1.0, bailleur: 1.25 };

/**
 * Le parcours qui correspond à la situation décrite — et pourquoi.
 *
 * L'ordre des tests n'est pas indifférent : ce qui BLOQUE prime sur l'étape,
 * parce qu'un dossier refusé ou une exploitation en perte appelle d'abord un
 * diagnostic. C'est la règle de métier, pas une commodité d'implémentation.
 */
export function recommanderParcours(d: Diagnostic): { parcours: Parcours; motif: string; alternatives: Parcours[] } {
  const p = (code: string) => getParcours(code)!;
  /** Deux entrées du même parcours dans « à évoquer aussi » n'aident personne. */
  const distincts = (...l: (Parcours | undefined)[]): Parcours[] => {
    const vus = new Set<string>();
    return l.filter((x): x is Parcours => !!x && !vus.has(x.code) && !!vus.add(x.code));
  };
  const etape = d.etapeCycle ?? null;

  if (d.blocage === "refus_banque") {
    return { parcours: p("PT-08"), motif: "Un dossier a déjà été refusé : on le relit avant de le remonter.",
      alternatives: distincts(p("PT-04"), p("PT-00")) };
  }
  if (d.blocage === "exploitation_degradee") {
    return { parcours: p("PT-09"), motif: "L'activité existe et perd de l'argent : le diagnostic passe avant tout le reste.",
      alternatives: distincts(p("PT-06"), p("PT-07")) };
  }
  if (d.blocage === "conformite") {
    return { parcours: p("PT-10"), motif: "C'est une exigence de conformité ou d'ESG qui bloque l'avancement.",
      alternatives: distincts(p("PT-08")) };
  }
  if (d.blocage === "competences") {
    return { parcours: p("PT-11"), motif: "Le frein est humain : l'équipe doit être formée avant d'aller plus loin.",
      alternatives: distincts(p("PT-06")) };
  }

  if (etape == null) {
    return { parcours: p("PT-01"), motif: "L'étape du projet n'est pas connue : commencer par préqualifier coûte peu et évite de se tromper de porte.",
      alternatives: distincts(p("PT-00")) };
  }

  const parEtape = PARCOURS.find((x) => x.famille === "cycle" && x.etapes.includes(etape)) ?? p("PT-01");

  /**
   * L'aiguillage vers PT-00 « Essentiel ». C'est la décision commerciale la plus
   * utile de tout ce module : un promoteur qui vise un dossier bancable et qui
   * n'a rien d'écrit devrait acheter PT-02 puis PT-04, soit 11 250 000 FCFA au
   * niveau Référence. L'offre Essentiel fait le même chemin utile pour
   * 5 300 000. Le proposer d'emblée n'est pas une remise : c'est un périmètre
   * réduit, et c'est la réponse prévue par la note tarifaire au marché réel.
   */
  const viseBancabilite = etape >= 3 && etape <= 7;
  const petitProjet = (d.capex ?? 0) > 0 && (d.capex ?? 0) + (d.opexAn1 ?? 0) < 150_000_000;
  if (viseBancabilite && petitProjet) {
    return { parcours: p("PT-00"),
      motif: "Le projet vise un dossier bancable et reste sous 150 MFCFA : l'offre Essentiel y mène pour moins cher que la suite des parcours de cycle.",
      alternatives: distincts(parEtape, p("PT-04")) };
  }

  const suivant = PARCOURS.find((x) => x.famille === "cycle" && x.etapes[0] === (parEtape.etapes.at(-1) ?? 0) + 1);
  return {
    parcours: parEtape,
    motif: `Le projet en est à l'étape ${etape} du cycle, que ${parEtape.code} couvre exactement.`,
    alternatives: distincts(suivant, viseBancabilite ? p("PT-00") : undefined),
  };
}

/** L'offre complète : parcours, prix indexé, délai, et contrôle de vraisemblance. */
export function calculerOffre(d: Diagnostic, parcoursForce?: string | null): OffreCalculee {
  const reco = recommanderParcours(d);
  const parcours = getParcours(parcoursForce) ?? reco.parcours;
  const motif = parcoursForce && parcoursForce !== reco.parcours.code
    ? "Parcours choisi à la main par l'agent, différent de la recommandation."
    : reco.motif;

  const niveau: NiveauPrix = d.niveau ?? niveauParDefaut(d.typeProspect ?? "");
  const prixBase = parcours.prix[niveau];

  const assiette = (d.capex ?? 0) > 0 ? (d.capex ?? 0) + (d.opexAn1 ?? 0) : null;
  const tranche = assiette != null ? trancheDe(assiette) : null;
  const coefTaille = tranche?.coef ?? 1;

  // Le plafond porte sur le multiplicateur COMBINÉ, niveau compris (§ 6.1 de la note).
  const combineVoulu = COEF_NIVEAU[niveau] * coefTaille;
  const combineRetenu = Math.min(combineVoulu, PLAFOND_MULTIPLICATEUR);
  const coefApplique = combineRetenu / COEF_NIVEAU[niveau];
  const prixIndexe = arrondiCommercial(prixBase * coefApplique);

  const plafond = PLAFONDS_VRAISEMBLANCE[parcours.famille];
  const part = assiette ? prixIndexe / assiette : null;

  /**
   * Même l'offre d'entrée dépasse-t-elle le plafond ? Alors aucun périmètre de
   * mission ne tient : c'est un dossier pour les produits en ligne, et le dire
   * tout de suite évite une négociation qui finirait sous le coût direct.
   */
  const essentiel = getParcours("PT-00")!;
  const prixEssentiel = arrondiCommercial(essentiel.prix[niveau] * coefApplique);
  const orienterProduitsEnLigne =
    assiette != null && prixEssentiel / assiette > PLAFONDS_VRAISEMBLANCE.entree;

  return {
    parcours, motif, niveau, prixBase, coefTaille,
    trancheNom: tranche?.nom ?? "Coût de projet non renseigné",
    multiplicateur: combineRetenu,
    plafonne: combineVoulu > PLAFOND_MULTIPLICATEUR,
    prixIndexe,
    delaiSemaines: parcours.delaiSemaines,
    assiette,
    partDuProjet: part,
    plafondVraisemblance: plafond,
    vraisemblable: part == null ? null : part <= plafond,
    orienterProduitsEnLigne,
    alternatives: reco.alternatives
      .filter((a) => a.code !== parcours.code)
      .map((a) => ({ parcours: a, prix: arrondiCommercial(a.prix[niveau] * coefApplique) })),
  };
}

/* ═══════════════════════════════════════════════════════ 7. FORMATAGE ═════ */

export function fcfa(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " FCFA";
}
export function semaines(n: number): string {
  return Number.isInteger(n) ? `${n} semaines` : `${String(n).replace(".", ",")} semaines`;
}
export function pourcent(n: number | null): string {
  return n == null ? "—" : `${(n * 100).toFixed(1).replace(".", ",")} %`;
}

/* ══════════════════════════════════════════════ 8. LA FICHE ET SA GARDE ═══ */

/** Ce que le formulaire envoie. Tout est optionnel sauf le nom : sur le terrain,
 *  une fiche incomplète vaut infiniment mieux qu'une fiche jamais créée. */
export interface FicheTerrain {
  nomContact: string;
  fonction?: string;
  raisonSociale?: string;
  typeProspect?: string;
  telephone?: string;
  email?: string;
  ville?: string;
  region?: string;
  filiere?: string;
  niveauTransformation?: string;
  etapeCycle?: number | null;
  blocage?: string;
  documents?: string[];
  capex?: number | null;
  opexAn1?: number | null;
  capacite?: string;
  echeance?: string;
  niveau?: NiveauPrix;
  parcoursRetenu?: string;
  objectif?: string;
  notes?: string;
  consentement?: boolean;
  /** Horodatage de la saisie sur le terrain — peut précéder l'envoi de plusieurs heures. */
  saisiLe?: string;
}

export const LIMITES = { texteCourt: 160, texteLong: 4000 };

/** Validation partagée client/serveur. Renvoie la liste des messages, vide si tout va bien. */
export function validerFiche(f: Partial<FicheTerrain>): string[] {
  const e: string[] = [];
  const nom = (f.nomContact ?? "").trim();
  if (!nom) e.push("Le nom du contact est nécessaire : c'est la seule chose qu'on ne peut pas retrouver après coup.");
  if (nom.length > LIMITES.texteCourt) e.push("Le nom du contact dépasse la longueur admise.");
  if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.push("L'adresse e-mail n'est pas valide.");
  if (!f.telephone && !f.email) e.push("Un téléphone ou un e-mail est nécessaire pour rappeler ce prospect.");
  for (const [champ, libelle] of [["capex", "Le CAPEX"], ["opexAn1", "L'OPEX de la première année"]] as const) {
    const v = f[champ];
    if (v != null && (!Number.isFinite(v) || v < 0)) e.push(`${libelle} doit être un montant positif.`);
  }
  if (f.filiere && !getFiliere(f.filiere)) e.push("Filière inconnue.");
  if (f.parcoursRetenu && !getParcours(f.parcoursRetenu)) e.push("Parcours inconnu.");
  if ((f.notes ?? "").length > LIMITES.texteLong) e.push("Les notes dépassent la longueur admise.");
  return e;
}
