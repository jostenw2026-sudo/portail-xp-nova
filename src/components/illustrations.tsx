// Illustrations vectorielles — style « épure technique / plan d'ingénierie ».
// Palette de marque, sans dépendance externe. Décoratives (aria-hidden).

const GOLD = "#D4A017";
const GOLD_SOFT = "#E9C25A";

function CompassStar({ gold = GOLD, soft = GOLD_SOFT }: { gold?: string; soft?: string }) {
  return (
    <g>
      <polygon points="0,-30 4,-8 0,-3 -4,-8" fill={gold} />
      <polygon points="0,30 4,8 0,3 -4,8" fill={gold} />
      <polygon points="-30,0 -8,4 -3,0 -8,-4" fill={gold} />
      <polygon points="30,0 8,4 3,0 8,-4" fill={gold} />
      <polygon points="22,-22 6,-3 3,-3 3,-6" fill={soft} />
      <polygon points="-22,-22 -3,-6 -3,-3 -6,-3" fill={soft} />
      <polygon points="22,22 3,6 3,3 6,3" fill={soft} />
      <polygon points="-22,22 -6,3 -3,3 -3,6" fill={soft} />
      <circle r="4.5" fill={gold} />
    </g>
  );
}

/** Fond décoratif des sections navy : grille de plan + cercles + boussole. */
export function HeroBlueprint({ className = "" }: { className?: string }) {
  const grid = Array.from({ length: 14 });
  return (
    <svg viewBox="0 0 560 560" fill="none" aria-hidden className={className}>
      <g stroke="#ffffff" strokeWidth="1" opacity="0.06">
        {grid.map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="560" y2={i * 40} />
        ))}
        {grid.map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="560" />
        ))}
      </g>
      <g stroke={GOLD} strokeWidth="1.2" opacity="0.45" fill="none">
        <circle cx="320" cy="250" r="200" />
        <circle cx="320" cy="250" r="145" />
        <circle cx="320" cy="250" r="90" />
      </g>
      <g stroke={GOLD} strokeWidth="1.4" opacity="0.55">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * Math.PI) / 12;
          const r2 = i % 6 === 0 ? 184 : 192;
          return (
            <line
              key={i}
              x1={320 + 200 * Math.cos(a)}
              y1={250 + 200 * Math.sin(a)}
              x2={320 + r2 * Math.cos(a)}
              y2={250 + r2 * Math.sin(a)}
            />
          );
        })}
      </g>
      <g transform="translate(320,250) scale(2.7)">
        <CompassStar />
      </g>
    </svg>
  );
}

/** Icône de métier (24×24, stroke = currentColor). */
export function MetierIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (slug) {
    case "etudes-conseil": // loupe sur document
      return (
        <svg {...common}>
          <rect x="3" y="3" width="11" height="15" rx="1" />
          <line x1="6" y1="7" x2="11" y2="7" />
          <line x1="6" y1="10" x2="11" y2="10" />
          <circle cx="15" cy="15" r="4" />
          <line x1="18" y1="18" x2="21" y2="21" />
        </svg>
      );
    case "ingenierie": // engrenage
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={12 + 5 * Math.cos(a)}
                y1={12 + 5 * Math.sin(a)}
                x2={12 + 8 * Math.cos(a)}
                y2={12 + 8 * Math.sin(a)}
              />
            );
          })}
        </svg>
      );
    case "amo-amoa": // bouclier + check
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "maitrise-doeuvre": // grue de chantier
      return (
        <svg {...common}>
          <line x1="6" y1="21" x2="6" y2="4" />
          <line x1="3" y1="21" x2="9" y2="21" />
          <line x1="6" y1="4" x2="20" y2="4" />
          <line x1="6" y1="7" x2="17" y2="4" />
          <line x1="16" y1="4" x2="16" y2="8" />
          <rect x="14.5" y="8" width="3" height="2.4" />
        </svg>
      );
    case "structuration-de-projets": // barres de croissance
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="21" y2="20" />
          <rect x="5.5" y="13" width="3" height="7" />
          <rect x="10.5" y="9" width="3" height="11" />
          <rect x="15.5" y="5" width="3" height="15" />
        </svg>
      );
    case "suivi-evaluation": // courbe + jalons
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <polyline points="4,16 9,11 13,13 20,5" />
          <circle cx="9" cy="11" r="1.2" fill="currentColor" />
          <circle cx="13" cy="13" r="1.2" fill="currentColor" />
          <circle cx="20" cy="5" r="1.2" fill="currentColor" />
        </svg>
      );
    case "formation": // chapeau de diplômé
      return (
        <svg {...common}>
          <path d="M2 8l10-4 10 4-10 4z" />
          <path d="M6 10v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V10" />
          <line x1="22" y1="8" x2="22" y2="13" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/** Catégorie d'une référence, déduite de son slug. */
export function refCategory(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("barrage") || s.includes("kikot")) return "energie";
  if (s.includes("olembe") || s.includes("stade") || s.includes("omnisport")) return "stade";
  if (s.includes("aeroport")) return "aeroport";
  if (s.includes("adduction") || s.includes("eau")) return "eau";
  if (s.includes("ecole") || s.includes("normale") || s.includes("campus") || s.includes("universit"))
    return "campus";
  if (s.includes("sonara") || s.includes("usine") || s.includes("industri")) return "industrie";
  if (s.includes("audit") || s.includes("bip")) return "audit";
  if (s.includes("reseau")) return "reseaux";
  return "batiment";
}

