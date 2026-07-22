// English mirror dictionary — donor/partner-facing tone.
// Same shapes as the FR content (Metier, Phase, Reference, Expert…) so the
// shared components render EN objects unchanged; only UI chrome is switched via `lang`.

import type { Metier } from "./metiers";
import type { Phase } from "./methode";
import type { Reference } from "./references";
import type { Expert } from "./experts";
import type { Engagement } from "./engagements";
import type { Ressource } from "./ressources";

export const siteEn = {
  baseline: "Engineering & Advisory Firm",
  devise: "Design. Structure. Deliver. Secure.",
  manifesto: "Projects rarely lack ambition. They lack engineering.",
  description:
    "XP-NOVA — Engineering & Advisory Firm: feasibility studies, engineering, owner's engineering (PMC), project management, structuring and monitoring & evaluation of public and private projects in Central Africa.",
  proofStats: [
    { value: "7", label: "engineering practices" },
    { value: "6", label: "method phases" },
    { value: "6", label: "countries of operation" },
    { value: "48 h", label: "first response" },
  ],
  ecosystem: [
    { key: "agrovita", name: "AGROVITA", tagline: "Agriculture & agri-business", url: "https://agrovita.xp-nova.com" },
    { key: "odt", name: "ODT", tagline: "Territorial Development Operator", url: "https://odt.xp-nova.com" },
  ],
} as const;

export const navEn = [
  { label: "The Firm", href: "/en/cabinet" },
  { label: "Our Practices", href: "/en/metiers" },
  { label: "Our Method", href: "/en/methode" },
  { label: "References", href: "/en/references" },
  { label: "Team", href: "/en/equipe" },
  { label: "Resources", href: "/en/ressources" },
] as const;

export const ctaEn = {
  primary: { label: "Let's discuss your project", href: "/en/contact" },
  secondary: { label: "Explore our practices", href: "/en/metiers" },
} as const;

// UI chrome strings (labels baked into shared components).
export const uiEn = {
  home: "Home",
  discover: "Discover →",
  seeReference: "View reference →",
  contractingAuthority: "Contracting authority:",
  beneficiary: "Beneficiary:",
  languages: "Languages",
  countries: "Countries",
  ecosystemTag: "XP-NOVA ecosystem · dedicated site",
  visit: "Visit",
  ctaTitle: "Let's discuss your project",
  ctaLead: (h: string) => `Tell us what you need — an expert replies within ${h}.`,
  formReceivedTitle: "Request received",
  formReceived: "Thank you. An expert will reply within 48 business hours at the address you provided.",
  activities: "Activities",
  deliverables: "Deliverables",
} as const;

