import { referenceSummary } from "@/content/references";

// Vitrine des références en agrégats purs : ni intitulés de projets, ni donneurs
// d'ordre. Secteurs, pays et période seulement. Détail sur demande. Bilingue.

type Lang = "fr" | "en";

const SECTEURS: Record<string, { fr: string; en: string }> = {
  aeroport: { fr: "Aéroports", en: "Airports" },
  stade: { fr: "Stades & complexes sportifs", en: "Stadiums & sports complexes" },
  campus: { fr: "Campus & équipements éducatifs", en: "Campuses & education facilities" },
  batiment: { fr: "Bâtiments & immeubles de grande hauteur", en: "Buildings & high-rises" },
  eau: { fr: "Eau & adduction", en: "Water & supply" },
  reseaux: { fr: "Réseaux urbains", en: "Urban networks" },
  energie: { fr: "Énergie", en: "Energy" },
  industrie: { fr: "Industrie", en: "Industry" },
  audit: { fr: "Audit & expertise", en: "Audit & expertise" },
};

export default function ReferencesSummary({ lang = "fr" }: { lang?: Lang }) {
  const s = referenceSummary;
  const t = (o: { fr: string; en: string }) => (lang === "en" ? o.en : o.fr);
  const secteurs = Object.entries(s.parSecteur).sort((a, b) => b[1] - a[1]);
  const tiles = [
    { num: String(s.total), label: lang === "en" ? "documented projects" : "projets documentés" },
    { num: String(s.pays.length), label: lang === "en" ? "countries" : "pays" },
    { num: `${s.anneeMin}–${s.anneeMax}`, label: lang === "en" ? "period covered" : "période couverte" },
    { num: String(secteurs.length), label: lang === "en" ? "facility families" : "familles d'équipements" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {tiles.map((x) => (
          <div key={x.label} className="rounded-lg border border-line bg-paper p-6 text-center">
            <div className="font-display text-3xl font-extrabold text-gold">{x.num}</div>
            <div className="mt-1 text-sm text-grey">{x.label}</div>
          </div>
        ))}
      </div>

      <h2 className="title-3 mt-10 text-navy">
        {lang === "en" ? "By facility family" : "Par famille d'équipements"}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {secteurs.map(([k, n]) => (
          <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-paper p-5">
            <span className="font-semibold text-navy">{SECTEURS[k] ? t(SECTEURS[k]) : k}</span>
            <span className="rounded-full bg-light px-3 py-1 text-sm font-bold text-navy">{n}</span>
          </div>
        ))}
      </div>

      <h2 className="title-3 mt-10 text-navy">{lang === "en" ? "Countries of operation" : "Pays d'intervention"}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {s.pays.map((p) => (
          <li key={p} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-medium text-navy">
            {p}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-grey">
        {lang === "en"
          ? "Nature of assignments: technical design supervision and works inspection of the technology packages (electrical, low-current, HVAC, plumbing, safety, networks)."
          : "Nature des missions : maîtrise d'œuvre technique de conception et contrôle d'exécution des lots technologiques (électricité, courants faibles, CVC, plomberie, sécurité, réseaux)."}
      </p>
    </div>
  );
}
