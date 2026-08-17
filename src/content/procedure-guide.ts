/**
 * content/procedure-guide.ts — Volets « guide pratique » de la procédure d’exportation :
 * Incoterms et simulateur de prix, vérification des acheteurs et indice de
 * suspicion, diagnostic des 10 erreurs, fiches filières, et bibliothèque des
 * 22 modèles de documents.
 *
 * Complète `procedure-export.ts` (les 9 étapes, les acteurs et la checklist).
 */

/* ───────────────────────── Incoterms & prix ───────────────────────── */

export interface Incoterm {
  sigle: string;
  nom: string;
  lieu: string;
  etiquette: string;
  vendeur: string;
  acheteur: string;
  transfertRisque: string;
}

export const INCOTERMS: Incoterm[] = [
  {
    sigle: 'FOB',
    nom: 'Free On Board',
    lieu: 'Port de départ',
    etiquette: 'Le plus courant à l’export agricole',
    vendeur:
      'Dédouanement export, pré-acheminement jusqu’au port et chargement à bord du navire.',
    acheteur: 'Fret maritime, assurance et dédouanement à destination.',
    transfertRisque: 'À la mise à bord du navire, au port de départ.',
  },
  {
    sigle: 'CFR',
    nom: 'Cost and Freight',
    lieu: 'Port de destination',
    etiquette: 'Fret inclus, assurance exclue',
    vendeur: 'Tout ce que couvre le FOB, plus le fret maritime jusqu’au port de destination.',
    acheteur: 'Assurance de la traversée et dédouanement à destination.',
    transfertRisque:
      'À la mise à bord, au port de départ — le vendeur paie le fret mais ne porte plus le risque.',
  },
  {
    sigle: 'CIF',
    nom: 'Cost, Insurance and Freight',
    lieu: 'Port de destination',
    etiquette: 'Fret et assurance inclus',
    vendeur:
      'Tout ce que couvre le CFR, plus l’assurance maritime souscrite au profit de l’acheteur.',
    acheteur: 'Déchargement, dédouanement à destination et acheminement final.',
    transfertRisque: 'À la mise à bord, au port de départ, comme en CFR.',
  },
];

export const INCOTERMS_NOTE =
  'FOB, CFR et CIF ne s’emploient que pour le transport maritime. Pour un envoi aérien ou multimodal, leurs équivalents sont FCA, CPT et CIP. Le lieu doit toujours être nommé après le sigle — « FOB Douala », jamais « FOB » seul — et la version des règles précisée (Incoterms 2020).';

export interface PosteDeCout {
  id: 'produit' | 'conditionnement' | 'transit' | 'fret';
  label: string;
  aide: string;
  defaut: number;
}

/** Postes du simulateur, exprimés par tonne. */
export const POSTES_COUT: PosteDeCout[] = [
  {
    id: 'produit',
    label: 'Achat du produit',
    aide: 'Prix rendu station, bord champ ou magasin, selon votre montage.',
    defaut: 800,
  },
  {
    id: 'conditionnement',
    label: 'Conditionnement, emballage et phyto',
    aide: 'Sacs, palettes, traitement, analyses, certificats.',
    defaut: 120,
  },
  {
    id: 'transit',
    label: 'Transit terrestre et passage portuaire',
    aide: 'Camionnage, manutention, VGM, frais de terminal, transitaire.',
    defaut: 90,
  },
  {
    id: 'fret',
    label: 'Fret maritime',
    aide: 'Ajouté au FOB pour obtenir le CIF ; hors assurance.',
    defaut: 150,
  },
];

export const MARGE_DEFAUT = 15;
/** Taux indicatif à préciser dans toute conversion (charte : montants en FCFA). */
export const TAUX_FCFA_USD = 600;

/* ──────────────── Acheteurs : vérification & arnaques ──────────────── */

export interface CritereArnaque {
  id: string;
  titre: string;
  detail: string;
}

export const CRITERES_ARNAQUE: CritereArnaque[] = [
  {
    id: 'sans-site',
    titre: 'Ni site web, ni adresse physique vérifiable',
    detail: 'Aucune présence publique officielle que vous puissiez recouper.',
  },
  {
    id: 'avance',
    titre: 'Demande d’avance de frais',
    detail:
      'Virement réclamé pour un « enregistrement », un avocat, une licence ou une formalité douanière locale.',
  },
  {
    id: 'volumes',
    titre: 'Volumes colossaux dès le premier contact',
    detail: 'Cinquante conteneurs commandés sans échantillon ni essai préalable.',
  },
  {
    id: 'urgence',
    titre: 'Ton pressant, courriels approximatifs',
    detail: 'Urgence artificielle, adresse de messagerie gratuite, fautes grossières.',
  },
  {
    id: 'rib',
    titre: 'Demande précoce de vos coordonnées bancaires',
    detail: 'Le RIB de l’entreprise réclamé avant tout contrat signé.',
  },
  {
    id: 'echantillon',
    titre: 'Aucune demande d’échantillon',
    detail: 'Prêt à acheter à l’aveugle, sans fiche technique ni analyse.',
  },
];