/** Illustration de référence (motif ligne, décoratif dans l'en-tête navy). */
export function RefIllustration({ category, className = "" }: { category: string; className?: string }) {
  const p = {
    viewBox: "0 0 100 100",
    fill: "none",
    stroke: GOLD,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (category) {
    case "aeroport":
      return (
        <svg {...p}>
          <path d="M35 78h40" />
          <rect x="44" y="40" width="12" height="38" rx="1" />
          <path d="M44 40l6-10 6 10" />
          <path d="M20 30l60 18" strokeDasharray="4 5" />
          <path d="M74 40l10 6-11 3 1-9z" fill={GOLD} stroke="none" />
        </svg>
      );
    case "stade":
      return (
        <svg {...p}>
          <ellipse cx="50" cy="55" rx="38" ry="24" />
          <ellipse cx="50" cy="55" rx="24" ry="13" />
          {[20, 40, 60, 80].map((x) => (
            <line key={x} x1={x} y1="34" x2={x} y2="76" opacity="0.5" />
          ))}
        </svg>
      );
    case "batiment":
      return (
        <svg {...p}>
          <rect x="34" y="20" width="32" height="60" />
          {[30, 40, 50, 60, 70].map((y) =>
            [40, 50, 60].map((x) => <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" />)
          )}
        </svg>
      );
    case "energie":
      return (
        <svg {...p}>
          <path d="M20 40c14 0 14 20 30 20s16-20 30-20" />
          <path d="M20 55c14 0 14 20 30 20s16-20 30-20" opacity="0.6" />
          <path d="M52 22l-10 16h9l-4 14 14-20h-9z" fill={GOLD} stroke="none" />
        </svg>
      );
    case "eau":
      return (
        <svg {...p}>
          <path d="M50 22c9 12 15 20 15 28a15 15 0 01-30 0c0-8 6-16 15-28z" />
          <path d="M20 74c8 0 8-6 16-6s8 6 16 6 8-6 16-6" opacity="0.6" />
        </svg>
      );
    case "campus":
      return (
        <svg {...p}>
          <path d="M20 40l30-12 30 12-30 12z" />
          <path d="M30 46v20M42 46v20M58 46v20M70 46v20" />
          <path d="M24 66h52" />
        </svg>
      );
    case "industrie":
      return (
        <svg {...p}>
          <path d="M24 78V50l16 10V50l16 10V44h16v34z" />
          <line x1="30" y1="34" x2="30" y2="50" />
          <path d="M27 30a4 4 0 016 0" />
        </svg>
      );
    case "audit":
      return (
        <svg {...p}>
          <rect x="28" y="22" width="34" height="46" rx="1" />
          <line x1="34" y1="32" x2="56" y2="32" />
          <line x1="34" y1="40" x2="50" y2="40" />
          <circle cx="60" cy="62" r="10" />
          <line x1="67" y1="69" x2="76" y2="78" />
          <path d="M56 62l3 3 5-6" />
        </svg>
      );
    case "reseaux":
      return (
        <svg {...p}>
          <path d="M30 30l40 12M30 30l14 42M70 42l-26 30M70 42l8 34" opacity="0.7" />
          {[
            [30, 30],
            [70, 42],
            [44, 72],
            [78, 76],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={i % 2 ? GOLD : "none"} />
          ))}
        </svg>
      );
    default:
      return (
        <svg {...p} viewBox="0 0 100 100">
          <g transform="translate(50,50) scale(1.1)">
            <CompassStar />
          </g>
        </svg>
      );
  }
}