export const metiersEn: Metier[] = [
  {
    slug: "etudes-conseil",
    title: "Studies & Advisory",
    short: "Reliable studies to decide, arbitrate and finance.",
    h1: "Studies & Advisory",
    seoTitle: "Feasibility studies and advisory — XP-NOVA Cameroon",
    metaDescription:
      "Feasibility, diagnostics, technical audits, expert appraisals and surveys: reliable studies to decide and finance your projects.",
    keyword: "feasibility study Cameroon",
    intro:
      "A poorly studied project costs more to fix than to design. Our studies turn an intuition into a documented decision that stands up to financiers and authorities alike.",
    enjeu: [
      "Secure the decision to invest before funds are committed.",
      "Objectively assess technical, economic and institutional feasibility.",
      "Produce a file that banks and development partners can accept.",
    ],
    prestations: [
      { title: "Feasibility studies", desc: "Technical, economic, financial and institutional." },
      { title: "Technical diagnostics", desc: "Situation review, appraisal and costed recommendations." },
      { title: "Technical audits", desc: "Verification of compliance, performance and costs." },
      { title: "Appraisals & surveys", desc: "Field data collection, needs analysis." },
    ],
    livrables: ["Feasibility report", "Diagnostic study", "Technical audit report", "Needs analysis note"],
    application:
      "This expertise applies to agricultural value chains (AGROVITA) and to territorial programmes (ODT) alike.",
  },
  {
    slug: "ingenierie",
    title: "Engineering",
    short: "Design and size, from preliminary design to BIM.",
    h1: "Engineering",
    seoTitle: "Technical engineering — preliminary design, detailed design, tender, BIM — XP-NOVA",
    metaDescription:
      "Preliminary and detailed design, tender documents, sizing, modelling and BIM coordination for buildings, equipment and infrastructure.",
    keyword: "technical engineering Cameroon",
    intro:
      "Engineering turns a brief into a buildable solution: sized, costed and coordinated across every trade.",
    enjeu: [
      "Move from a stated need to an executable design.",
      "Control technical interfaces and costs from the design stage.",
      "Firm up quantities and schedules through modelling.",
    ],
    prestations: [
      { title: "Preliminary & detailed design", desc: "Concept design through detailed design." },
      { title: "Tender documents", desc: "Technical documents for procurement." },
      { title: "Sizing & modelling", desc: "Calculations, technical notes, construction drawings." },
      { title: "BIM coordination", desc: "Digital model, interface clash detection, synthesis." },
    ],
    livrables: ["Concept design package", "Detailed design package", "Tender documents", "BIM model & calculation notes"],
    application:
      "XP-NOVA engineering serves agri-industrial units (AGROVITA) as well as territorial infrastructure (ODT).",
  },
  {
    slug: "amo-amoa",
    title: "Owner's Engineering (PMC)",
    short: "Represent and safeguard the project owner.",
    h1: "Owner's Engineering & Project Management Consultancy",
    seoTitle: "Owner's engineering / PMC in Cameroon and Africa — XP-NOVA",
    metaDescription:
      "Owner's engineering: steering, procurement, quality control and de-risking of complex projects.",
    keyword: "owner's engineering Africa",
    intro:
      "The project owner carries the risk but seldom the day-to-day technical expertise. Owner's engineering bridges that gap: we represent your interests at every decision.",
    enjeu: [
      "Defend the owner's interests against the other stakeholders.",
      "Secure procurement and contract execution.",
      "Hold cost, schedule and quality.",
    ],
    prestations: [
      { title: "Owner's engineering", desc: "From programming through handover." },
      { title: "Project management consultancy", desc: "Delegated owner support and program management." },
      { title: "Procurement", desc: "Drafting, bid analysis, regulatory compliance." },
      { title: "Quality control", desc: "Monitoring of contractor requirements and deliverables." },
    ],
    livrables: ["Programming report", "Bid analysis report", "Steering dashboards", "Handover minutes"],
    application:
      "Our owner's-engineering assignments cover structuring agricultural projects (AGROVITA) and public territorial facilities (ODT).",
  },
  {
    slug: "maitrise-doeuvre",
    title: "Project Management (Design & Supervision)",
    short: "Design, supervise and hand over the works.",
    h1: "Project Management — Design & Supervision",
    seoTitle: "Project management — works supervision — XP-NOVA",
    metaDescription:
      "Design, supervision, works control and handover: rigorous, documented project management.",
    keyword: "works supervision Cameroon",
    intro:
      "Project management ensures the delivered works match the designed works — in quality, cost and schedule.",
    enjeu: [
      "Translate the design into compliant construction.",
      "Control execution and prevent drift.",
      "Secure handover and the clearing of reservations.",
    ],
    prestations: [
      { title: "Design", desc: "Project-management studies through to the construction package." },
      { title: "Works supervision", desc: "Execution direction, approvals, site meetings." },
      { title: "Works control", desc: "Compliance and quality verification." },
      { title: "Handover of works", desc: "Preliminary operations, reservations, final acceptance." },
    ],
    livrables: ["Approved construction package", "Site reports", "Control reports", "Acceptance minutes"],
  },
  {
    slug: "structuration-de-projets",
    title: "Project Structuring",
    short: "Make a project financeable and bankable.",
    h1: "Project Structuring",
    seoTitle: "Project structuring and financing — XP-NOVA",
    metaDescription:
      "Business plans, economic models, financial engineering, PPPs and mobilisation of financing for bankable projects.",
    keyword: "project structuring Africa",
    intro:
      "A sound technical project is not always a financeable one. Structuring turns it into an asset: the arrangement, economic model and financing come together around clear governance.",
    enjeu: [
      "Turn a project into a bankable file.",
      "Build a robust financial and legal arrangement.",
      "Mobilise the right financing from the right partners.",
    ],
    prestations: [
      { title: "Business plans", desc: "Economic models and projections in FCFA, with explicit assumptions." },
      { title: "Financial engineering", desc: "Financing plans, debt and equity structuring." },
      { title: "Public-private partnerships", desc: "Arrangement, risk allocation, contracting." },
      { title: "Mobilising financing", desc: "Files for banks, development partners and dedicated funds." },
    ],
    livrables: ["Full business plan", "Financing plan", "PPP structuring note", "Financing application file"],
    application:
      "Structuring applies to agricultural investment projects (AGROVITA) and to donor-financed territorial programmes (ODT).",
  },
  {
    slug: "suivi-evaluation",
    title: "Monitoring & Evaluation",
    short: "Measure, prove and steer by results.",
    h1: "Monitoring & Evaluation",
    seoTitle: "Monitoring, evaluation and impact measurement — XP-NOVA",
    metaDescription:
      "Logical frameworks, indicators, results-based management and impact measurement aligned with development-partner requirements.",
    keyword: "project monitoring and evaluation",
    intro:
      "What is not measured cannot be steered. Monitoring & evaluation equips decisions and demonstrates impact to financiers, to international standards.",
    enjeu: [
      "Steer the project through reliable indicators.",
      "Demonstrate results and impact to development partners.",
      "Capture lessons for the projects that follow.",
    ],
    prestations: [
      { title: "Logical frameworks", desc: "Results chain, assumptions and indicators." },
      { title: "Results-based management", desc: "Performance-monitoring arrangements." },
      { title: "Indicators & KPIs", desc: "Definition, collection and dashboards." },
      { title: "Impact measurement", desc: "Mid-term and final evaluations." },
    ],
    livrables: ["Logical framework", "M&E plan", "Indicator dashboards", "Impact evaluation report"],
    application:
      "Our M&E systems support agricultural projects (AGROVITA) and territorial development programmes (ODT).",
  },
  {
    slug: "formation",
    title: "Training & Capacity Building",
    short: "Transfer skills to make results last.",
    h1: "Training & Capacity Building",
    seoTitle: "Training and capacity building — XP-NOVA",
    metaDescription:
      "Skills transfer, training of project teams and institutional strengthening to make your investments last.",
    keyword: "capacity building",
    intro:
      "A facility with no team trained to run it is a half-realised investment. We transfer the skills that make your teams autonomous.",
    enjeu: [
      "Sustain the investment through team autonomy.",
      "Strengthen technical and management capacity.",
      "Anchor the methods within the organisation.",
    ],
    prestations: [
      { title: "Technical training", desc: "On the project's trades, tools and procedures." },
      { title: "Institutional strengthening", desc: "Organisation, procedures, governance." },
      { title: "Skills transfer", desc: "Support for operational handover." },
      { title: "Workshops & seminars", desc: "Tailored sessions for teams and decision-makers." },
    ],
    livrables: ["Training plan", "Materials and modules", "Procedure manuals", "Learning-outcomes report"],
  },
];