export interface NiveauRisque {
  seuil: number;
  titre: string;
  conduite: string;
  ton: 'ok' | 'attention' | 'alerte';
}

/** Le premier niveau dont le seuil est atteint, en partant du plus élevé. */
export const NIVEAUX_RISQUE: NiveauRisque[] = [
  {
    seuil: 3,
    titre: 'Alerte forte : suspicion d’arnaque',
    conduite:
      'Ne versez aucun frais et n’expédiez aucune marchandise sans lettre de crédit irrévocable et confirmée. Faites vérifier l’existence juridique de la société avant de poursuivre.',
    ton: 'alerte',
  },
  {
    seuil: 1,
    titre: 'Risque modéré : vigilance',
    conduite:
      'Des signaux sont présents. Vérifiez le registre du commerce, exigez une lettre de crédit confirmée et commencez par un conteneur d’essai.',
    ton: 'attention',
  },
  {
    seuil: 0,
    titre: 'Aucun signal majeur',
    conduite:
      'Rien d’alarmant à ce stade. Poursuivez les vérifications d’usage : existence juridique, antécédents d’importation, références commerciales.',
    ton: 'ok',
  },
];

/** Service tiers, avec son adresse — liens vérifiés le 2026-08-17. */
export interface LienExterne {
  nom: string;
  url: string;
  domaine: string;
}

export interface OutilVerification {
  usage: string;
  etiquette: string;
  services: LienExterne[];
}

export const OUTILS_VERIFICATION: OutilVerification[] = [
  {
    usage: 'Cartographie des flux commerciaux et des marchés acheteurs par produit.',
    etiquette: 'Marchés',
    services: [
      { nom: 'ITC Trade Map', url: 'https://www.trademap.org', domaine: 'trademap.org' },
      { nom: 'Tridge', url: 'https://www.tridge.com', domaine: 'tridge.com' },
    ],
  },
  {
    usage: 'Historique réel des connaissements et des déclarations douanières d’un importateur.',
    etiquette: 'Antécédents',
    services: [
      { nom: 'ImportGenius', url: 'https://www.importgenius.com', domaine: 'importgenius.com' },
      { nom: 'Panjiva', url: 'https://panjiva.com', domaine: 'panjiva.com' },
    ],
  },
  {
    usage:
      'Existence juridique, dirigeants et adresse déclarée de la société — à recouper avec le registre du commerce du pays de l’acheteur.',
    etiquette: 'Juridique',
    services: [{ nom: 'Kompass', url: 'https://www.kompass.com', domaine: 'kompass.com' }],
  },
];

export interface Salon extends LienExterne {
  lieu: string;
}

export const SALONS: Salon[] = [
  { nom: 'ANUGA', lieu: 'Cologne', url: 'https://www.anuga.com', domaine: 'anuga.com' },
  { nom: 'Gulfood', lieu: 'Dubaï', url: 'https://www.gulfood.com', domaine: 'gulfood.com' },
  { nom: 'SIAL Paris', lieu: 'Paris', url: 'https://www.sialparis.com', domaine: 'sialparis.com' },
  { nom: 'BioFach', lieu: 'Nuremberg — bio', url: 'https://www.biofach.de', domaine: 'biofach.de' },
];

/* ─────────────── Diagnostic : les 10 erreurs courantes ─────────────── */

export const ERREURS_EXPORT: string[] = [
  'Nous vérifions l’existence réelle et la solvabilité de l’acheteur avant tout engagement.',
  'Nous faisons tester la qualité selon les normes du marché visé (LMR européennes, exigences FDA) avant expédition.',
  'Notre emballage et notre étiquetage sont conformes aux exigences du pays de destination.',
  'Nous exigeons une garantie bancaire (lettre de crédit, SBLC) avant toute expédition à crédit.',
  'Nous détenons les agréments et licences d’exportation requis pour notre filière.',
  'Nous n’expédions que des lots homogènes : jamais deux qualités dans un même conteneur.',
  'Nous maîtrisons les Incoterms employés et la répartition des risques qu’ils impliquent.',
  'Nous passons par un transitaire agréé pour la conformité douanière.',
  'Nous faisons fumiger les denrées qui l’exigent avant chargement.',
  'Nous cotons et facturons en devise internationale, avec une couverture du risque de change.',
];

export interface Reflexe {
  titre: string;
  texte: string;
}

