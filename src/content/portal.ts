// Portail xp-nova.com — hub de la marque mère, oriente vers les deux branches.
// Baseline exclusive « Bureau d'Ingénierie Conseil » (arbitrage C19).

export const portal = {
  name: "XP-NOVA",
  baseline: "Bureau d'Ingénierie Conseil",
  legalName: "XP-NOVA SARL",
  url: "https://xp-nova.com",
  devise: "Concevoir. Structurer. Piloter. Sécuriser.",
  email: "contact@xp-nova.com",
  phone: "+237 6 70 04 80 00",
  address: "134, Rue 1813, Vallée Bastos — B.P. 5603, Yaoundé, Cameroun",
  legal: {
    forme: "SARL pluripersonnelle",
    capital: "10 000 000 FCFA",
    rccm: "RC/YAO/2006/B/945",
    niu: "M01060001983W",
  },
} as const;

// En dev, ODT n'est pas encore déployé sur son sous-domaine : on pointe vers le
// site ODT local (localhost:3000) pour tester le parcours. En production, on
// utilise le sous-domaine réel. AGROVITA est déjà en ligne : URL réelle partout.
const DEV = process.env.NODE_ENV !== "production";
const ODT_URL = DEV ? "http://localhost:3000" : "https://odt.xp-nova.com";

// Les deux branches d'application — cœur de la page de redirection.
export const branches = [
  {
    key: "agrovita",
    name: "AGROVITA",
    url: "https://agrovita.xp-nova.com",
    host: "agrovita.xp-nova.com",
    domaine: "Agriculture · Élevage · Agro-industrie",
    signature: "Produire. Transformer. Valoriser.",
    desc:
      "L'ingénierie XP-NOVA appliquée aux filières agricoles et agro-industrielles : des projets bancables, performants et conformes aux marchés.",
    audience: "Producteurs · Coopératives · Agro-industries · Investisseurs",
    accent: "#2E7D32", // vert — couleur de marque AGROVITA
  },
  {
    key: "odt",
    name: "ODT",
    url: ODT_URL,
    host: "odt.xp-nova.com",
    domaine: "Développement territorial · Ingénierie de projet",
    signature: "Planifier. Financer. Transformer.",
    desc:
      "L'ingénierie XP-NOVA au service des territoires : études, structuration, financement et pilotage de projets d'infrastructures et de développement.",
    audience: "États · Collectivités · Agences · Bailleurs",
    accent: "#0FA3B1", // turquoise territoire — couleur de marque ODT
  },
] as const;

// Le socle commun aux deux branches : une seule ingénierie.
export const metiers = [
  "Études & Conseil",
  "Ingénierie",
  "AMO / AMOA",
  "Maîtrise d'Œuvre",
  "Structuration & Financement",
  "Suivi-Évaluation",
  "Formation",
] as const;

export const methode = [
  "Comprendre",
  "Concevoir",
  "Structurer",
  "Réaliser",
  "Pérenniser",
  "Mesurer",
] as const;

export const piliers = [
  { t: "Expérience", d: "37 ans de pratique des grands projets dans 5 pays, portés par l'équipe fondatrice." },
  { t: "Méthode", d: "Six phases outillées, un livrable vérifiable à chaque étape." },
  { t: "Réseau d'experts", d: "Un noyau permanent et des capacités mobilisables en groupement." },
  { t: "Orientation résultats", d: "Des projets sécurisés, finançables et durables — de l'idée à l'impact." },
] as const;

export const stats = [
  { value: "2", label: "domaines d'application" },
  { value: "7", label: "métiers d'ingénierie" },
  { value: "5", label: "pays d'intervention" },
  { value: "48 h", label: "premier retour" },
] as const;
