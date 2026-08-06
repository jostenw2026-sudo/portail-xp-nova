// Experts — CDC V1.2 §5.5. Une catégorie ne s'affiche que si elle contient un profil réel.
// À ce jour : 1 profil documenté (fondateur, CV DJ). Pas de profil fictif.

export type Expert = {
  slug: string;
  name: string;
  role: string;
  category: "Direction" | "Experts permanents" | "Experts associés" | "Réseau de partenaires";
  bio: string;
  expertises: string[];
  langues: string[];
  pays: string[];
  projets: string[];
  ordre: string;
  featured?: boolean;
};

export const experts: Expert[] = [
  {
    slug: "josten-magloire-wandji",
    name: "Josten Magloire WANDJI",
    role: "Gérant statutaire · Ingénieur, Expert en ingénierie et gestion de projets",
    category: "Direction",
    bio:
      "Ingénieur électromécanicien (ENSP Yaoundé), fort de plus de 37 ans d'expérience dans la conduite de grands projets d'équipements publics — de la conception à la réception. Il a piloté des lots technologiques sur des aéroports, stades, universités, hôpitaux et réseaux en Afrique centrale et au Burkina Faso, comme figure technique de référence de GEQUIPS et, aujourd'hui, dirigeant de XP-NOVA.",
    expertises: [
      "Ingénierie et gestion de projets",
      "Maîtrise d'œuvre de lots technologiques",
      "Assistance à maîtrise d'ouvrage",
      "Audit technico-financier de projets",
      "Coordination BIM",
      "MEP, électricité HT/BT, énergies renouvelables",
    ],
    langues: ["Français", "Anglais"],
    pays: ["Cameroun", "Burkina Faso", "Gabon", "Guinée équatoriale", "RCA", "Congo"],
    projets: [
      "Barrage de Kikot-Mbebe (coordination BIM, 2024-2025)",
      "Complexe olympique d'Olembé",
      "Aéroport de Ouagadougou-Donsin",
      "Immeuble Banque mondiale Cameroun",
    ],
    ordre: "ONIGE — Matricule N° A001703",
    featured: true,
  },
];

export const expertsByCategory = () => {
  const cats = ["Direction", "Experts permanents", "Experts associés", "Réseau de partenaires"] as const;
  return cats
    .map((cat) => ({ category: cat, items: experts.filter((e) => e.category === cat) }))
    .filter((g) => g.items.length > 0); // aucune catégorie vide (C — CDC §5.5)
};

export const getExpert = (slug: string) => experts.find((e) => e.slug === slug);
