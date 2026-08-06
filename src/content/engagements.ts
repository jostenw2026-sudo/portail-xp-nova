// Engagements & conformité — CDC V1.2 §7. Politiques à produire (P0).
// Le site affiche le cadre ; les PDF sont marqués "à paraître" tant que non rédigés (pas de faux liens).

export type Engagement = {
  key: string;
  title: string;
  pitch: string;
  points: string[];
  docStatus: "public" | "a-paraitre";
};

export const engagements: Engagement[] = [
  {
    key: "esg",
    title: "Politique ESG",
    pitch: "Environnement, social et gouvernance intégrés à chaque mission, pas ajoutés après coup.",
    points: [
      "Environnement : réduction des impacts, gestion des déchets, solutions sobres en énergie.",
      "Social : inclusion, emploi local, sécurité des personnes.",
      "Gouvernance : transparence, conformité, responsabilité.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "genre-inclusion",
    title: "Genre & Inclusion",
    pitch: "L'égalité d'accès et la participation comme conditions de qualité des projets.",
    points: [
      "Égalité d'accès et participation des femmes.",
      "Inclusion des jeunes et des groupes vulnérables.",
      "Recrutement équitable et accès aux responsabilités.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "anti-corruption",
    title: "Anti-corruption",
    pitch: "Tolérance zéro : corruption, fraude, conflits d'intérêts et commissions occultes.",
    points: [
      "Déclaration d'intérêts et prévention des conflits.",
      "Dispositif de signalement.",
      "Procédure disciplinaire.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "qualite",
    title: "Qualité",
    pitch: "Un processus projet maîtrisé, du diagnostic à la capitalisation — cap ISO 9001.",
    points: [
      "Processus : diagnostic, conception, validation, mise en œuvre, contrôle, capitalisation.",
      "Livrables vérifiables à chaque phase.",
      "Trajectoire de certification : manuel qualité, puis ISO 9001.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "hse",
    title: "Hygiène, Sécurité, Environnement",
    pitch: "Zéro accident grave : prévention et amélioration continue.",
    points: ["Objectif zéro accident grave.", "Culture de prévention.", "Amélioration continue."],
    docStatus: "a-paraitre",
  },
];
