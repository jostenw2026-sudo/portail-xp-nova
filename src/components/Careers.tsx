import { PageHero, Breadcrumbs, CTABanner } from "@/components/blocks";
import { Section, SectionTitle, Callout } from "@/components/ui";
import CareersForm from "@/components/CareersForm";

// Page Carrières XP-NOVA — corps bilingue partagé par /carrieres et /en/carrieres.
// S'inspire de la page Carrières d'agrovita, adaptée au Bureau d'Ingénierie Conseil
// (études, ingénierie, AMO, maîtrise d'œuvre, structuration, suivi-évaluation).

type Lang = "fr" | "en";

const CONTENT = {
  fr: {
    crumb: "Carrières",
    hero: {
      eyebrow: "Carrières · XP-NOVA",
      title: "Il y a des ingénieurs qui regardent les projets passer. Ici, on les fait aboutir.",
      lead: "XP-NOVA constitue son équipe : rejoignez un Bureau d'Ingénierie Conseil qui met des décennies de pratique des grands projets au service d'une méthode simple — concevoir, structurer, piloter, sécuriser.",
    },
    stats: [
      ["6", "postes ouverts au noyau"],
      ["5", "profils d'associés recherchés"],
      ["6", "phases de méthode à maîtriser"],
      ["48 h", "premier retour à une candidature retenue"],
    ],
    whyEyebrow: "Pourquoi nous rejoindre",
    whyTitle: "Ce que XP-NOVA change dans une carrière d'ingénieur",
    whyIntro:
      "Nous ne promettons pas le confort d'une grande structure. Nous promettons mieux : des projets réels, une méthode exigeante et un rôle qui compte.",
    promesses: [
      ["Des missions entières, pas des fragments", "Du diagnostic à la sécurisation, vous suivez le projet sur les six phases de la méthode. Vos livrables deviennent des ouvrages construits et des financements obtenus — pas des rapports oubliés."],
      ["La responsabilité dès le premier jour", "Nous sommes un noyau restreint de profils polyvalents : chacun porte le jugement, la relation client et la qualité de ses livrables. Ce que vous produisez compte — et se voit."],
      ["L'IA comme démultiplicateur, pas comme menace", "XP-NOVA est un cabinet augmenté par l'IA : elle densifie études, modèles et rédaction ; vous restez le cerveau qui supervise, valide et signe. Une façon de travailler que peu de cabinets maîtrisent."],
      ["Une école d'ingénierie-conseil", "Méthode outillée, revues techniques, confrontation aux bailleurs et aux institutions : vous montez en compétences sur un métier complet — technique, financier et relationnel."],
      ["L'intégrité comme actif professionnel", "Le cabinet se positionne en tiers de confiance entre porteurs de projets, institutions et financeurs. Rigueur des données et indépendance de l'avis donnent de la valeur à votre signature."],
      ["Une aventure à co-construire", "20 ans d'existence, 37 ans de pratique du promoteur : les références sont là, mais la pratique se réinvente. Rejoindre XP-NOVA, c'est écrire la suite de ses standards et de sa réputation."],
    ],
    diversity:
      "XP-NOVA promeut la diversité : les candidatures des femmes et des jeunes diplômés sont vivement encouragées. Toutes sont examinées sans discrimination.",
    orgEyebrow: "Notre organisation",
    orgTitle: "Noyau · Réseau · Terrain · IA",
    orgIntro: "Quatre cercles complémentaires : où que vous entriez, votre rôle est clair.",
    dispositif: [
      ["T1", "Noyau permanent", "Un petit noyau de profils polyvalents porte le jugement, la relation client et la responsabilité des missions."],
      ["T2", "Réseau d'associés", "Les expertises rares et agréées — dont GEQUIPS, partenaire technique historique — sont mobilisées par mission, contractualisées par engagement écrit."],
      ["T3", "Équipes terrain", "Enquêteurs, techniciens et conducteurs de travaux recrutés localement, au plus près des chantiers."],
      ["T4", "Augmentation IA & plateforme", "L'IA densifie études, modèles et rédaction — un senior supervise chaque livrable. La plateforme fait travailler ensemble noyau, réseau et terrain sur les mêmes dossiers, même à distance."],
    ],
    postesEyebrow: "Postes & vivier",
    postesTitle: "Postes ouverts et profils recherchés",
    postesIntro: "Le noyau se constitue autour de ces profils. Vous ne vous reconnaissez pas exactement ? Candidatez tout de même : nous constituons aussi un vivier d'associés.",
    postesLabel: "Noyau — postes ouverts",
    postes: [
      "Ingénieur(e) génie civil / structures",
      "Ingénieur(e) électromécanique / énergie",
      "Ingénieur(e) génie rural / hydraulique",
      "Économiste-financier(e) de projets (augmenté par l'IA)",
      "Chef(fe) de projet / AMO",
      "Projeteur(se) CAO / BIM",
    ],
    vivierLabel: "Vivier d'associés experts",
    vivier: [
      "Juriste des marchés publics & des contrats",
      "Géomètre-topographe",
      "Expert environnement & social (PGES / EIES)",
      "Expert passation des marchés (procédures bailleurs)",
      "Spécialiste suivi-évaluation",
    ],
    formEyebrow: "Candidature",
    formTitle: "Postulez à XP-NOVA",
    formIntro: "Un seul formulaire, pour un poste ouvert comme pour une candidature spontanée. Partagez un lien vers votre CV.",
    roles: [
      "Ingénieur(e) génie civil / structures",
      "Ingénieur(e) électromécanique / énergie",
      "Ingénieur(e) génie rural / hydraulique",
      "Économiste-financier(e) de projets",
      "Chef(fe) de projet / AMO",
      "Projeteur(se) CAO / BIM",
      "Associé(e) expert (vivier)",
    ],
  },
  en: {
    crumb: "Careers",
    hero: {
      eyebrow: "Careers · XP-NOVA",
      title: "Some engineers watch projects go by. Here, we make them happen.",
      lead: "XP-NOVA is building its team: join an Engineering & Consulting Firm that puts decades of major-project practice at the service of a simple method — design, structure, steer, secure.",
    },
    stats: [
      ["6", "core positions open"],
      ["5", "associate profiles sought"],
      ["6", "method phases to master"],
      ["48 h", "first response to a shortlisted application"],
    ],
    whyEyebrow: "Why join us",
    whyTitle: "What XP-NOVA changes in an engineer's career",
    whyIntro:
      "We don't promise the comfort of a large structure. We promise better: real projects, a demanding method and a role that matters.",
    promesses: [
      ["Whole assignments, not fragments", "From diagnosis to securing, you follow the project across the six phases of the method. Your deliverables become built works and financing secured — not forgotten reports."],
      ["Responsibility from day one", "We are a small core of versatile profiles: each carries judgement, the client relationship and the quality of their deliverables. What you produce counts — and shows."],
      ["AI as a multiplier, not a threat", "XP-NOVA is an AI-augmented firm: it densifies studies, models and drafting; you remain the mind that supervises, validates and signs. A way of working few firms master."],
      ["A school of engineering & consulting", "Equipped method, technical reviews, engagement with donors and institutions: you grow across a complete craft — technical, financial and relational."],
      ["Integrity as a professional asset", "The firm stands as a trusted third party between project owners, institutions and financiers. Rigorous data and independent judgement give value to your signature."],
      ["An adventure to co-build", "20 years of existence, 37 years of the promoter's practice: the references are there, but the practice reinvents itself. Joining XP-NOVA means writing the next chapter of its standards and reputation."],
    ],
    diversity:
      "XP-NOVA promotes diversity: applications from women and young graduates are warmly encouraged. All are reviewed without discrimination.",
    orgEyebrow: "Our organisation",
    orgTitle: "Core · Network · Field · AI",
    orgIntro: "Four complementary circles: wherever you join, your role is clear.",
    dispositif: [
      ["T1", "Permanent core", "A small core of versatile profiles carries judgement, the client relationship and responsibility for assignments."],
      ["T2", "Associate network", "Rare, accredited expertise — including GEQUIPS, a long-standing technical partner — mobilised per assignment under written engagement."],
      ["T3", "Field teams", "Surveyors, technicians and works supervisors recruited locally, close to the sites."],
      ["T4", "AI augmentation & platform", "AI densifies studies, models and drafting — a senior supervises each deliverable. The platform lets core, network and field work on the same files, even remotely."],
    ],
    postesEyebrow: "Positions & talent pool",
    postesTitle: "Open positions and profiles sought",
    postesIntro: "The core is forming around these profiles. Not an exact match? Apply anyway: we are also building a pool of associates.",
    postesLabel: "Core — open positions",
    postes: [
      "Civil / structural engineer",
      "Electromechanical / energy engineer",
      "Rural engineering / hydraulics engineer",
      "Project economist-financier (AI-augmented)",
      "Project manager / owner's engineer (AMO)",
      "CAD / BIM draftsperson",
    ],
    vivierLabel: "Pool of associate experts",
    vivier: [
      "Public-procurement & contract lawyer",
      "Surveyor / topographer",
      "Environmental & social expert (ESMP / ESIA)",
      "Procurement expert (donor procedures)",
      "Monitoring & evaluation specialist",
    ],
    formEyebrow: "Application",
    formTitle: "Apply to XP-NOVA",
    formIntro: "One form, for an open position or a spontaneous application. Share a link to your CV.",
    roles: [
      "Civil / structural engineer",
      "Electromechanical / energy engineer",
      "Rural engineering / hydraulics engineer",
      "Project economist-financier",
      "Project manager / owner's engineer (AMO)",
      "CAD / BIM draftsperson",
      "Associate expert (pool)",
    ],
  },
} as const;

