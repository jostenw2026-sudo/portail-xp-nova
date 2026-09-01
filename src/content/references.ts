// Références — issues du CV du fondateur (DJ).
// CHAQUE fiche porte un "cadre" (Cadre d'intervention) obligatoire — arbitrage C7.
// Aucune mission n'est présentée comme un contrat XP-NOVA si elle ne l'est pas.

export type Reference = {
  slug: string;
  title: string;
  client: string; // donneur d'ordre
  clientFinal?: string;
  pays: string;
  annees: string;
  metiers: string[]; // slugs de métiers
  typeMission: string;
  cadre: string; // CADRE D'INTERVENTION — obligatoire (C7)
  contexte: string;
  mission: string;
  resultats: string;
  featured?: boolean;
};

// Cadres types (transparence C7)
const CADRE_GEQUIPS =
  "Mission conduite par l'expert fondateur de XP-NOVA au sein de GEQUIPS SARL — société associée de XP-NOVA (10 % du capital) et partenaire technique lié par convention d'appui.";
const CADRE_DGTC =
  "Mission conduite par le fondateur de XP-NOVA dans le cadre de ses fonctions publiques à la Direction Générale des Grands Travaux du Cameroun (DGTC) — trajectoire professionnelle du promoteur, antérieure à la constitution de la société (2006).";

