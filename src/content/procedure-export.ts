/**
 * content/procedure-export.ts — Procédure d’exportation agricole (9 étapes, 6 acteurs,
 * 18 pièces documentaires). Source unique de la page `/ressources/procedure-export`
 * (vue Étapes, vue Acteurs, checklist documentaire).
 *
 * Contenu repris du guide interne « Chaîne logistique d’exportation agricole ».
 */

export type ActeurId =
  | 'autorite'
  | 'producteur'
  | 'transitaire'
  | 'compagnie'
  | 'douane'
  | 'acheteur';

/** Pictogrammes disponibles (SVG maison, aucun jeu d’icônes externe). */
export type IconeId =
  | 'ble'
  | 'microscope'
  | 'carton'
  | 'document'
  | 'camion'
  | 'colonnes'
  | 'navire'
  | 'passeport'
  | 'boutique'
  | 'bouclier';

export interface ProcedureActeur {
  id: ActeurId;
  /** Libellé court des filtres et des lignes d’acteurs. */
  nom: string;
  icone: IconeId;
  role: string;
}

export interface ProcedurePhase {
  n: 1 | 2 | 3;
  titre: string;
  desc: string;
}

export interface ProcedureDocument {
  nom: string;
  code: string;
  /** Nature de la pièce : Clé, Obligatoire, Douane, Norme, Transport… */
  type: string;
}

export interface ProcedureEtape {
  id: number;
  titre: string;
  sousTitre: string;
  phase: 1 | 2 | 3;
  icone: IconeId;
  acteurs: { id: ActeurId; nom: string }[];
  description: string;
  actions: string[];
  documents: ProcedureDocument[];
  vigilance: string;
  /** Guichets, autorités et usages camerounais applicables à cette étape. */
  reperesCm: string[];
}

/** Guichet, autorité ou organisme camerounais intervenant dans la chaîne d’export. */
export interface InstitutionCm {
  sigle: string;
  nom: string;
  role: string;
}

export const PROCEDURE_PHASES: ProcedurePhase[] = [
  { n: 1, titre: 'Amont', desc: 'Origine, conformité et conditionnement' },
  { n: 2, titre: 'Transit & douane', desc: 'Documentation et déclaration d’origine' },
  { n: 3, titre: 'Fret & destination', desc: 'Expédition, importation et livraison' },
];

export const PROCEDURE_ACTEURS: ProcedureActeur[] = [
  {
    id: 'autorite',
    nom: 'Autorité phytosanitaire & services d’export',
    icone: 'bouclier',
    role: 'Contrôle sanitaire, normalisation et délivrance des certificats officiels.',
  },
  {
    id: 'producteur',
    nom: 'Producteur, coopérative & station de conditionnement',
    icone: 'ble',
    role: 'Production, traçabilité du lot, tri, calibrage et emballage aux normes.',
  },
  {
    id: 'transitaire',
    nom: 'Transitaire & logistique terrestre',
    icone: 'camion',
    role: 'Constitution du dossier export, pré-acheminement et coordination des flux.',
  },
  {
    id: 'compagnie',
    nom: 'Compagnie maritime ou aérienne',
    icone: 'navire',
    role: 'Réservation de fret, embarquement, titre de transport et suivi de la traversée.',
  },
  {
    id: 'douane',
    nom: 'Courtier en douane (origine & destination)',
    icone: 'passeport',
    role: 'Déclarations douanières, droits et taxes, mainlevée des marchandises.',
  },
  {
    id: 'acheteur',
    nom: 'Agent d’importation & acheteur final',
    icone: 'boutique',
    role: 'Réception, agréage contradictoire et clôture du dossier commercial.',
  },
];

