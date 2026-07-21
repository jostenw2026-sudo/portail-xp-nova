// Illustrations vectorielles — style « épure technique / plan d'ingénierie ».
// Aucune dépendance externe, palette de marque. Décoratives (aria-hidden).

const NAVY = "#0D1F5C";
const GOLD = "#D4A017";
const GOLD_SOFT = "#E9C25A";

/** Boussole 8 branches reprise du logo (repère de marque). */
function CompassStar({ scale = 1, gold = GOLD, soft = GOLD_SOFT }: { scale?: number; gold?: string; soft?: string }) {
  return (
    <g transform={`scale(${scale})`}>
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
      <g stroke={GOLD} strokeWidth="1.2" opacity="0.5" fill="none">
        <circle cx="320" cy="250" r="200" />
        <circle cx="320" cy="250" r="145" />
        <circle cx="320" cy="250" r="90" />
      </g>
      <g stroke={GOLD} strokeWidth="0.8" opacity="0.35">
        <line x1="320" y1="20" x2="320" y2="480" />
        <line x1="90" y1="250" x2="550" y2="250" />
      </g>
      {/* graduations sur le cercle extérieur */}
      <g stroke={GOLD} strokeWidth="1.4" opacity="0.6">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * Math.PI) / 12;
          const r1 = 200,
            r2 = i % 6 === 0 ? 184 : 192;
          return (
            <line
              key={i}
              x1={320 + r1 * Math.cos(a)}
              y1={250 + r1 * Math.sin(a)}
              x2={320 + r2 * Math.cos(a)}
              y2={250 + r2 * Math.sin(a)}
            />
          );
        })}
      </g>
      <g transform="translate(320,250) scale(2.7)" opacity="0.95">
        <CompassStar />
      </g>
    </svg>
  );
}

/** Bandeau illustré AGROVITA — motif agricole (vert). */
export function MotifAgro({ className = "" }: { className?: string }) {
  const green = "#2E7D32";
  return (
    <svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="600" height="150" fill={green} opacity="0.08" />
      {/* soleil */}
      <g opacity="0.85">
        <circle cx="510" cy="42" r="20" fill={GOLD} opacity="0.18" />
        <circle cx="510" cy="42" r="20" fill="none" stroke={GOLD} strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={510 + 26 * Math.cos(a)}
              y1={42 + 26 * Math.sin(a)}
              x2={510 + 33 * Math.cos(a)}
              y2={42 + 33 * Math.sin(a)}
              stroke={GOLD}
              strokeWidth="2"
            />
          );
        })}
      </g>
      {/* sillons de champ */}
      <g stroke={green} fill="none" opacity="0.5">
        <path d="M-20,118 Q300,88 620,118" strokeWidth="2.5" />
        <path d="M-20,132 Q300,104 620,132" strokeWidth="2" />
        <path d="M-20,150 Q300,122 620,150" strokeWidth="2" />
      </g>
      {/* pousses */}
      <g stroke={green} strokeWidth="2.5" fill="none" opacity="0.9" strokeLinecap="round">
        {[90, 190, 290, 390].map((x, i) => (
          <g key={i} transform={`translate(${x},108)`}>
            <path d="M0,0 V-34" />
            <path d="M0,-20 Q-14,-24 -18,-38" />
            <path d="M0,-26 Q14,-30 18,-44" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Bandeau illustré ODT — motif territorial (turquoise). */
export function MotifTerritory({ className = "" }: { className?: string }) {
  const teal = "#0FA3B1";
  return (
    <svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="600" height="150" fill={teal} opacity="0.08" />
      {/* courbes de niveau (topographie) */}
      <g stroke={teal} fill="none" opacity="0.4">
        <path d="M-20,34 Q160,6 340,42 T640,30" strokeWidth="2" />
        <path d="M-20,58 Q160,30 340,66 T640,54" strokeWidth="1.5" />
        <path d="M-20,82 Q160,54 340,90 T640,78" strokeWidth="1.5" />
      </g>
      {/* silhouette bâtie */}
      <g fill={teal} opacity="0.22">
        <rect x="70" y="92" width="26" height="46" />
        <rect x="100" y="74" width="22" height="64" />
        <rect x="126" y="100" width="24" height="38" />
        <rect x="300" y="86" width="24" height="52" />
        <rect x="326" y="70" width="20" height="68" />
      </g>
      {/* réseau (noeuds + liens) */}
      <g opacity="0.75">
        <g stroke={teal} strokeWidth="1.5">
          <line x1="430" y1="60" x2="500" y2="40" />
          <line x1="500" y1="40" x2="560" y2="72" />
          <line x1="430" y1="60" x2="470" y2="108" />
          <line x1="470" y1="108" x2="560" y2="72" />
        </g>
        {[
          [430, 60],
          [500, 40],
          [560, 72],
          [470, 108],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill={i % 2 ? GOLD : teal} />
        ))}
      </g>
    </svg>
  );
}