export const references: Reference[] = [
  {
    slug: "barrage-kikot-mbebe-lots-technologiques",
    title: "Ouvrages connexes du barrage hydroélectrique de Kikot-Mbebe — lots technologiques",
    client: "EGIS-Cameroun",
    pays: "Cameroun",
    annees: "2024–2025",
    metiers: ["etudes-conseil", "ingenierie"],
    typeMission: "Études & coordination BIM",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Études architecturales et d'ingénierie des ouvrages connexes d'un grand barrage hydroélectrique : enveloppe de l'usine, bureaux d'exploitation et cité de 75 logements.",
    mission:
      "Chef de mission Études et coordonnateur BIM des lots technologiques : électricité courants forts et faibles, plomberie et protection incendie, CVC et désenfumage, énergies renouvelables, AEP, assainissement, équipements sportifs et de restauration.",
    resultats:
      "Conception coordonnée en maquette numérique des lots techniques sur les trois composantes du projet.",
    featured: true,
  },
  {
    slug: "complexe-olympique-olembe",
    title: "Complexe Olympique et Sportif d'Olembé",
    client: "EGIS-Cameroun",
    pays: "Cameroun",
    annees: "2018",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "EXE — VISA lots technologiques",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Complexe olympique comprenant un stade couvert de 60 000 places, des terrains d'entraînement, un gymnase, une piscine olympique, un hôtel 5 étoiles et les VRD associés.",
    mission:
      "Vérification et visa des études d'exécution (EXE-VISA) des lots technologiques de l'ensemble du complexe.",
    resultats: "Lots techniques visés pour l'exécution d'un équipement sportif d'envergure internationale.",
    featured: true,
  },
  {
    slug: "stade-omnisport-yaounde",
    title: "Réhabilitation du Stade Omnisport de Yaoundé",
    client: "EGIS-Cameroun",
    pays: "Cameroun",
    annees: "2015–2016",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "DIA, APS, APD, DCE, contrôle des travaux",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Réhabilitation complète d'un stade de 30 000 places avec mise aux normes CAF/FIFA en vue d'une compétition continentale.",
    mission:
      "Diagnostic, APS, APD, DCE et contrôle d'exécution de tous les lots technologiques.",
    resultats: "Stade mis aux normes internationales dans le calendrier de la compétition.",
    featured: true,
  },
  {
    slug: "aeroport-ouagadougou-donsin",
    title: "Nouvel aéroport de Ouagadougou-Donsin",
    client: "EGIS International France",
    clientFinal: "État du Burkina Faso",
    pays: "Burkina Faso",
    annees: "2012–2013",
    metiers: ["ingenierie"],
    typeMission: "Maîtrise d'œuvre de conception (APD/DCE)",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Construction d'un nouvel aéroport international : ensemble de 80 bâtiments pour 120 000 m².",
    mission: "Maîtrise d'œuvre de conception, phases APD/DCE des lots techniques.",
    resultats: "Dossiers de conception livrés pour un aéroport international.",
    featured: true,
  },
  {
    slug: "aeroport-malabo",
    title: "Nouvel aérogare de l'aéroport de Malabo",
    client: "SCET-Cameroun (aujourd'hui EGIS-Cameroun)",
    clientFinal: "Guinée équatoriale",
    pays: "Guinée équatoriale",
    annees: "1999–2005",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Maîtrise d'œuvre des lots techniques (APS→CET)",
    cadre: CADRE_GEQUIPS,
    contexte: "Construction du nouvel aérogare de l'aéroport international de Malabo, travaux réalisés par Bouygues.",
    mission: "Maîtrise d'œuvre des lots techniques, phases APS-APD-DCE-CET.",
    resultats: "Aérogare international réalisé avec un groupe de BTP de premier plan.",
  },
  {
    slug: "aeroport-nsimalen-cdou",
    title: "Centre Directeur d'Opérations d'urgence — Aéroport de Yaoundé-Nsimalen",
    client: "EGIS-Cameroun",
    pays: "Cameroun",
    annees: "2016",
    metiers: ["ingenierie"],
    typeMission: "Études lots techniques (APS-APD-DCE)",
    cadre: CADRE_GEQUIPS,
    contexte: "Construction d'un CDOU (SS+R+3, 1 800 m²) sur l'aéroport international de Yaoundé-Nsimalen.",
    mission: "Études des lots techniques, phases APS-APD-DCE.",
    resultats: "Dossiers techniques livrés pour un équipement aéroportuaire stratégique.",
  },
  {
    slug: "immeuble-assemblee-nationale",
    title: "Immeuble siège de l'Assemblée nationale du Cameroun",
    client: "BET CERG",
    pays: "Cameroun",
    annees: "2013",
    metiers: ["ingenierie"],
    typeMission: "Maîtrise d'œuvre conception (APS-APD)",
    cadre: CADRE_GEQUIPS,
    contexte: "Construction de l'immeuble siège de l'Assemblée nationale.",
    mission: "Maîtrise d'œuvre de conception, phases APS-APD des lots technologiques.",
    resultats: "Conception des lots technologiques d'un bâtiment institutionnel majeur.",
  },
  {
    slug: "ecole-normale-superieure-maroua",
    title: "Campus de l'École Normale de Maroua",
    client: "EGIS-Cameroun",
    pays: "Cameroun",
    annees: "2008–2012",
    metiers: ["maitrise-doeuvre", "amo-amoa"],
    typeMission: "Maîtrise d'œuvre complète (APS→AOR)",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Construction d'un campus complet : bâtiment administratif, amphithéâtres, restaurants, bibliothèque, cité d'hébergement, complexe sportif, centrales d'énergie, assainissement et AEP.",
    mission: "Maîtrise d'œuvre complète, phases APS-APD-DCE-AMO-EXE-CET-AOR.",
    resultats: "Campus universitaire livré, de la conception à la réception.",
    featured: true,
  },
  {
    slug: "bureau-banque-mondiale-cameroun",
    title: "Immeuble de bureaux de la Banque mondiale au Cameroun",
    client: "EGIS-Cameroun",
    clientFinal: "Banque mondiale",
    pays: "Cameroun",
    annees: "2010–2012",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Maîtrise d'œuvre lots technologiques + contrôle",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Construction de l'immeuble devant abriter les services de la Banque mondiale, selon les standards du bailleur.",
    mission:
      "Maîtrise d'œuvre de conception des lots technologiques suivant les standards de la Banque mondiale et contrôle d'exécution des travaux.",
    resultats: "Immeuble livré aux standards d'un bailleur international de premier plan.",
    featured: true,
  },
  {
    slug: "expertise-sonara-limbe",
    title: "Expertise technique — extension de l'usine SONARA",
    client: "SG Premier Ministre du Cameroun",
    clientFinal: "Société Nationale de Raffinage (SONARA)",
    pays: "Cameroun",
    annees: "2012",
    metiers: ["etudes-conseil"],
    typeMission: "Expertise & audit technique (EPCC)",
    cadre: CADRE_GEQUIPS,
    contexte: "Travaux d'extension et de réhabilitation de l'usine de raffinage SONARA à Limbé.",
    mission:
      "Vérification quantitative et qualitative des prestations d'Engineering, Procurement, Construction and Commissioning (EPCC).",
    resultats: "Rapport d'expertise remis au commanditaire institutionnel.",
  },
  {
    slug: "audit-bip-gabon",
    title: "Expertise-audit du Budget d'Investissement Public — Gabon",
    client: "Cabinet d'audit C2A France",
    clientFinal: "État gabonais",
    pays: "Gabon",
    annees: "2005",
    metiers: ["etudes-conseil", "suivi-evaluation"],
    typeMission: "Expertise & audit technico-financier",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Expertise et audit technique de projets d'équipements publics (santé, éducation, électrification, AEP) financés dans quatre provinces.",
    mission: "Audit technico-financier des projets réalisés, en appui à un cabinet d'audit international.",
    resultats: "Rapports d'audit remis, contribuant à la reddition des comptes publics.",
  },
  {
    slug: "reseaux-urbains-mongomeyen",
    title: "Réseaux urbains de la ville de Mongomeyen",
    client: "EGIS International Malabo",
    pays: "Guinée équatoriale",
    annees: "2013",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Maîtrise d'œuvre + contrôle des travaux",
    cadre: CADRE_GEQUIPS,
    contexte:
      "Réseaux d'alimentation électrique par centrale thermique, réseau d'AEP, réseaux d'eaux usées et eaux vannes.",
    mission: "Maîtrise d'œuvre de conception des lots techniques et contrôle d'exécution des travaux.",
    resultats: "Réseaux urbains conçus et supervisés jusqu'à l'exécution.",
  },
  {
    slug: "adduction-eau-yaounde",
    title: "Adduction d'eau de la ville de Yaoundé",
    client: "Direction Générale des Grands Travaux du Cameroun (DGTC)",
    pays: "Cameroun",
    annees: "1989–1993",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Contrôle d'exécution",
    cadre: CADRE_DGTC,
    contexte:
      "Station de captage sur le Nyong à Mbalmayo, réseau principal Mbalmayo–Yaoundé et châteaux d'eau.",
    mission: "Ingénieur de projet chargé du contrôle d'exécution.",
    resultats: "Infrastructure d'eau potable structurante pour la capitale.",
  },
  {
    slug: "immeuble-ministeriel-2-igh",
    title: "Immeuble ministériel N°2 (IGH) — réhabilitation et parachèvement",
    client: "Direction Générale des Grands Travaux du Cameroun (DGTC)",
    pays: "Cameroun",
    annees: "1992–1994",
    metiers: ["maitrise-doeuvre"],
    typeMission: "Contrôle d'exécution",
    cadre: CADRE_DGTC,
    contexte: "Réhabilitation et parachèvement d'un immeuble de grande hauteur de 20 000 m² abritant trois ministères.",
    mission: "Contrôle d'exécution des lots techniques réalisés par Dragados.",
    resultats: "Immeuble de grande hauteur livré pour l'administration centrale.",
  },
];