export const REFLEXES: Reflexe[] = [
  {
    titre: 'Coter dans la devise du marché',
    texte:
      'Le commerce agricole international se cote en dollars. Cotez dans la devise de votre acheteur et traitez le risque de change avec votre banque, plutôt que de le subir.',
  },
  {
    titre: 'Borner l’agréage par contrat',
    texte:
      'Prévoyez une fenêtre de 24 à 48 heures pour l’agréage à destination. Passé ce délai, la marchandise est réputée acceptée : sans cette clause, les réserves peuvent survenir des semaines plus tard.',
  },
  {
    titre: 'Conserver un échantillon scellé',
    texte:
      'Faites sceller un échantillon en présence d’un tiers avant le départ du conteneur. C’est votre seule preuve opposable en cas de litige sur la qualité.',
  },
];

/* ─────────────────────── Fiches filières ─────────────────────── */

export interface FicheFiliere {
  nom: string;
  exigences: { critere: string; valeur: string }[];
}

export const FILIERES: FicheFiliere[] = [
  {
    nom: 'Noix de cajou (anacarde)',
    exigences: [
      { critere: 'Humidité', valeur: '8 à 10 % maximum' },
      { critere: 'Rendement au décorticage (KOR)', valeur: '46 à 52 lbs par sac' },
      { critere: 'Emballage', valeur: 'Sacs de jute de 80 kg' },
      { critere: 'Traitement', valeur: 'Fumigation exigée avant chargement' },
    ],
  },
  {
    nom: 'Cacao & café',
    exigences: [
      { critere: 'Humidité', valeur: '7,5 % maximum — au-delà, moisissures' },
      { critere: 'Fermentation', valeur: 'Grade 1 : plus de 80 % de fèves bien fermentées' },
      { critere: 'Emballage', valeur: 'Jute, doublure hermétique pour éviter la contamination d’odeurs' },
      { critere: 'Traçabilité', valeur: 'Géolocalisation des parcelles exigée sur le marché européen' },
    ],
  },
  {
    nom: 'Sésame & arachides',
    exigences: [
      { critere: 'Pureté du sésame', valeur: 'Supérieure à 99 %' },
      { critere: 'Aflatoxines', valeur: 'Seuils européens très stricts — analyse obligatoire' },
      { critere: 'Conditionnement', valeur: 'Sacs polypropylène de 50 kg' },
      { critere: 'Traitement', valeur: 'Fumigation avant empotage' },
    ],
  },
  {
    nom: 'Fruits frais (mangue, avocat)',
    exigences: [
      { critere: 'Température de transport', valeur: 'Mangue +10 à +12 °C, avocat +5 °C' },
      { critere: 'Atmosphère', valeur: 'Contrôlée : O₂ 3 à 5 %, CO₂ 5 à 10 %' },
      { critere: 'Traitement', valeur: 'Trempage à l’eau chaude, contrôle phytosanitaire renforcé' },
      { critere: 'Délai', valeur: 'Chaîne tendue : le certificat phytosanitaire expire vite' },
    ],
  },
  {
    nom: 'Céréales & légumineuses',
    exigences: [
      { critere: 'Insectes', valeur: 'Fumigation en cale ou en conteneur' },
      { critere: 'Résidus', valeur: 'Respect des LMR du pays client' },
      { critere: 'Humidité', valeur: 'À stabiliser avant empotage pour éviter la condensation' },
    ],
  },
];

/* ──────────────── Bibliothèque des 22 modèles ──────────────── */

export type CategorieModele = 'commercial' | 'sanitaire' | 'douane' | 'transport';

export interface ModeleDocument {
  code: string;
  titre: string;
  categorie: CategorieModele;
  /** Qui établit ou délivre la pièce. */
  emetteur: string;
  /** À quoi elle sert, en une phrase. */
  objet: string;
  /** Rubriques à renseigner, dans l’ordre du document. */
  rubriques: { label: string; indication: string }[];
  /** Structure du tableau central, quand le document en comporte un. */
  tableau?: { intitule: string; colonnes: string[] };
  /** Erreurs qui font recaler la pièce. */
  pieges: string[];
}

export const CATEGORIES_MODELES: { id: CategorieModele | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous les modèles' },
  { id: 'commercial', label: 'Commercial & financier' },
  { id: 'sanitaire', label: 'Sanitaire & qualité' },
  { id: 'douane', label: 'Douane & réglementation' },
  { id: 'transport', label: 'Transport & logistique' },
];