export const PROCEDURE_ETAPES: ProcedureEtape[] = [
  {
    id: 1,
    titre: 'Approvisionnement & production',
    sousTitre: 'Récolte, traçabilité du lot et tri à la ferme',
    phase: 1,
    icone: 'ble',
    acteurs: [
      { id: 'producteur', nom: 'Producteur / coopérative' },
      { id: 'autorite', nom: 'Autorité agricole / inspecteurs' },
    ],
    description:
      'Sélection des produits agricoles bruts respectant le cahier des charges de l’exportation. Traçabilité complète du lot, depuis la parcelle jusqu’à la station de conditionnement.',
    actions: [
      'Planification des récoltes à la maturité optimale d’exportation.',
      'Tri sanitaire préliminaire et enregistrement des numéros de lot (GLOBALG.A.P.).',
      'Acheminement sous température contrôlée vers le centre d’emballage.',
    ],
    documents: [
      { nom: 'Fiche de traçabilité du lot', code: 'DOC-01', type: 'Obligatoire' },
      { nom: 'Carnet de verger / de champ', code: 'DOC-02', type: 'Suivi' },
    ],
    vigilance:
      'Toute rupture de traçabilité à la parcelle entraîne le rejet du lot lors du contrôle phytosanitaire final.',
    reperesCm: [
      'Le MINADER encadre la production par ses délégations régionales et départementales : c’est le premier interlocuteur pour rattacher un bassin de production à un dossier d’export.',
      'Groupements et coopératives doivent être régulièrement immatriculés (acte uniforme OHADA relatif aux sociétés coopératives) : sans structure identifiable, la traçabilité du lot ne tient pas devant l’acheteur.',
      'Cacao, café et huile de palme destinés à l’Union européenne : l’acheteur exige désormais la géolocalisation des parcelles et une déclaration de diligence raisonnée au titre du RDUE — à préparer dès la campagne, pas au moment de l’embarquement.',
    ],
  },
  {
    id: 2,
    titre: 'Normes de qualité & phytosanitaires',
    sousTitre: 'Inspections, résidus LMR et certificat',
    phase: 1,
    icone: 'microscope',
    acteurs: [{ id: 'autorite', nom: 'Autorité d’export / service phytosanitaire' }],
    description:
      'Contrôle de conformité sanitaire et phytosanitaire par l’autorité compétente : vérification des limites maximales de résidus (LMR) de pesticides et absence d’organismes de quarantaine.',
    actions: [
      'Prélèvement d’échantillons et analyses en laboratoire agréé.',
      'Inspection visuelle phytosanitaire des cargaisons.',
      'Délivrance officielle du certificat phytosanitaire exigé à l’international.',
    ],
    documents: [
      { nom: 'Certificat phytosanitaire officiel', code: 'PHYTO-EXP', type: 'Clé' },
      { nom: 'Certificat d’inspection qualité (tierce partie)', code: 'SGS-QUAL', type: 'Inspection' },
      { nom: 'Rapport d’analyse LMR (laboratoire)', code: 'LAB-RES', type: 'Obligatoire' },
    ],
    vigilance:
      'Le certificat phytosanitaire a une durée de validité limitée (généralement 14 jours) : l’expédition doit intervenir sans délai.',
    reperesCm: [
      'Végétaux et produits végétaux : le certificat phytosanitaire est délivré par le MINADER (direction en charge de la réglementation et du contrôle de qualité), organisation nationale de la protection des végétaux, via ses postes de contrôle au port et à l’aéroport.',
      'Produits animaux, halieutiques et d’élevage : le certificat sanitaire relève du MINEPIA et de ses services vétérinaires.',
      'Cacao et café : l’ONCC assure le contrôle de qualité à l’exportation ; le CICC est l’interlocuteur interprofessionnel de la filière.',
      'Analyses de résidus : l’offre nationale de laboratoires accrédités reste limitée. Anticipez les délais et, selon le marché visé, l’envoi d’échantillons à un laboratoire agréé à l’étranger.',
    ],
  },
  {
    id: 3,
    titre: 'Conditionnement & emballage',
    sousTitre: 'Mise aux normes d’emballage du pays de destination',
    phase: 1,
    icone: 'carton',
    acteurs: [
      { id: 'producteur', nom: 'Station / usine de conditionnement' },
      { id: 'autorite', nom: 'Organisme de normalisation' },
    ],
    description:
      'Traitement post-récolte, calibrage, pesage et emballage selon la réglementation et les exigences commerciales du pays de destination (NIMP 15 pour les emballages en bois).',
    actions: [
      'Calibrage, nettoyage et traitement post-récolte si requis.',
      'Conditionnement en cartons d’exportation et palettisation aux normes NIMP 15.',
      'Étiquetage obligatoire : code-barres, origine, catégorie, poids, numéro de station.',
    ],
    documents: [
      { nom: 'Liste de colisage (packing list)', code: 'PL-01', type: 'Obligatoire' },
      { nom: 'Certificat de fumigation', code: 'FUM-CERT', type: 'Vracs & noix' },
      { nom: 'Certificat de traitement NIMP 15 (palettes)', code: 'NIMP-15', type: 'Norme' },
    ],
    vigilance:
      'Les palettes en bois doivent porter le marquage d’homologation du traitement, sous peine de refoulement au port d’arrivée.',
    reperesCm: [
      'L’ANOR est l’organisme national de normalisation : normes camerounaises applicables au produit, à l’étiquetage et, le cas échéant, certification.',
      'Emballages en bois : le traitement et le marquage NIMP 15 doivent être réalisés par un opérateur agréé par l’organisation nationale de la protection des végétaux (MINADER).',
      'L’étiquetage doit satisfaire à la fois la réglementation camerounaise et celle du marché de destination — c’est le second cahier des charges qui prime en cas d’écart.',
    ],
  },
  {
    id: 4,
    titre: 'Préparation des documents d’export',
    sousTitre: 'Dossier commercial et origine',
    phase: 2,
    icone: 'document',
    acteurs: [
      { id: 'transitaire', nom: 'Transitaire (freight forwarder)' },
      { id: 'douane', nom: 'Courtier en douane / exportateur' },
    ],
    description:
      'Consolidation des titres, factures, certificats de provenance et déclarations préalables indispensables au passage douanier.',
    actions: [
      'Émission de la facture commerciale définitive et de la liste de colisage.',
      'Établissement du certificat d’origine (EUR.1, Form A, COO).',
      'Réservation de l’espace de fret (booking) auprès de la compagnie maritime ou aérienne.',
    ],
    documents: [
      { nom: 'Facture commerciale d’exportation', code: 'COM-INV', type: 'Clé' },
      { nom: 'Certificat d’origine (chambre de commerce)', code: 'COO-01', type: 'Douane' },
      { nom: 'Lettre de crédit irrévocable (L/C)', code: 'LC-BANK', type: 'Garantie de paiement' },
    ],
    vigilance:
      'Toute incohérence entre le poids net de la liste de colisage et celui de la facture commerciale bloque le dédouanement.',
    reperesCm: [
      'Le GUCE (Guichet Unique des Opérations du Commerce Extérieur), à Douala, centralise les formalités du commerce extérieur sur sa plateforme électronique : c’est le point d’entrée du dossier.',
      'Le certificat d’origine est délivré par la CCIMA. Pour l’Union européenne, c’est le certificat de circulation EUR.1 au titre de l’accord de partenariat économique Cameroun–UE qui ouvre le régime préférentiel.',
      'L’opération d’exportation doit être domiciliée auprès d’une banque agréée : la domiciliation conditionne le dédouanement et engage le rapatriement des recettes (réglementation des changes CEMAC).',
      'L’exportateur doit être en règle : RCCM, numéro identifiant unique (carte de contribuable) et, selon la filière, agrément ou enregistrement spécifique.',
    ],
  },
  {
    id: 5,
    titre: 'Transit & pré-acheminement',
    sousTitre: 'Camionnage frigorifique vers le port ou l’aéroport',
    phase: 2,
    icone: 'camion',
    acteurs: [
      { id: 'transitaire', nom: 'Transporteur routier frigorifique' },
      { id: 'compagnie', nom: 'Gestionnaire de terminal portuaire' },
    ],
    description:
      'Transport terrestre des marchandises, de l’entrepôt au port ou à l’aéroport de départ, en camions frigorifiques maintenant la chaîne du froid.',
    actions: [
      'Pré-refroidissement du conteneur reefer à la température de consigne.',
      'Pesée de la masse brute vérifiée (VGM) selon la convention SOLAS.',
      'Plombage de sécurité du conteneur avant livraison au terminal.',
    ],
    documents: [
      { nom: 'Lettre de voiture routière (CMR / LTI)', code: 'CMR-01', type: 'Transport' },
      { nom: 'Ticket de pesée VGM (SOLAS)', code: 'VGM-CERT', type: 'Sécurité' },
    ],
    vigilance:
      'La consigne de température de la centrale du conteneur frigorifique se vérifie au moment de l’empotage.',
    reperesCm: [
      'Deux ports d’embarquement : le Port autonome de Douala, historique et le plus desservi, et le Port autonome de Kribi, en eau profonde. Le fret aérien passe principalement par l’aéroport international de Douala.',
      'Le pré-acheminement depuis l’Ouest, le Centre ou le Littoral se fait par route : intégrez une marge de temps réaliste sur les corridors, elle conditionne la fraîcheur à l’empotage.',
      'Conteneurs frigorifiques et prises à quai sont une ressource rare : la réservation se prend très en amont de la récolte.',
    ],
  },
  {
    id: 6,
    titre: 'Dédouanement à l’origine',
    sousTitre: 'Déclaration d’exportation et contrôle douanier',
    phase: 2,
    icone: 'colonnes',
    acteurs: [
      { id: 'douane', nom: 'Douanes du pays exportateur' },
      { id: 'autorite', nom: 'Autorité de contrôle des exportations' },
    ],
    description:
      'Formalités légales d’exportation au bureau de douane de sortie : inspection documentaire, vérification physique éventuelle par scanner et délivrance du bon à enlever.',
    actions: [
      'Saisie de la déclaration en douane d’exportation (DUM / EX-1).',
      'Contrôle documentaire et validation du certificat phytosanitaire par la douane.',
      'Délivrance de l’autorisation d’embarquement (BAE).',
    ],
    documents: [
      { nom: 'Déclaration d’exportation (EX1 / DUM)', code: 'EX-1', type: 'Douane' },
      { nom: 'Bon à enlever (BAE) à l’export', code: 'BAE-EXP', type: 'Autorisation' },
      { nom: 'Bordereau de suivi cargaison (BESC / CTN)', code: 'BESC-01', type: 'Suivi maritime' },
    ],
    vigilance:
      'Un blocage en douane d’origine de plus de 48 heures compromet la qualité des produits très périssables.',
    reperesCm: [
      'La déclaration est saisie dans CAMCIS, le système d’information de la Direction générale des douanes, qui a remplacé l’ancien système déclaratif : la procédure est dématérialisée et le circuit de contrôle attribué automatiquement.',
      'Le contrôle douanier et le contrôle phytosanitaire se déroulent au même endroit, au port : faites-les préparer conjointement par votre transitaire, c’est là que se perdent les journées.',
      'Certains produits agricoles bruts supportent un droit de sortie : vérifiez le tarif applicable à votre position tarifaire dans la loi de finances de l’année en cours.',
    ],
  },
  {
    id: 7,
    titre: 'Expédition internationale',
    sousTitre: 'Traversée maritime ou aérienne sous froid',
    phase: 3,
    icone: 'navire',
    acteurs: [
      { id: 'compagnie', nom: 'Compagnie maritime / aérienne' },
      { id: 'transitaire', nom: 'Agent maritime / transit' },
    ],
    description:
      'Chargement du conteneur à bord du navire ou de l’aéronef, puis acheminement international sous surveillance constante de l’atmosphère contrôlée.',
    actions: [
      'Chargement au terminal et branchement électrique du conteneur à bord.',
      'Suivi de la température, de l’humidité et du renouvellement d’air pendant la traversée.',
      'Émission du titre de transport définitif : connaissement (B/L) ou LTA.',
    ],
    documents: [
      { nom: 'Connaissement maritime (bill of lading)', code: 'BOL-01', type: 'Titre' },
      { nom: 'Lettre de transport aérien (LTA / AWB)', code: 'AWB-01', type: 'Transport' },
    ],
    vigilance:
      'Le connaissement original doit parvenir à l’importateur avant l’arrivée du navire, faute de quoi des frais d’immobilisation (surestaries) courent.',
    reperesCm: [
      'Le connaissement est émis par l’agent maritime à Douala ou à Kribi ; la remise des originaux, ou le télex release, se négocie avec l’acheteur dès le contrat.',
      'Les liaisons vers l’Europe comportent le plus souvent un transbordement : le délai réel de transit est supérieur au temps de traversée annoncé — c’est lui qui compte pour un produit périssable.',
      'Le suivi de la température en mer se contractualise avec la compagnie : exigez le relevé de la centrale à l’arrivée, il fait foi en cas de litige sur la qualité.',
    ],
  },
  {
    id: 8,
    titre: 'Dédouanement à destination',
    sousTitre: 'Inspection sanitaire d’import, droits et taxes',
    phase: 3,
    icone: 'passeport',
    acteurs: [
      { id: 'douane', nom: 'Douanes du pays importateur' },
      { id: 'acheteur', nom: 'Agent d’importation / courtier local' },
      { id: 'autorite', nom: 'Service d’inspection sanitaire à l’entrée' },
    ],
    description:
      'Inspection par les autorités sanitaires aux frontières de destination (postes d’inspection frontaliers), contrôle des documents phytosanitaires originaux et acquittement des droits de douane.',
    actions: [
      'Présentation des originaux du certificat phytosanitaire et du connaissement.',
      'Inspection physique ou prélèvement par le poste d’inspection frontalier.',
      'Paiement des droits et taxes, puis délivrance de la mainlevée douanière.',
    ],
    documents: [
      { nom: 'Déclaration d’importation', code: 'IMP-01', type: 'Douane' },
      { nom: 'Document sanitaire commun d’entrée (CHED / TRACES)', code: 'CHED', type: 'Sanitaire' },
    ],
    vigilance:
      'En cas de non-conformité sanitaire à l’entrée, la marchandise est détruite ou refoulée aux frais exclusifs de l’exportateur.',
    reperesCm: [
      'Union européenne : le lot est annoncé dans le système TRACES et présenté à un poste de contrôle frontalier ; le certificat phytosanitaire camerounais original y est exigé.',
      'Le régime préférentiel européen ne s’applique que si le certificat EUR.1 est conforme : une erreur d’origine se paie en droits de douane pleins chez l’acheteur.',
      'Marchés africains : la ZLECAf et les règles d’origine CEMAC ouvrent d’autres régimes préférentiels — le certificat d’origine à demander à la CCIMA n’est alors pas le même.',
    ],
  },
  {
    id: 9,
    titre: 'Livraison à l’acheteur',
    sousTitre: 'Acheminement final et agréage',
    phase: 3,
    icone: 'boutique',
    acteurs: [
      { id: 'acheteur', nom: 'Acheteur final / grossiste / distribution' },
      { id: 'transitaire', nom: 'Transporteur routier local' },
    ],
    description:
      'Acheminement final par camion frigorifique, du port de déchargement à l’entrepôt de l’acheteur, puis agréage de la marchandise et signature du procès-verbal de réception.',
    actions: [
      'Livraison au quai du destinataire et contrôle de la température au déchargement.',
      'Contrôle qualité contradictoire (agréage) et relevé des avaries éventuelles.',
      'Signature du bon de livraison (POD) et clôture du dossier d’exportation.',
    ],
    documents: [
      { nom: 'Bon de livraison signé (proof of delivery)', code: 'POD-01', type: 'Clôture' },
      { nom: 'Rapport d’agréage / qualité à réception', code: 'QC-INSP', type: 'Qualité' },
    ],
    vigilance:
      'Toute réserve sur l’état de la marchandise doit être portée sur le bon de livraison dans le délai contractuel (généralement 24 heures).',
    reperesCm: [
      'Le dossier n’est pas clos à la livraison : les recettes doivent être rapatriées par la banque domiciliataire dans le délai fixé par la réglementation des changes CEMAC, et le dossier de domiciliation apuré.',
      'Conservez l’intégralité des pièces (certificats, connaissement, agréage, relevés de température) : elles servent au contrôle des changes, au contrôle fiscal et à la prochaine campagne.',
      'Un agréage documenté est le meilleur argument commercial pour renégocier le prix de la campagne suivante — c’est la preuve que votre chaîne tient.',
    ],
  },
];

