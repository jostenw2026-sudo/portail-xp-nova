// Méthode en 6 phases — CDC V1.2 §3.2, charte §3 récit 2. Ordre verrouillé (C10).

export type Phase = {
  n: number;
  key: string;
  title: string;
  baseline: string;
  objectif: string;
  activites: string[];
  livrables: string[];
};

export const phases: Phase[] = [
  {
    n: 1,
    key: "comprendre",
    title: "Comprendre",
    baseline: "Diagnostic & analyse",
    objectif: "Établir une lecture partagée et objective de la situation de départ.",
    activites: ["Diagnostic", "État des lieux", "Collecte des données", "Analyse des besoins"],
    livrables: ["Rapport de diagnostic", "Note d'analyse des besoins"],
  },
  {
    n: 2,
    key: "concevoir",
    title: "Concevoir",
    baseline: "Scénarios & dimensionnement",
    objectif: "Traduire le besoin en solutions dimensionnées et comparables.",
    activites: ["Scénarios", "Études", "Dimensionnement", "Modélisation"],
    livrables: ["Études APS / APD", "Note de scénarios comparés"],
  },
  {
    n: 3,
    key: "structurer",
    title: "Structurer",
    baseline: "Gouvernance & financement",
    objectif: "Rendre le projet gouvernable et finançable.",
    activites: ["Gouvernance", "Financement", "Organisation", "Montage juridique"],
    livrables: ["Business plan", "Plan de financement", "Schéma de gouvernance"],
  },
  {
    n: 4,
    key: "realiser",
    title: "Réaliser",
    baseline: "Pilotage & coordination",
    objectif: "Exécuter conformément à la conception, sous contrôle.",
    activites: ["AMO", "Pilotage", "Contrôle", "Coordination"],
    livrables: ["Tableaux de bord de pilotage", "Rapports de contrôle", "PV de réception"],
  },
  {
    n: 5,
    key: "perenniser",
    title: "Pérenniser",
    baseline: "Formation & maintenance",
    objectif: "Ancrer l'autonomie et la durabilité des résultats.",
    activites: ["Formation", "Maintenance", "Suivi", "Capitalisation"],
    livrables: ["Plan de formation", "Manuels de procédures", "Plan de maintenance"],
  },
  {
    n: 6,
    key: "mesurer",
    title: "Mesurer l'impact",
    baseline: "Indicateurs & résultats",
    objectif: "Démontrer les résultats et en tirer les enseignements.",
    activites: ["Indicateurs", "Performance", "Résultats", "Enseignements"],
    livrables: ["Cadre logique", "Rapport d'évaluation d'impact"],
  },
];
