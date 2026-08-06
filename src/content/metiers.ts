// Les 7 métiers — CDC V1.2 §3.2, §4.2. Slugs et SEO arbitrés (C2, C3).

export type Metier = {
  slug: string;
  title: string;
  short: string; // 1 phrase pour cartes
  h1: string;
  seoTitle: string;
  metaDescription: string;
  keyword: string;
  intro: string; // "Pourquoi"
  enjeu: string[];
  prestations: { title: string; desc: string }[];
  livrables: string[];
  application?: string; // renvoi AGROVITA/ODT
};

export const metiers: Metier[] = [
  {
    slug: "etudes-conseil",
    title: "Études & Conseil",
    short: "Des études fiables pour décider, arbitrer et financer.",
    h1: "Études & Conseil",
    seoTitle: "Études de faisabilité et conseil — XP-NOVA Cameroun",
    metaDescription:
      "Faisabilité, diagnostics, audits techniques, expertises et enquêtes : des études fiables pour décider et financer vos projets.",
    keyword: "étude de faisabilité Cameroun",
    intro:
      "Un projet mal étudié coûte plus cher à corriger qu'à concevoir. Nos études transforment une intuition en décision documentée, opposable aux financeurs comme aux autorités.",
    enjeu: [
      "Sécuriser la décision d'investir avant d'engager les fonds.",
      "Objectiver la faisabilité technique, économique et institutionnelle.",
      "Produire un dossier recevable par les banques et les bailleurs.",
    ],
    prestations: [
      { title: "Études de faisabilité", desc: "Technique, économique, financière et institutionnelle." },
      { title: "Diagnostics techniques", desc: "État des lieux, expertise et recommandations chiffrées." },
      { title: "Audits techniques", desc: "Vérification de conformité, de performance et de coûts." },
      { title: "Expertises & enquêtes", desc: "Collecte de données terrain, analyse des besoins." },
    ],
    livrables: [
      "Rapport de faisabilité",
      "Étude de diagnostic",
      "Rapport d'audit technique",
      "Note d'analyse des besoins",
    ],
    application:
      "Cette expertise s'applique aux filières agricoles (AGROVITA) comme aux programmes de territoire (ODT).",
  },
  {
    slug: "ingenierie",
    title: "Ingénierie",
    short: "Concevoir et dimensionner, de l'APS au BIM.",
    h1: "Ingénierie",
    seoTitle: "Ingénierie technique APS, APD, DAO, BIM — XP-NOVA",
    metaDescription:
      "Conception APS/APD, DAO, dimensionnement, modélisation et coordination BIM pour bâtiments, équipements et infrastructures.",
    keyword: "ingénierie technique Cameroun",
    intro:
      "L'ingénierie transforme un programme en solution constructible : dimensionnée, chiffrée et coordonnée entre tous les corps d'état.",
    enjeu: [
      "Passer d'un besoin exprimé à une conception exécutable.",
      "Maîtriser les interfaces techniques et les coûts dès la conception.",
      "Fiabiliser les quantités et les délais par la modélisation.",
    ],
    prestations: [
      { title: "Études APS / APD", desc: "Avant-projets sommaire et détaillé." },
      { title: "Dossiers de consultation (DAO)", desc: "Pièces techniques pour la passation des marchés." },
      { title: "Dimensionnement & modélisation", desc: "Calculs, notes techniques, plans d'exécution." },
      { title: "Coordination BIM", desc: "Maquette numérique, détection d'interfaces, synthèse." },
    ],
    livrables: ["Dossier APS", "Dossier APD", "DAO / DCE", "Maquette BIM & notes de calcul"],
    application:
      "L'ingénierie XP-NOVA sert aussi bien les unités agro-industrielles (AGROVITA) que les infrastructures territoriales (ODT).",
  },
  {
    slug: "amo-amoa",
    title: "AMO / AMOA",
    short: "Représenter et sécuriser le maître d'ouvrage.",
    h1: "Assistance à Maîtrise d'Ouvrage",
    seoTitle: "AMO / AMOA au Cameroun et en Afrique — XP-NOVA",
    metaDescription:
      "Assistance à maîtrise d'ouvrage : pilotage, passation des marchés, contrôle qualité et sécurisation des projets complexes.",
    keyword: "assistance à maîtrise d'ouvrage Afrique",
    intro:
      "Le maître d'ouvrage porte le risque mais rarement l'expertise technique au quotidien. L'AMO comble cet écart : nous représentons vos intérêts à chaque décision.",
    enjeu: [
      "Défendre les intérêts du maître d'ouvrage face aux intervenants.",
      "Sécuriser la passation et l'exécution des marchés.",
      "Tenir les coûts, les délais et la qualité.",
    ],
    prestations: [
      { title: "Assistance à maîtrise d'ouvrage", desc: "De la programmation à la réception." },
      { title: "AMOA", desc: "Assistance à maîtrise d'ouvrage déléguée et program management." },
      { title: "Passation des marchés", desc: "Rédaction, analyse des offres, conformité réglementaire." },
      { title: "Contrôle qualité", desc: "Suivi des exigences et des livrables des prestataires." },
    ],
    livrables: [
      "Rapport de programmation",
      "Rapport d'analyse des offres",
      "Tableaux de bord de pilotage",
      "Procès-verbaux de réception",
    ],
    application:
      "Nos missions d'AMO couvrent les projets agricoles structurants (AGROVITA) et les équipements publics de territoire (ODT).",
  },
  {
    slug: "maitrise-doeuvre",
    title: "Maîtrise d'Œuvre",
    short: "Concevoir, superviser et réceptionner les ouvrages.",
    h1: "Maîtrise d'Œuvre",
    seoTitle: "Maîtrise d'œuvre — supervision de travaux — XP-NOVA",
    metaDescription:
      "Conception, supervision, contrôle des travaux et réception des ouvrages : une maîtrise d'œuvre rigoureuse et documentée.",
    keyword: "maîtrise d'œuvre Cameroun",
    intro:
      "La maîtrise d'œuvre garantit que l'ouvrage livré est conforme à l'ouvrage conçu — en qualité, en coût et en délai.",
    enjeu: [
      "Traduire la conception en réalisation conforme.",
      "Contrôler l'exécution et prévenir les dérives.",
      "Sécuriser la réception et la levée des réserves.",
    ],
    prestations: [
      { title: "Conception", desc: "Études de maîtrise d'œuvre jusqu'au dossier d'exécution." },
      { title: "Supervision des travaux", desc: "Direction de l'exécution, visas, réunions de chantier." },
      { title: "Contrôle des travaux", desc: "Vérification de conformité et de qualité." },
      { title: "Réception des ouvrages", desc: "Opérations préalables, réserves, réception définitive." },
    ],
    livrables: [
      "Dossier d'exécution visé",
      "Comptes rendus de chantier",
      "Rapports de contrôle",
      "PV de réception",
    ],
  },
  {
    slug: "structuration-de-projets",
    title: "Structuration de Projets",
    short: "Rendre un projet finançable et bancable.",
    h1: "Structuration de Projets",
    seoTitle: "Structuration et financement de projets — XP-NOVA",
    metaDescription:
      "Business plans, modèles économiques, ingénierie financière, PPP et mobilisation des financements pour projets bancables.",
    keyword: "structuration de projets Afrique",
    intro:
      "Un bon projet technique n'est pas toujours un projet finançable. La structuration en fait un actif : montage, modèle économique et financement s'articulent autour d'une gouvernance claire.",
    enjeu: [
      "Transformer un projet en dossier bancable.",
      "Construire un montage financier et juridique solide.",
      "Mobiliser les bons financements auprès des bons partenaires.",
    ],
    prestations: [
      { title: "Business plans", desc: "Modèles économiques et projections en FCFA, hypothèses explicites." },
      { title: "Ingénierie financière", desc: "Plans de financement, structuration de la dette et des fonds propres." },
      { title: "Partenariats public-privé", desc: "Montage, allocation des risques, contractualisation." },
      { title: "Mobilisation des financements", desc: "Dossiers pour banques, bailleurs et fonds dédiés." },
    ],
    livrables: [
      "Business plan complet",
      "Plan de financement",
      "Note de structuration PPP",
      "Dossier de demande de financement",
    ],
    application:
      "La structuration s'applique aux projets d'investissement agricole (AGROVITA) et aux programmes territoriaux financés par les bailleurs (ODT).",
  },
  {
    slug: "suivi-evaluation",
    title: "Suivi-Évaluation",
    short: "Mesurer, prouver et piloter par les résultats.",
    h1: "Suivi-Évaluation",
    seoTitle: "Suivi-évaluation et mesure d'impact — XP-NOVA",
    metaDescription:
      "Cadres logiques, indicateurs, gestion axée résultats et mesure d'impact conformes aux exigences des bailleurs.",
    keyword: "suivi-évaluation de projets",
    intro:
      "Ce qui ne se mesure pas ne se pilote pas. Le suivi-évaluation outille la décision et démontre l'impact aux financeurs, selon les standards internationaux.",
    enjeu: [
      "Piloter le projet par des indicateurs fiables.",
      "Démontrer les résultats et l'impact aux bailleurs.",
      "Capitaliser les enseignements pour les projets suivants.",
    ],
    prestations: [
      { title: "Cadres logiques", desc: "Chaîne de résultats, hypothèses et indicateurs." },
      { title: "Gestion axée résultats", desc: "Dispositifs de suivi de la performance." },
      { title: "Indicateurs & KPI", desc: "Définition, collecte et tableaux de bord." },
      { title: "Mesure d'impact", desc: "Évaluations à mi-parcours et finales." },
    ],
    livrables: [
      "Cadre logique",
      "Plan de suivi-évaluation",
      "Tableaux de bord d'indicateurs",
      "Rapport d'évaluation d'impact",
    ],
    application:
      "Nos dispositifs de suivi-évaluation accompagnent les projets agricoles (AGROVITA) et les programmes de développement territorial (ODT).",
  },
  {
    slug: "formation",
    title: "Formation & Renforcement des Capacités",
    short: "Transférer les compétences pour pérenniser.",
    h1: "Formation & Renforcement des Capacités",
    seoTitle: "Formation et renforcement des capacités — XP-NOVA",
    metaDescription:
      "Transfert de compétences, formation des équipes projet et renforcement institutionnel pour pérenniser vos investissements.",
    keyword: "renforcement des capacités",
    intro:
      "Un ouvrage sans équipe formée pour l'exploiter est un investissement à demi réalisé. Nous transférons les compétences qui rendent vos équipes autonomes.",
    enjeu: [
      "Pérenniser l'investissement par l'autonomie des équipes.",
      "Renforcer les capacités techniques et de gestion.",
      "Ancrer les méthodes dans l'organisation.",
    ],
    prestations: [
      { title: "Formation technique", desc: "Sur les métiers, outils et procédures du projet." },
      { title: "Renforcement institutionnel", desc: "Organisation, procédures, gouvernance." },
      { title: "Transfert de compétences", desc: "Accompagnement à la prise en main opérationnelle." },
      { title: "Ateliers & séminaires", desc: "Sessions sur mesure pour équipes et décideurs." },
    ],
    livrables: [
      "Plan de formation",
      "Supports et modules",
      "Manuels de procédures",
      "Rapport d'évaluation des acquis",
    ],
  },
];

export const getMetier = (slug: string) => metiers.find((m) => m.slug === slug);