/**
 * Guichets, autorités et organismes camerounais de la chaîne d’export.
 * Repères d’orientation : les compétences, les guichets et les taux évoluent —
 * à confirmer auprès de l’autorité concernée avant chaque expédition.
 */
export const INSTITUTIONS_CM: InstitutionCm[] = [
  {
    sigle: 'GUCE',
    nom: 'Guichet Unique des Opérations du Commerce Extérieur',
    role: 'Point d’entrée dématérialisé des formalités d’import-export, à Douala. Fait le lien entre l’exportateur, les administrations et les opérateurs portuaires.',
  },
  {
    sigle: 'DGD / CAMCIS',
    nom: 'Direction générale des douanes — système d’information douanier',
    role: 'Déclaration d’exportation, circuit de contrôle, liquidation des droits et bon à enlever. Toute la procédure douanière passe par CAMCIS.',
  },
  {
    sigle: 'MINADER',
    nom: 'Ministère de l’Agriculture et du Développement rural',
    role: 'Organisation nationale de la protection des végétaux : inspection phytosanitaire, certificat phytosanitaire, agrément des traitements NIMP 15.',
  },
  {
    sigle: 'MINEPIA',
    nom: 'Ministère de l’Élevage, des Pêches et des Industries animales',
    role: 'Certificats sanitaires vétérinaires pour les produits animaux, halieutiques et d’élevage.',
  },
  {
    sigle: 'CCIMA',
    nom: 'Chambre de commerce, d’industrie, des mines et de l’artisanat',
    role: 'Délivrance des certificats d’origine, dont l’EUR.1 pour le marché européen.',
  },
  {
    sigle: 'ANOR',
    nom: 'Agence des normes et de la qualité',
    role: 'Normalisation et certification : normes applicables au produit, au conditionnement et à l’étiquetage.',
  },
  {
    sigle: 'ONCC / CICC',
    nom: 'Office national du cacao et du café — Conseil interprofessionnel',
    role: 'Contrôle de qualité à l’export et encadrement interprofessionnel des filières cacao et café.',
  },
  {
    sigle: 'PAD / PAK',
    nom: 'Ports autonomes de Douala et de Kribi',
    role: 'Terminaux d’embarquement, pesée VGM, prises frigorifiques et mise à bord.',
  },
  {
    sigle: 'Banque domiciliataire',
    nom: 'Établissement agréé de la place',
    role: 'Domiciliation de l’opération d’exportation puis rapatriement des recettes, au titre de la réglementation des changes CEMAC.',
  },
];