export const getMetierEn = (slug: string) => metiersEn.find((m) => m.slug === slug);

export const phasesEn: Phase[] = [
  {
    n: 1,
    key: "comprendre",
    title: "Understand",
    baseline: "Diagnostic & analysis",
    objectif: "Establish a shared, objective reading of the starting situation.",
    activites: ["Diagnostic", "Situation review", "Data collection", "Needs analysis"],
    livrables: ["Diagnostic report", "Needs analysis note"],
  },
  {
    n: 2,
    key: "concevoir",
    title: "Design",
    baseline: "Scenarios & sizing",
    objectif: "Translate the need into sized, comparable solutions.",
    activites: ["Scenarios", "Studies", "Sizing", "Modelling"],
    livrables: ["Preliminary / detailed design", "Compared-scenarios note"],
  },
  {
    n: 3,
    key: "structurer",
    title: "Structure",
    baseline: "Governance & financing",
    objectif: "Make the project governable and financeable.",
    activites: ["Governance", "Financing", "Organisation", "Legal arrangement"],
    livrables: ["Business plan", "Financing plan", "Governance scheme"],
  },
  {
    n: 4,
    key: "realiser",
    title: "Deliver",
    baseline: "Steering & coordination",
    objectif: "Execute in line with the design, under control.",
    activites: ["Owner's engineering", "Steering", "Control", "Coordination"],
    livrables: ["Steering dashboards", "Control reports", "Acceptance minutes"],
  },
  {
    n: 5,
    key: "perenniser",
    title: "Sustain",
    baseline: "Training & maintenance",
    objectif: "Anchor the autonomy and durability of results.",
    activites: ["Training", "Maintenance", "Monitoring", "Capitalisation"],
    livrables: ["Training plan", "Procedure manuals", "Maintenance plan"],
  },
  {
    n: 6,
    key: "mesurer",
    title: "Measure impact",
    baseline: "Indicators & results",
    objectif: "Demonstrate results and draw the lessons.",
    activites: ["Indicators", "Performance", "Results", "Lessons"],
    livrables: ["Logical framework", "Impact evaluation report"],
  },
];