export const getReference = (slug: string) => references.find((r) => r.slug === slug);
export const featuredReferences = references.filter((r) => r.featured);

export const referencePays = [...new Set(references.map((r) => r.pays))].sort();
export const referenceTypes = [...new Set(references.map((r) => r.typeMission))].sort();

// ─── Agrégats publics (vitrine sans intitulés de projets ni donneurs d'ordre) ───
// Catégorie de secteur déduite du slug (même logique que refCategory, mais
// server-safe : dupliquée ici pour éviter d'importer un module d'illustrations).
function categoryOf(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("barrage") || s.includes("kikot")) return "energie";
  if (s.includes("olembe") || s.includes("stade") || s.includes("omnisport")) return "stade";
  if (s.includes("aeroport")) return "aeroport";
  if (s.includes("adduction") || s.includes("eau")) return "eau";
  if (s.includes("ecole") || s.includes("normale") || s.includes("campus") || s.includes("universit")) return "campus";
  if (s.includes("sonara") || s.includes("usine") || s.includes("industri")) return "industrie";
  if (s.includes("audit") || s.includes("bip")) return "audit";
  if (s.includes("reseau")) return "reseaux";
  return "batiment";
}

const _years = references.flatMap((r) => (r.annees.match(/\d{4}/g) ?? []).map(Number));

export const referenceSummary = {
  total: references.length,
  pays: referencePays,
  anneeMin: Math.min(..._years),
  anneeMax: Math.max(..._years),
  parSecteur: references.reduce<Record<string, number>>((acc, r) => {
    const c = categoryOf(r.slug);
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {}),
};