/** Avertissement affiché avec les repères camerounais. */
export const REPERES_CM_AVERTISSEMENT =
  'Repères d’orientation, non exhaustifs : les compétences, les guichets, les pièces exigées et les taux évoluent, et varient selon la filière et le marché visé. Chaque expédition commence par leur vérification auprès de l’autorité compétente.';

/** Points de contrôle de la chaîne du froid (encadré de la vue documentaire). */
export const PROCEDURE_FROID: { label: string; valeur: string }[] = [
  { label: 'Contrôle de température', valeur: 'Continu (enregistreur embarqué)' },
  { label: 'Ventilation', valeur: 'Débit réglé en m³/heure' },
  { label: 'Incoterms courants', valeur: 'CIF · CIP · DAP' },
];

/** Risques sanitaires et douaniers majeurs (encadré de la vue documentaire). */
export const PROCEDURE_RISQUES: string[] = [
  'Rejet aux frontières pour dépassement des limites maximales de résidus (LMR) de pesticides.',
  'Quarantaine ou refoulement en cas de détection d’organismes nuisibles de quarantaine.',
  'Pénalités de surestaries en cas de retard sur le connaissement ou le certificat phytosanitaire.',
];

/** Toutes les pièces documentaires, rattachées à leur étape (checklist). */
export function tousLesDocuments(): (ProcedureDocument & { etapeId: number; etapeTitre: string })[] {
  return PROCEDURE_ETAPES.flatMap((e) =>
    e.documents.map((d) => ({ ...d, etapeId: e.id, etapeTitre: e.titre })),
  );
}

export function acteursDeLEtape(etape: ProcedureEtape): ProcedureActeur[] {
  return PROCEDURE_ACTEURS.filter((a) => etape.acteurs.some((x) => x.id === a.id));
}

export function etapesDeLActeur(id: ActeurId): ProcedureEtape[] {
  return PROCEDURE_ETAPES.filter((e) => e.acteurs.some((a) => a.id === id));
}
