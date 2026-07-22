// Configuration globale du site — CDC V1.2 §3, charte narrative §5-6
// Périmètre BIC : neutralité sectorielle absolue.

export const site = {
  name: "XP-NOVA",
  baseline: "Bureau d'Ingénierie Conseil", // C19 — baseline exclusive
  legalName: "XP-NOVA SARL",
  domainProd: "odt.xp-nova.com",
  domainChantier: "bingeco.xp-nova.com",
  url: "https://odt.xp-nova.com",
  devise: "Concevoir. Structurer. Piloter. Sécuriser.",
  manifesto: "Les projets ne manquent pas d'ambition. Ils manquent d'ingénierie.",
  description:
    "XP-NOVA — Bureau d'Ingénierie Conseil : études, ingénierie, AMO/AMOA, maîtrise d'œuvre, structuration et suivi-évaluation de projets publics et privés en Afrique centrale.",
  city: "Yaoundé",
  country: "Cameroun",
  email: "contact@xp-nova.com",
  phone: "+237 6 70 04 80 00",
  address: "134, Rue 1813, Vallée Bastos — B.P. 5603, Yaoundé, Cameroun",
  responsePromise: "48 h",
  legal: {
    forme: "SARL pluripersonnelle",
    capital: "10 000 000 FCFA",
    rccm: "RC/YAO/2006/B/945",
    niu: "M01060001983W",
  },
  proofStats: [
    { value: "7", label: "métiers d'ingénierie" },
    { value: "6", label: "phases de méthode" },
    { value: "5", label: "pays d'intervention" },
    { value: "48 h", label: "premier retour" },
  ],
  // Cet écosystème est celui affiché DEPUIS le site ODT : on pointe vers le
  // portail (hub) et la branche sœur AGROVITA — pas d'auto-référence à ODT.
  ecosystem: [
    {
      key: "portail",
      name: "XP-NOVA",
      tagline: "Portail — Bureau d'Ingénierie Conseil",
      url: "https://xp-nova.com",
    },
    {
      key: "agrovita",
      name: "AGROVITA",
      tagline: "Agriculture & agro-industrie",
      url: "https://agrovita.xp-nova.com",
    },
  ],
} as const;

export const nav = [
  { label: "Le Cabinet", href: "/cabinet" },
  { label: "Nos Métiers", href: "/metiers" },
  { label: "Notre Méthode", href: "/methode" },
  { label: "Références", href: "/references" },
  { label: "Équipe", href: "/equipe" },
  { label: "Ressources", href: "/ressources" },
] as const;

// CTA canoniques — charte §6.1
export const cta = {
  primary: { label: "Parlons de votre projet", href: "/contact" },
  secondary: { label: "Découvrir nos métiers", href: "/metiers" },
} as const;