export default function Careers({ lang = "fr" }: { lang?: Lang }) {
  const c = CONTENT[lang];
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} lead={c.hero.lead} />
      <Breadcrumbs items={[{ label: c.crumb }]} lang={lang} />

      <div className="bg-light">
        <div className="container-x grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {c.stats.map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl font-extrabold text-gold">{num}</div>
              <div className="mt-1 text-sm text-grey">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <Section>
        <SectionTitle eyebrow={c.whyEyebrow} title={c.whyTitle} intro={c.whyIntro} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {c.promesses.map(([t, d]) => (
            <div key={t} className="rounded-lg border border-line bg-paper p-6">
              <div className="mb-3 h-1 w-8 rounded bg-gold" />
              <h3 className="title-3 text-navy">{t}</h3>
              <p className="mt-2 text-grey">{d}</p>
            </div>
          ))}
        </div>
        <Callout variant="gold">{c.diversity}</Callout>
      </Section>

      <Section tone="light">
        <SectionTitle eyebrow={c.orgEyebrow} title={c.orgTitle} intro={c.orgIntro} />
        <div className="grid gap-5 sm:grid-cols-2">
          {c.dispositif.map(([code, t, d]) => (
            <div key={code} className="rounded-lg border border-line bg-paper p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-sm font-bold text-white">{code}</span>
                <h3 className="title-3 text-navy">{t}</h3>
              </div>
              <p className="mt-2 text-grey">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="candidature">
        <SectionTitle eyebrow={c.postesEyebrow} title={c.postesTitle} intro={c.postesIntro} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="eyebrow mb-3">{c.postesLabel}</p>
            <ul className="space-y-2">
              {c.postes.map((p) => (
                <li key={p} className="flex gap-2 text-ink/90">
                  <span className="text-gold">▹</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-light p-6">
            <p className="eyebrow mb-3">{c.vivierLabel}</p>
            <ul className="space-y-2">
              {c.vivier.map((p) => (
                <li key={p} className="flex gap-2 text-ink/90">
                  <span className="text-gold">▹</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <SectionTitle eyebrow={c.formEyebrow} title={c.formTitle} intro={c.formIntro} />
          <CareersForm roles={[...c.roles]} lang={lang} />
        </div>
      </Section>

      <CTABanner lang={lang} />
    </>
  );
}