const CADRE_GEQUIPS_EN =
  "Assignment led by XP-NOVA's founding expert within GEQUIPS SARL — an associate company of XP-NOVA (10% of capital) and technical partner bound by a support agreement.";
const CADRE_DGTC_EN =
  "Assignment led by XP-NOVA's founder in the course of his public duties at the Directorate-General for Major Works of Cameroon (DGTC) — the promoter's professional track record, predating the company's incorporation (2006).";

export const referencesEn: Reference[] = [
  {
    slug: "barrage-kikot-mbebe-lots-technologiques",
    title: "Ancillary works of the Kikot-Mbebe hydroelectric dam — technical packages",
    client: "EGIS-Cameroon",
    pays: "Cameroon",
    annees: "2024–2025",
    metiers: ["etudes-conseil", "ingenierie"],
    typeMission: "Studies & BIM coordination",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Architectural and engineering studies for the ancillary works of a large hydroelectric dam: powerhouse envelope, operations offices and a 75-unit housing estate.",
    mission:
      "Studies lead and BIM coordinator for the technical packages: high- and low-current electricity, plumbing and fire protection, HVAC and smoke extraction, renewable energy, water supply, sanitation, sports and catering equipment.",
    resultats:
      "Coordinated design of the technical packages in a digital model across the project's three components.",
    featured: true,
  },
  {
    slug: "complexe-olympique-olembe",
    title: "Olembé Olympic and Sports Complex",
    client: "EGIS-Cameroon",
    pays: "Cameroon",
    annees: "2018",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Construction design — approval of technical packages",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Olympic complex comprising a 60,000-seat covered stadium, training pitches, a gymnasium, an Olympic pool, a 5-star hotel and the associated utilities.",
    mission:
      "Verification and approval of the construction studies (EXE-VISA) for the technical packages across the whole complex.",
    resultats: "Technical packages approved for the construction of an internationally significant sports venue.",
    featured: true,
  },
  {
    slug: "stade-omnisport-yaounde",
    title: "Rehabilitation of the Yaoundé Multi-sports Stadium",
    client: "EGIS-Cameroon",
    pays: "Cameroon",
    annees: "2015–2016",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Diagnostic, preliminary & detailed design, tender, works control",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Complete rehabilitation of a 30,000-seat stadium brought up to CAF/FIFA standards ahead of a continental competition.",
    mission: "Diagnostic, preliminary and detailed design, tender documents and execution control of all technical packages.",
    resultats: "Stadium brought up to international standards within the competition schedule.",
    featured: true,
  },
  {
    slug: "aeroport-ouagadougou-donsin",
    title: "New Ouagadougou-Donsin airport",
    client: "EGIS International France",
    clientFinal: "State of Burkina Faso",
    pays: "Burkina Faso",
    annees: "2012–2013",
    metiers: ["ingenierie"],
    typeMission: "Design project management (detailed design / tender)",
    cadre: CADRE_GEQUIPS_EN,
    contexte: "Construction of a new international airport: a set of 80 buildings totalling 120,000 m².",
    mission: "Design project management, detailed-design and tender phases of the technical packages.",
    resultats: "Design files delivered for an international airport.",
    featured: true,
  },
  {
    slug: "aeroport-malabo",
    title: "New terminal, Malabo airport",
    client: "SCET-Cameroon (now EGIS-Cameroon)",
    clientFinal: "Equatorial Guinea",
    pays: "Equatorial Guinea",
    annees: "1999–2005",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Project management of technical packages (design to works control)",
    cadre: CADRE_GEQUIPS_EN,
    contexte: "Construction of the new terminal of Malabo international airport, built by Bouygues.",
    mission: "Project management of the technical packages, from preliminary design through to works control.",
    resultats: "International terminal delivered with a leading construction group.",
  },
  {
    slug: "aeroport-nsimalen-cdou",
    title: "Emergency Operations Control Centre — Yaoundé-Nsimalen airport",
    client: "EGIS-Cameroon",
    pays: "Cameroon",
    annees: "2016",
    metiers: ["ingenierie"],
    typeMission: "Technical-package studies (design phases)",
    cadre: CADRE_GEQUIPS_EN,
    contexte: "Construction of an Emergency Operations Control Centre (basement + ground + 3 floors, 1,800 m²) at Yaoundé-Nsimalen international airport.",
    mission: "Studies of the technical packages, design phases.",
    resultats: "Technical files delivered for a strategic airport facility.",
  },
  {
    slug: "immeuble-assemblee-nationale",
    title: "Headquarters of the National Assembly of Cameroon",
    client: "BET CERG",
    pays: "Cameroon",
    annees: "2013",
    metiers: ["ingenierie"],
    typeMission: "Design project management",
    cadre: CADRE_GEQUIPS_EN,
    contexte: "Construction of the headquarters building of the National Assembly.",
    mission: "Design project management of the technical packages.",
    resultats: "Design of the technical packages of a major institutional building.",
  },
  {
    slug: "ecole-normale-superieure-maroua",
    title: "Maroua Teacher-Training College campus",
    client: "EGIS-Cameroon",
    pays: "Cameroon",
    annees: "2008–2012",
    metiers: ["maitrise-doeuvre", "amo-amoa"],
    typeMission: "Full project management (design to handover)",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Construction of a complete campus: administration building, lecture theatres, refectories, library, halls of residence, sports complex, power plants, sanitation and water supply.",
    mission: "Full project management, from preliminary design through to handover.",
    resultats: "University campus delivered, from design to acceptance.",
    featured: true,
  },
  {
    slug: "bureau-banque-mondiale-cameroun",
    title: "World Bank office building in Cameroon",
    client: "EGIS-Cameroon",
    clientFinal: "World Bank",
    pays: "Cameroon",
    annees: "2010–2012",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Project management of technical packages + control",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Construction of the building to house the World Bank's services, to the donor's standards.",
    mission:
      "Design project management of the technical packages to World Bank standards, and execution control of the works.",
    resultats: "Building delivered to the standards of a leading international development partner.",
    featured: true,
  },
  {
    slug: "expertise-sonara-limbe",
    title: "Technical appraisal — extension of the SONARA refinery",
    client: "Secretariat-General, Prime Minister's Office, Cameroon",
    clientFinal: "National Refining Company (SONARA)",
    pays: "Cameroon",
    annees: "2012",
    metiers: ["etudes-conseil"],
    typeMission: "Appraisal & technical audit (EPCC)",
    cadre: CADRE_GEQUIPS_EN,
    contexte: "Extension and rehabilitation works of the SONARA refinery in Limbe.",
    mission:
      "Quantitative and qualitative verification of the Engineering, Procurement, Construction and Commissioning (EPCC) services.",
    resultats: "Appraisal report delivered to the institutional client.",
  },
  {
    slug: "audit-bip-gabon",
    title: "Appraisal-audit of the Public Investment Budget — Gabon",
    client: "C2A audit firm, France",
    clientFinal: "State of Gabon",
    pays: "Gabon",
    annees: "2005",
    metiers: ["etudes-conseil", "suivi-evaluation"],
    typeMission: "Technical & financial appraisal-audit",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Appraisal and technical audit of public-facility projects (health, education, electrification, water supply) financed across four provinces.",
    mission: "Technical and financial audit of the delivered projects, in support of an international audit firm.",
    resultats: "Audit reports delivered, contributing to public accountability.",
  },
  {
    slug: "reseaux-urbains-mongomeyen",
    title: "Urban networks of the city of Mongomeyen",
    client: "EGIS International Malabo",
    pays: "Equatorial Guinea",
    annees: "2013",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Project management + works control",
    cadre: CADRE_GEQUIPS_EN,
    contexte:
      "Power supply from a thermal plant, water-supply network, wastewater and sewage networks.",
    mission: "Design project management of the technical packages and execution control of the works.",
    resultats: "Urban networks designed and supervised through to execution.",
  },
  {
    slug: "adduction-eau-yaounde",
    title: "Water supply for the city of Yaoundé",
    client: "Directorate-General for Major Works of Cameroon (DGTC)",
    pays: "Cameroon",
    annees: "1989–1993",
    metiers: ["ingenierie", "maitrise-doeuvre"],
    typeMission: "Execution control",
    cadre: CADRE_DGTC_EN,
    contexte:
      "Water-intake station on the Nyong at Mbalmayo, the Mbalmayo–Yaoundé trunk main and water towers.",
    mission: "Project engineer in charge of execution control.",
    resultats: "Structuring drinking-water infrastructure for the capital.",
  },
  {
    slug: "immeuble-ministeriel-2-igh",
    title: "Ministerial Building No. 2 (high-rise) — rehabilitation and completion",
    client: "Directorate-General for Major Works of Cameroon (DGTC)",
    pays: "Cameroon",
    annees: "1992–1994",
    metiers: ["maitrise-doeuvre"],
    typeMission: "Execution control",
    cadre: CADRE_DGTC_EN,
    contexte: "Rehabilitation and completion of a 20,000 m² high-rise building housing three ministries.",
    mission: "Execution control of the technical packages built by Dragados.",
    resultats: "High-rise building delivered for the central administration.",
  },
];

