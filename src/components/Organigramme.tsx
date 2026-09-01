// Organigramme fonctionnel XP-NOVA — structure par fonctions (sans identités).
// Les profils et CV détaillés sont fournis sur demande. Bilingue (fr/en).

type Lang = "fr" | "en";

const C = {
  fr: {
    directionEyebrow: "Direction",
    direction: "Gérance & ingénierie principale",
    directionRole: "Gérant statutaire · Ingénieur principal",
    noyauEyebrow: "Noyau permanent",
    noyau: [
      ["Études & conseil", "Diagnostics, faisabilité, cadrage."],
      ["Ingénierie technique", "Lots technologiques : MEP, électricité, CVC, réseaux."],
      ["Maîtrise d'œuvre", "Conception et direction de l'exécution."],
      ["AMO / AMOa", "Assistance au maître d'ouvrage, passation."],
      ["Structuration & financement", "Montage bancable, PPP, bailleurs."],
      ["Suivi & évaluation", "Contrôle, jalons, redevabilité."],
    ] as [string, string][],
    reseauEyebrow: "Experts associés & réseau de partenaires",
    reseauIntro: "Capacités mobilisables par engagement écrit, en groupement comme en direct :",
    reseau: [
      "GEQUIPS — ingénierie technique (associé)",
      "Juristes & marchés publics",
      "Financiers PPP / finance climat",
      "Géomètres-topographes / SIG",
      "Spécialistes sauvegardes E&S (PGES)",
      "Experts sectoriels (santé, énergie, eau…)",
    ],
    note: "Organigramme fonctionnel. Les profils, CV détaillés (format bailleur) et engagements de mise à disposition sont transmis sur demande, aux partenaires et maîtres d'ouvrage qualifiés.",
  },
  en: {
    directionEyebrow: "Management",
    direction: "Management & principal engineering",
    directionRole: "Statutory manager · Principal engineer",
    noyauEyebrow: "Permanent core",
    noyau: [
      ["Studies & advisory", "Diagnostics, feasibility, scoping."],
      ["Technical engineering", "Technology packages: MEP, electrical, HVAC, networks."],
      ["Works supervision", "Design and direction of works execution."],
      ["Delegated project mgmt", "Owner's assistance, procurement."],
      ["Structuring & financing", "Bankable packaging, PPP, donors."],
      ["Monitoring & evaluation", "Control, milestones, accountability."],
    ] as [string, string][],
    reseauEyebrow: "Associate experts & partner network",
    reseauIntro: "Capacities mobilisable by written commitment, in consortium or directly:",
    reseau: [
      "GEQUIPS — technical engineering (associate)",
      "Lawyers & public procurement",
      "PPP / climate-finance specialists",
      "Surveyors / GIS specialists",
      "E&S safeguards specialists (ESMP)",
      "Sector experts (health, energy, water…)",
    ],
    note: "Functional org chart. Detailed profiles, donor-format CVs and availability commitments are shared on request, with qualified partners and contracting authorities.",
  },
} as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-gold">{children}</p>;
}

export default function Organigramme({ lang = "fr" }: { lang?: Lang }) {
  const c = C[lang];
  return (
    <div className="mx-auto max-w-5xl">
      {/* Direction */}
      <Eyebrow>{c.directionEyebrow}</Eyebrow>
      <div className="mx-auto max-w-md rounded-lg border border-line bg-navy p-6 text-center text-white">
        <p className="font-display text-lg font-bold text-gold">{c.direction}</p>
        <p className="mt-1 text-sm text-white/80">{c.directionRole}</p>
      </div>

      {/* Connecteur */}
      <div className="mx-auto h-8 w-px bg-line" aria-hidden />

      {/* Noyau permanent */}
      <Eyebrow>{c.noyauEyebrow}</Eyebrow>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.noyau.map(([t, d]) => (
          <div key={t} className="rounded-lg border border-line bg-paper p-5">
            <div className="mb-2 h-1 w-8 rounded bg-gold" />
            <h3 className="font-semibold text-navy">{t}</h3>
            <p className="mt-1 text-sm text-grey">{d}</p>
          </div>
        ))}
      </div>

      {/* Connecteur */}
      <div className="mx-auto mt-2 h-8 w-px bg-line" aria-hidden />

      {/* Réseau */}
      <div className="rounded-lg border border-line bg-light p-6">
        <Eyebrow>{c.reseauEyebrow}</Eyebrow>
        <p className="mb-4 text-center text-sm text-grey">{c.reseauIntro}</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {c.reseau.map((r) => (
            <li key={r} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-medium text-navy">
              {r}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-center text-xs text-grey">{c.note}</p>
    </div>
  );
}