export const MODELES_DOCUMENTS: ModeleDocument[] = [
  {
    code: 'DOC-01',
    titre: 'Fiche de traçabilité du lot',
    categorie: 'sanitaire',
    emetteur: 'Producteur ou station de conditionnement',
    objet: 'Rattacher chaque lot exporté à sa parcelle d’origine et à ses opérateurs successifs.',
    rubriques: [
      { label: 'Numéro de lot', indication: 'Identifiant unique, repris sur tous les autres documents.' },
      { label: 'Producteur / coopérative', indication: 'Raison sociale et immatriculation.' },
      { label: 'Code parcelle et localisation', indication: 'Référence cadastrale ou géolocalisation.' },
      { label: 'Date de récolte', indication: 'Date réelle, cohérente avec le carnet de champ.' },
      { label: 'Espèce et variété', indication: 'Nom commercial et nom botanique.' },
      { label: 'Poids brut récolté', indication: 'En kilogrammes.' },
    ],
    tableau: {
      intitule: 'Suivi des opérations',
      colonnes: ['Étape', 'Opérateur', 'Date et heure', 'Conformité constatée'],
    },
    pieges: [
      'Un numéro de lot qui change entre la fiche, la liste de colisage et le certificat phytosanitaire.',
      'Des dates de récolte incompatibles avec le délai avant récolte du carnet de champ.',
    ],
  },
  {
    code: 'DOC-02',
    titre: 'Carnet de verger / de champ',
    categorie: 'sanitaire',
    emetteur: 'Exploitation agricole',
    objet: 'Registre des traitements appliqués — pièce maîtresse de tout audit sur les résidus.',
    rubriques: [
      { label: 'Identification de l’exploitation', indication: 'Nom, superficie, parcelles couvertes.' },
      { label: 'Date d’application', indication: 'Une ligne par intervention.' },
      { label: 'Produit et matière active', indication: 'Nom commercial et substance, homologuée localement.' },
      { label: 'Dose appliquée', indication: 'Conforme à l’étiquette du produit.' },
      { label: 'Délai avant récolte', indication: 'Le délai respecté conditionne la conformité LMR.' },
    ],
    tableau: {
      intitule: 'Registre des traitements',
      colonnes: ['Date', 'Produit appliqué', 'Matière active', 'Dose', 'Délai avant récolte'],
    },
    pieges: [
      'Un produit non homologué sur le marché de destination, même autorisé localement.',
      'Un carnet reconstitué après coup : les incohérences de dates se voient immédiatement.',
    ],
  },
  {
    code: 'COM-INV',
    titre: 'Facture commerciale d’exportation',
    categorie: 'commercial',
    emetteur: 'Exportateur',
    objet: 'Pièce de base du dédouanement et du paiement : elle fixe la valeur déclarée.',
    rubriques: [
      { label: 'Vendeur et acheteur', indication: 'Raisons sociales complètes, adresses, identifiants fiscaux.' },
      { label: 'Numéro et date de facture', indication: 'Référence reprise dans la lettre de crédit.' },
      { label: 'Référence du contrat', indication: 'Lien avec l’accord commercial signé.' },
      { label: 'Incoterm et lieu nommé', indication: 'Par exemple « FOB Douala, Incoterms 2020 ».' },
      { label: 'Désignation des marchandises', indication: 'Description, qualité, position tarifaire.' },
      { label: 'Quantité, prix unitaire, montant', indication: 'Dans la devise du contrat.' },
      { label: 'Conditions et coordonnées de paiement', indication: 'Banque, guichet, référence de domiciliation.' },
    ],
    tableau: {
      intitule: 'Détail des marchandises',
      colonnes: ['Désignation', 'Quantité', 'Prix unitaire', 'Montant'],
    },
    pieges: [
      'Un poids net différent de celui de la liste de colisage : le dédouanement se bloque.',
      'Un incoterm sans lieu nommé, ou sans version des règles.',
      'Une valeur déclarée qui ne correspond pas au montant domicilié en banque.',
    ],
  },
  {
    code: 'PL-01',
    titre: 'Liste de colisage (packing list)',
    categorie: 'transport',
    emetteur: 'Exportateur ou station de conditionnement',
    objet: 'Décrire le contenu physique de l’envoi, colis par colis.',
    rubriques: [
      { label: 'Numéro de conteneur et de scellé', indication: 'Identiques à ceux du connaissement.' },
      { label: 'Ports de chargement et de déchargement', indication: 'Cohérents avec le titre de transport.' },
      { label: 'Détail des lots', indication: 'Type d’emballage, nombre de colis, poids net et brut.' },
      { label: 'Totaux', indication: 'Nombre de colis, poids net, poids brut, volume.' },
      { label: 'Masse brute vérifiée (VGM)', indication: 'Reportée du ticket de pesée.' },
    ],
    tableau: {
      intitule: 'Détail des colis',
      colonnes: ['Lot', 'Type d’emballage', 'Nombre de colis', 'Poids net', 'Poids brut'],
    },
    pieges: [
      'Un total qui ne tombe pas juste par rapport au détail des lignes.',
      'Un numéro de scellé qui diffère de celui porté au connaissement.',
    ],
  },
  {
    code: 'PHYTO-EXP',
    titre: 'Certificat phytosanitaire',
    categorie: 'sanitaire',
    emetteur: 'Organisation nationale de la protection des végétaux (MINADER)',
    objet:
      'Attester que le lot a été inspecté et qu’il est exempt d’organismes de quarantaine pour le pays importateur.',
    rubriques: [
      { label: 'Exportateur et destinataire', indication: 'Noms et adresses complètes.' },
      { label: 'Nom botanique du végétal', indication: 'Dénomination scientifique exigée.' },
      { label: 'Quantité et nature des colis', indication: 'Cohérentes avec la liste de colisage.' },
      { label: 'Point d’entrée déclaré', indication: 'Port ou aéroport de destination.' },
      { label: 'Déclaration additionnelle', indication: 'Mention exigée par le pays importateur, le cas échéant.' },
      { label: 'Traitement de désinfestation', indication: 'Produit, dose, durée, température.' },
      { label: 'Lieu, date, visa de l’inspecteur', indication: 'Le certificat court à partir de cette date.' },
    ],
    pieges: [
      'Une déclaration additionnelle omise alors que le pays importateur l’exige : le lot est refoulé.',
      'Un certificat délivré trop tôt : sa validité est limitée, généralement à quatorze jours.',
    ],
  },
  {
    code: 'LAB-RES',
    titre: 'Rapport d’analyse des résidus (LMR)',
    categorie: 'sanitaire',
    emetteur: 'Laboratoire accrédité',
    objet: 'Démontrer que les résidus de pesticides sont sous les limites du marché visé.',
    rubriques: [
      { label: 'Identification de l’échantillon', indication: 'Numéro de lot, date et méthode de prélèvement.' },
      { label: 'Réglementation de référence', indication: 'Le seuil dépend du marché de destination.' },
      { label: 'Molécules recherchées', indication: 'Le panel doit couvrir les substances employées sur la parcelle.' },
      { label: 'Résultats et seuils', indication: 'Valeur détectée en regard de la limite légale.' },
      { label: 'Conclusion et accréditation', indication: 'Portée d’accréditation du laboratoire.' },
    ],
    tableau: {
      intitule: 'Résultats d’analyse',
      colonnes: ['Molécule', 'Niveau détecté', 'Limite légale', 'Conformité'],
    },
    pieges: [
      'Un panel d’analyse trop étroit, qui ne couvre pas les produits réellement appliqués.',
      'Un laboratoire dont l’accréditation ne couvre pas la matrice analysée.',
    ],
  },
  {
    code: 'NIMP-15',
    titre: 'Certificat de traitement NIMP 15 (palettes)',
    categorie: 'sanitaire',
    emetteur: 'Opérateur agréé par l’organisation nationale de protection des végétaux',
    objet: 'Attester le traitement des emballages en bois contre les organismes xylophages.',
    rubriques: [
      { label: 'Code de l’opérateur agréé', indication: 'Code figurant aussi dans le marquage.' },
      { label: 'Type et nombre d’emballages', indication: 'Palettes, caisses, calage.' },
      { label: 'Méthode de traitement', indication: 'Traitement thermique ou fumigation.' },
      { label: 'Paramètres du traitement', indication: 'Température à cœur et durée.' },
      { label: 'Marquage apposé', indication: 'Le marquage physique doit être lisible sur chaque palette.' },
    ],
    pieges: [
      'Un certificat sans marquage physique correspondant sur les palettes.',
      'Des palettes réutilisées, non retraitées après réparation.',
    ],
  },
  {
    code: 'COO-01',
    titre: 'Certificat d’origine',
    categorie: 'douane',
    emetteur: 'Chambre de commerce (CCIMA)',
    objet: 'Attester l’origine des marchandises et ouvrir, le cas échéant, un régime préférentiel.',
    rubriques: [
      { label: 'Expéditeur et destinataire', indication: 'Identiques à la facture commerciale.' },
      { label: 'Pays d’origine', indication: 'Origine réelle, au sens des règles d’origine applicables.' },
      { label: 'Informations de transport', indication: 'Navire ou vol, ports de départ et d’arrivée.' },
      { label: 'Description des marchandises', indication: 'Alignée sur la facture et la liste de colisage.' },
      { label: 'Visa de la chambre de commerce', indication: 'Cachet et signature habilitée.' },
    ],
    pieges: [
      'Confondre le certificat d’origine ordinaire et le certificat de circulation exigé par un accord préférentiel.',
      'Une description divergente de celle de la facture : le régime préférentiel tombe.',
    ],
  },
  {
    code: 'CMR-01',
    titre: 'Lettre de voiture routière',
    categorie: 'transport',
    emetteur: 'Transporteur routier',
    objet: 'Contrat du pré-acheminement, de la station au port.',
    rubriques: [
      { label: 'Transporteur et véhicule', indication: 'Raison sociale, immatriculations tracteur et remorque.' },
      { label: 'Chauffeur', indication: 'Identité et contact.' },
      { label: 'Consigne de température', indication: 'Pour un envoi sous froid, la consigne figure au contrat.' },
      { label: 'Lieux de chargement et de livraison', indication: 'Avec dates et heures.' },
      { label: 'Réserves à la prise en charge', indication: 'État des colis constaté au départ.' },
    ],
    pieges: [
      'Aucune réserve portée alors que des colis sont abîmés : le recours est perdu.',
      'Une consigne de température absente du document : rien à opposer en cas de rupture de froid.',
    ],
  },
  {
    code: 'VGM-CERT',
    titre: 'Ticket de pesée (VGM, convention SOLAS)',
    categorie: 'transport',
    emetteur: 'Station de pesage ou expéditeur agréé',
    objet: 'Déclarer la masse brute vérifiée du conteneur — sans elle, pas d’embarquement.',
    rubriques: [
      { label: 'Numéro de conteneur et de scellé', indication: 'Identiques partout ailleurs.' },
      { label: 'Méthode de pesée', indication: 'Pesée du conteneur empoté, ou somme des colis et de la tare.' },
      { label: 'Masse brute vérifiée', indication: 'En kilogrammes.' },
      { label: 'Date, heure et lieu de pesée', indication: 'Avant la date limite fixée par la compagnie.' },
      { label: 'Signataire habilité', indication: 'Personne engageant l’expéditeur.' },
    ],
    pieges: [
      'Une déclaration transmise après la date limite : le conteneur reste à quai.',
      'Un écart trop important entre la VGM et le poids brut de la liste de colisage.',
    ],
  },
  {
    code: 'EX-1',
    titre: 'Déclaration d’exportation',
    categorie: 'douane',
    emetteur: 'Courtier en douane, dans le système douanier (CAMCIS)',
    objet: 'Déclarer officiellement la sortie des marchandises du territoire.',
    rubriques: [
      { label: 'Régime douanier', indication: 'Exportation définitive ou temporaire.' },
      { label: 'Exportateur et identifiant fiscal', indication: 'Numéro identifiant unique.' },
      { label: 'Destinataire et pays de destination', indication: 'Tels qu’en facture.' },
      { label: 'Position tarifaire', indication: 'Nomenclature à huit ou dix chiffres.' },
      { label: 'Valeur et poids déclarés', indication: 'Cohérents avec la facture et la liste de colisage.' },
      { label: 'Références de domiciliation', indication: 'Banque domiciliataire de l’opération.' },
    ],
    pieges: [
      'Une position tarifaire erronée : droits mal liquidés et régularisation coûteuse.',
      'Une déclaration déposée sans que les certificats sanitaires soient prêts.',
    ],
  },
  {
    code: 'BAE-EXP',
    titre: 'Bon à enlever (autorisation d’embarquement)',
    categorie: 'douane',
    emetteur: 'Administration des douanes',
    objet: 'Autoriser physiquement l’embarquement une fois la déclaration validée.',
    rubriques: [
      { label: 'Référence de la déclaration', indication: 'Numéro et date d’enregistrement.' },
      { label: 'Conteneur concerné', indication: 'Numéro et scellé.' },
      { label: 'Date et heure de délivrance', indication: 'Point de départ des délais de terminal.' },
      { label: 'Agent signataire', indication: 'Bureau de douane émetteur.' },
    ],
    pieges: [
      'Un bon obtenu trop tard pour le départ du navire : la marchandise attend la rotation suivante.',
    ],
  },
  {
    code: 'BOL-01',
    titre: 'Connaissement maritime (bill of lading)',
    categorie: 'transport',
    emetteur: 'Compagnie maritime ou son agent',
    objet:
      'Titre représentatif de la marchandise : celui qui détient l’original en prend livraison.',
    rubriques: [
      { label: 'Chargeur, destinataire, notify', indication: 'Trois rôles distincts, à ne pas confondre.' },
      { label: 'Navire et voyage', indication: 'Nom du navire et numéro de voyage.' },
      { label: 'Ports de chargement et de déchargement', indication: 'Et port de transbordement le cas échéant.' },
      { label: 'Description et marques', indication: 'Reprise de la liste de colisage.' },
      { label: 'Nombre d’originaux émis', indication: 'Généralement trois : leur circulation se maîtrise.' },
      { label: 'Fret payé ou payable à destination', indication: 'Découle de l’incoterm retenu.' },
      { label: 'Date de mise à bord', indication: 'Date déterminante pour la lettre de crédit.' },
    ],
    pieges: [
      'Un connaissement portant des réserves : la lettre de crédit exige souvent un titre « net ».',
      'Des originaux envoyés trop tard : l’acheteur ne peut pas prendre livraison et les surestaries courent.',
    ],
  },
  {
    code: 'AWB-01',
    titre: 'Lettre de transport aérien',
    categorie: 'transport',
    emetteur: 'Compagnie aérienne ou agent de fret',
    objet: 'Contrat de transport aérien — reçu de la marchandise, mais non négociable.',
    rubriques: [
      { label: 'Expéditeur et destinataire', indication: 'Le destinataire est nommé, le titre n’est pas transmissible.' },
      { label: 'Aéroports de départ et d’arrivée', indication: 'Et escales prévues.' },
      { label: 'Nombre de colis et poids', indication: 'Poids brut et poids taxable.' },
      { label: 'Nature de la marchandise', indication: 'Périssable, mentions de manutention.' },
      { label: 'Conditions de fret', indication: 'Prépayé ou port dû.' },
    ],
    pieges: [
      'Attendre l’original comme pour un connaissement : la lettre de transport aérien ne se négocie pas.',
      'Omettre les mentions de manutention d’un produit périssable.',
    ],
  },
  {
    code: 'FUM-CERT',
    titre: 'Certificat de fumigation',
    categorie: 'sanitaire',
    emetteur: 'Entreprise de fumigation agréée',
    objet: 'Attester le traitement insecticide des denrées sèches avant chargement.',
    rubriques: [
      { label: 'Produit fumigant et dose', indication: 'Substance autorisée sur le marché de destination.' },
      { label: 'Durée d’exposition et température', indication: 'Conditions du traitement.' },
      { label: 'Lieu du traitement', indication: 'Entrepôt, conteneur ou cale.' },
      { label: 'Identification du lot et du conteneur', indication: 'Numéros repris des autres pièces.' },
      { label: 'Opérateur et agrément', indication: 'Référence de l’agrément de l’entreprise.' },
    ],
    pieges: [
      'Une fumigation faite après empotage sans temps d’aération suffisant : risque pour les manutentionnaires.',
      'Un certificat manquant sur céréales, sésame, arachides ou noix : rejet au port d’arrivée.',
    ],
  },
  {
    code: 'SGS-QUAL',
    titre: 'Certificat d’inspection qualité (tierce partie)',
    categorie: 'sanitaire',
    emetteur: 'Société d’inspection indépendante',
    objet: 'Faire constater la qualité par un tiers, souvent exigé par la lettre de crédit.',
    rubriques: [
      { label: 'Lieu et date d’inspection', indication: 'Avant empotage, en principe.' },
      { label: 'Lot inspecté', indication: 'Numéro de lot et quantité couverte.' },
      { label: 'Méthode d’échantillonnage', indication: 'Norme appliquée et taille de l’échantillon.' },
      { label: 'Paramètres mesurés', indication: 'Humidité, calibre, rendement, défauts, corps étrangers.' },
      { label: 'Conclusion', indication: 'Conformité au contrat, avec les écarts constatés.' },
    ],
    tableau: {
      intitule: 'Paramètres contrôlés',
      colonnes: ['Paramètre', 'Exigence contractuelle', 'Résultat', 'Conformité'],
    },
    pieges: [
      'Des critères d’inspection non alignés sur le contrat : le rapport devient inopposable.',
      'Une inspection après empotage, quand le contrat l’exigeait avant.',
    ],
  },
  {
    code: 'LC-BANK',
    titre: 'Lettre de crédit irrévocable',
    categorie: 'commercial',
    emetteur: 'Banque de l’acheteur, notifiée par votre banque',
    objet:
      'Engagement bancaire de payer contre remise de documents conformes — la sécurité de paiement de référence.',
    rubriques: [
      { label: 'Banque émettrice et banque confirmante', indication: 'La confirmation par une banque locale ajoute sa garantie.' },
      { label: 'Donneur d’ordre et bénéficiaire', indication: 'Orthographe exacte : une lettre de travers fait une réserve.' },
      { label: 'Montant et devise', indication: 'Avec la tolérance éventuelle, en pourcentage.' },
      { label: 'Date et lieu d’expiration', indication: 'Une expiration dans votre pays vous laisse le temps de présenter.' },
      { label: 'Incoterm et description', indication: 'Repris à l’identique de la facture.' },
      { label: 'Documents exigés', indication: 'La liste exhaustive à produire : lisez-la avant de charger.' },
      { label: 'Expéditions partielles et transbordement', indication: 'Autorisés ou non.' },
      { label: 'Délai de présentation', indication: 'Nombre de jours après la date de mise à bord.' },
    ],
    pieges: [
      'Découvrir les documents exigés après le chargement : certains ne peuvent plus être obtenus.',
      'Une lettre de crédit non confirmée sur un pays à risque : la garantie reste lointaine.',
      'Le moindre écart entre les documents et le texte du crédit fonde une réserve, donc un refus de paiement.',
    ],
  },
  {
    code: 'BESC-01',
    titre: 'Bordereau de suivi cargaison',
    categorie: 'transport',
    emetteur: 'Guichet ou agence mandatée par le pays de destination',
    objet:
      'Suivi imposé par plusieurs pays d’Afrique de l’Ouest et centrale, à valider avant embarquement.',
    rubriques: [
      { label: 'Numéro de bordereau', indication: 'Attribué à la validation.' },
      { label: 'Expéditeur et destinataire', indication: 'Tels qu’au connaissement.' },
      { label: 'Navire, conteneur, ports', indication: 'Repris du titre de transport.' },
      { label: 'Valeur et nature de la marchandise', indication: 'Alignées sur la facture.' },
      { label: 'Date de validation', indication: 'Doit précéder le départ du navire.' },
    ],
    pieges: [
      'Un bordereau validé après le départ : amende à l’arrivée, à la charge de qui n’a pas anticipé.',
      'Un document exigé selon la destination : vérifiez avant de coter.',
    ],
  },
  {
    code: 'IMP-01',
    titre: 'Déclaration d’importation (destination)',
    categorie: 'douane',
    emetteur: 'Courtier en douane de l’acheteur',
    objet: 'Déclarer l’entrée de la marchandise et liquider droits et taxes.',
    rubriques: [
      { label: 'Importateur et identifiant', indication: 'À la charge de l’acheteur.' },
      { label: 'Position tarifaire et origine', indication: 'Détermine le taux applicable.' },
      { label: 'Valeur en douane', indication: 'Selon l’incoterm et les frais à ajouter.' },
      { label: 'Régime préférentiel invoqué', indication: 'Avec la référence du certificat d’origine.' },
    ],
    pieges: [
      'Une origine mal justifiée : l’acheteur paie le droit plein et se retourne contre vous.',
    ],
  },
  {
    code: 'DSCE',
    titre: 'Document sanitaire commun d’entrée',
    categorie: 'sanitaire',
    emetteur: 'Importateur, dans le système du pays de destination',
    objet: 'Annoncer le lot au poste de contrôle frontalier et déclencher l’inspection.',
    rubriques: [
      { label: 'Référence du certificat phytosanitaire', indication: 'Le numéro de l’original accompagne l’envoi.' },
      { label: 'Poste de contrôle frontalier', indication: 'Point d’entrée où le lot sera présenté.' },
      { label: 'Description et quantité', indication: 'Alignées sur les autres pièces.' },
      { label: 'Date prévue d’arrivée', indication: 'La notification est préalable à l’arrivée.' },
    ],
    pieges: [
      'Une notification tardive : le lot attend en zone sous douane, aux frais du propriétaire.',
    ],
  },
  {
    code: 'POD-01',
    titre: 'Bon de livraison signé',
    categorie: 'transport',
    emetteur: 'Destinataire, à la réception',
    objet: 'Preuve de livraison — et point de départ du délai de réserves.',
    rubriques: [
      { label: 'Identification de l’envoi', indication: 'Conteneur, lots, nombre de colis livrés.' },
      { label: 'Date et heure de livraison', indication: 'Déclenche le délai contractuel de réserves.' },
      { label: 'Température au déchargement', indication: 'Pour un envoi sous froid.' },
      { label: 'Réserves du destinataire', indication: 'Portées sur le document, précises et datées.' },
      { label: 'Signature et cachet', indication: 'Personne habilitée du destinataire.' },
    ],
    pieges: [
      'Un bon signé sans réserve alors que des colis sont endommagés.',
      'Un exemplaire signé non conservé : plus de preuve de la date de livraison.',
    ],
  },
  {
    code: 'QC-INSP',
    titre: 'Procès-verbal d’agréage à réception',
    categorie: 'sanitaire',
    emetteur: 'Contrôle contradictoire, acheteur et vendeur ou leurs mandataires',
    objet: 'Constater la qualité livrée et arrêter, le cas échéant, les avaries.',
    rubriques: [
      { label: 'Parties présentes', indication: 'L’agréage contradictoire suppose les deux parties ou leurs représentants.' },
      { label: 'Lot et quantité contrôlés', indication: 'Échantillonnage décrit.' },
      { label: 'Paramètres constatés', indication: 'En regard des exigences du contrat.' },
      { label: 'Avaries et écarts', indication: 'Nature, ampleur, causes présumées.' },
      { label: 'Conclusion et suites', indication: 'Acceptation, réfaction, refus.' },
    ],
    tableau: {
      intitule: 'Constats',
      colonnes: ['Paramètre', 'Contrat', 'Constaté', 'Écart'],
    },
    pieges: [
      'Un agréage non contradictoire : le constat n’engage que celui qui l’a fait.',
      'Un procès-verbal établi hors du délai contractuel.',
    ],
  },
];

export const MODELES_AVERTISSEMENT =
  'Ces modèles décrivent la structure et les rubriques attendues de chaque pièce : ce sont des supports de travail, pas des formulaires officiels. Les imprimés en vigueur s’obtiennent auprès des administrations et organismes compétents — ministères, douanes, chambre de commerce, laboratoires et transitaires agréés — dont les exigences évoluent.';

export function modelesParCategorie(cat: CategorieModele | 'tous'): ModeleDocument[] {
  return cat === 'tous' ? MODELES_DOCUMENTS : MODELES_DOCUMENTS.filter((m) => m.categorie === cat);
}