export const getReferenceEn = (slug: string) => referencesEn.find((r) => r.slug === slug);
export const featuredReferencesEn = referencesEn.filter((r) => r.featured);
export const referencePaysEn = [...new Set(referencesEn.map((r) => r.pays))].sort();

export const expertsEn: Expert[] = [
  {
    slug: "josten-magloire-wandji",
    name: "Josten Magloire WANDJI",
    role: "Statutory Manager · Engineer, expert in engineering and project management",
    category: "Direction",
    bio:
      "An electromechanical engineer (ENSP Yaoundé) with over 37 years of experience leading major public-facility projects — from design through to handover. He has led technology packages on airports, stadiums, universities, hospitals and networks across Central Africa and Burkina Faso, as the reference technical figure of GEQUIPS and, today, as head of XP-NOVA.",
    expertises: [
      "Engineering and project management",
      "Project management of technology packages",
      "Owner's engineering",
      "Technical and financial audit of projects",
      "BIM coordination",
      "MEP, HV/LV electricity, renewable energy",
    ],
    langues: ["French", "English"],
    pays: ["Cameroon", "Burkina Faso", "Gabon", "Equatorial Guinea", "CAR", "Congo"],
    projets: [
      "Kikot-Mbebe dam (BIM coordination, 2024-2025)",
      "Olembé Olympic complex",
      "Ouagadougou-Donsin airport",
      "World Bank building, Cameroon",
    ],
    ordre: "ONIGE — Registration No. A001703",
    featured: true,
  },
];

