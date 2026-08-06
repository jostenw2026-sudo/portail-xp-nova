// Ressources — accès CONTRÔLÉ (CDC V1.3).
// Aucun téléchargement libre : chaque document est transmis APRÈS inscription
// (capture du lead dans Odoo) ET validation manuelle. Les PDF ne sont donc PAS
// servis publiquement — ils ne figurent pas dans /public.
//
// acces  : toujours "sur-demande" désormais.
// docStatus : "a-paraitre" tant que le document n'est pas produit ; "public" = produit (demandable).

export type Ressource = {
  key: string;
  title: string;
  type: "Profil" | "Brochure" | "Politique" | "Publication";
  desc: string;
  acces: "public" | "sur-demande";
  docStatus: "public" | "a-paraitre";
};

export const ressources: Ressource[] = [
  {
    key: "capability-statement",
    title: "Capability Statement",
    type: "Profil",
    desc: "Présentation synthétique (2-4 pages) : métiers, références, atouts. Pour prises de contact et préqualifications.",
    acces: "sur-demande",
    docStatus: "public",
  },
  {
    key: "company-profile",
    title: "Company Profile",
    type: "Profil",
    desc: "Présentation institutionnelle complète : vision, histoire, métiers, méthode, équipe, références, gouvernance.",
    acces: "sur-demande",
    docStatus: "public",
  },
  {
    key: "referentiel-methodologique",
    title: "Référentiel méthodologique",
    type: "Publication",
    desc: "La méthode XP-NOVA en 6 phases, détaillée avec ses livrables.",
    acces: "sur-demande",
    docStatus: "public",
  },
  {
    key: "referentiel-pacte",
    title: "Référentiel PACTE",
    type: "Publication",
    desc: "Le modèle PACTE : Produire · Agréger · Commercialiser · Transformer · Exporter.",
    acces: "sur-demande",
    docStatus: "public",
  },
  {
    key: "cv-experts",
    title: "CV des experts (format bailleur)",
    type: "Profil",
    desc: "CV standardisés conformes aux exigences des bailleurs, transmis sur demande motivée.",
    acces: "sur-demande",
    docStatus: "public",
  },
  {
    key: "dossier-administratif",
    title: "Dossier administratif (RCCM, NIU, attestations)",
    type: "Publication",
    desc: "Pièces administratives et de conformité, transmises sur demande dans le cadre d'une procédure.",
    acces: "sur-demande",
    docStatus: "public",
  },
];