export const expertsByCategoryEn = () => {
  const cats = ["Direction", "Experts permanents", "Experts associés", "Réseau de partenaires"] as const;
  const labels: Record<string, string> = {
    Direction: "Leadership",
    "Experts permanents": "Permanent experts",
    "Experts associés": "Associate experts",
    "Réseau de partenaires": "Partner network",
  };
  return cats
    .map((cat) => ({ category: cat, label: labels[cat], items: expertsEn.filter((e) => e.category === cat) }))
    .filter((g) => g.items.length > 0);
};

export const getExpertEn = (slug: string) => expertsEn.find((e) => e.slug === slug);

export const engagementsEn: Engagement[] = [
  {
    key: "esg",
    title: "ESG Policy",
    pitch: "Environment, social and governance built into every assignment, not bolted on afterwards.",
    points: [
      "Environment: reduced impacts, waste management, energy-efficient solutions.",
      "Social: inclusion, local employment, people's safety.",
      "Governance: transparency, compliance, accountability.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "genre-inclusion",
    title: "Gender & Inclusion",
    pitch: "Equal access and participation as conditions of project quality.",
    points: [
      "Equal access and participation of women.",
      "Inclusion of youth and vulnerable groups.",
      "Fair recruitment and access to responsibilities.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "anti-corruption",
    title: "Anti-corruption",
    pitch: "Zero tolerance: corruption, fraud, conflicts of interest and hidden commissions.",
    points: [
      "Declaration of interests and conflict prevention.",
      "Whistleblowing mechanism.",
      "Disciplinary procedure.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "qualite",
    title: "Quality",
    pitch: "A controlled project process, from diagnostic to capitalisation — heading for ISO 9001.",
    points: [
      "Process: diagnostic, design, validation, delivery, control, capitalisation.",
      "Verifiable deliverables at each phase.",
      "Certification path: quality manual, then ISO 9001.",
    ],
    docStatus: "a-paraitre",
  },
  {
    key: "hse",
    title: "Health, Safety, Environment",
    pitch: "Zero serious accidents: prevention and continuous improvement.",
    points: ["Zero-serious-accident objective.", "Culture of prevention.", "Continuous improvement."],
    docStatus: "a-paraitre",
  },
];

export const ressourcesEn: (Ressource & { typeLabel: string })[] = [
  {
    key: "capability-statement",
    title: "Capability Statement",
    type: "Profil",
    typeLabel: "Profile",
    desc: "A concise 2–4 page overview: practices, references, strengths. For first contacts and pre-qualifications.",
    acces: "public",
    docStatus: "a-paraitre",
  },
  {
    key: "company-profile",
    title: "Company Profile",
    type: "Profil",
    typeLabel: "Profile",
    desc: "Full institutional presentation: vision, history, practices, method, team, references, governance.",
    acces: "public",
    docStatus: "a-paraitre",
  },
  {
    key: "referentiel-methodologique",
    title: "Methodological framework",
    type: "Publication",
    typeLabel: "Publication",
    desc: "The XP-NOVA method in 6 phases, detailed with its deliverables.",
    acces: "public",
    docStatus: "a-paraitre",
  },
  {
    key: "cv-experts",
    title: "Expert CVs (donor format)",
    type: "Profil",
    typeLabel: "Profile",
    desc: "Standardised CVs compliant with development-partner requirements, shared on justified request.",
    acces: "sur-demande",
    docStatus: "a-paraitre",
  },
  {
    key: "dossier-administratif",
    title: "Administrative file (trade register, tax ID, certificates)",
    type: "Publication",
    typeLabel: "Publication",
    desc: "Administrative and compliance documents, shared on request within a procurement procedure.",
    acces: "sur-demande",
    docStatus: "a-paraitre",
  },
];
