/**
 * POST /api/portal/terrain — enregistre une fiche prospect saisie sur le terrain.
 *
 * Trois gardes, dans cet ordre :
 *   1. session valide (JWT vérifié par le DAL, pas la simple présence du cookie) ;
 *   2. rôle autorisé — un client connecté ne saisit pas de prospects ;
 *   3. validation de la fiche, avec les MÊMES règles que le formulaire.
 *
 * Contrairement aux formulaires publics du site, l'écriture Odoo est ici
 * BLOQUANTE : l'agent doit savoir si sa fiche est partie. Une fiche qu'on croit
 * enregistrée et qui ne l'est pas est pire que pas de fiche du tout — le
 * formulaire la remet en file d'attente locale sur un échec, et c'est la réponse
 * de cette route qui le lui dit.
 */
import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/portal/dal";
import { rolesTerrain } from "@/lib/portal/roles";
import { validerFiche, LIMITES, type FicheTerrain } from "@/lib/portal/terrain";
import { creerPisteTerrain } from "@/lib/portal/terrainCrm";
import { odooConfigured } from "@/lib/odoo";

export const dynamic = "force-dynamic";

const texte = (v: unknown, max = LIMITES.texteCourt): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
};
const nombre = (v: unknown): number | null => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function POST(req: Request) {
  const session = await getOptionalSession();
  if (!session?.sub) {
    return NextResponse.json({ erreur: "Session expirée. Reconnectez-vous, votre saisie est conservée." }, { status: 401 });
  }
  if (!rolesTerrain().includes(session.role)) {
    return NextResponse.json({ erreur: "Votre profil ne permet pas la saisie de prospects." }, { status: 403 });
  }
  if (!odooConfigured()) {
    return NextResponse.json(
      { erreur: "La connexion au CRM n'est pas configurée sur ce serveur. Prévenez l'administrateur ; gardez la fiche en attente." },
      { status: 503 },
    );
  }

  let brut: Record<string, unknown>;
  try {
    brut = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ erreur: "Requête illisible." }, { status: 400 });
  }

  // On ne fait jamais confiance au corps reçu : chaque champ est repris un à un.
  const fiche: FicheTerrain = {
    nomContact: texte(brut.nomContact) ?? "",
    fonction: texte(brut.fonction),
    raisonSociale: texte(brut.raisonSociale),
    typeProspect: texte(brut.typeProspect),
    telephone: texte(brut.telephone, 40),
    email: texte(brut.email, 120),
    ville: texte(brut.ville, 80),
    region: texte(brut.region, 40),
    filiere: texte(brut.filiere, 8),
    niveauTransformation: texte(brut.niveauTransformation, 4),
    etapeCycle: nombre(brut.etapeCycle),
    blocage: texte(brut.blocage, 40),
    documents: Array.isArray(brut.documents) ? brut.documents.filter((d): d is string => typeof d === "string").slice(0, 20) : [],
    capex: nombre(brut.capex),
    opexAn1: nombre(brut.opexAn1),
    capacite: texte(brut.capacite, 40),
    echeance: texte(brut.echeance, 40),
    niveau: (["proximite", "reference", "bailleur"] as const).find((n) => n === brut.niveau),
    parcoursRetenu: texte(brut.parcoursRetenu, 10),
    objectif: texte(brut.objectif, 300),
    notes: texte(brut.notes, LIMITES.texteLong),
    consentement: brut.consentement === true,
    saisiLe: texte(brut.saisiLe, 40),
  };

  const erreurs = validerFiche(fiche);
  if (erreurs.length) return NextResponse.json({ erreur: erreurs[0], erreurs }, { status: 400 });

  try {
    const r = await creerPisteTerrain(fiche, { nom: session.name || session.email || session.sub, email: session.email });
    console.log(`[terrain] piste ${r.leadId} créée par ${session.email ?? session.sub} — ${r.parcours}`);
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    const message = (e as Error).message;
    console.error(`[terrain] échec de création : ${message}`);
    return NextResponse.json(
      { erreur: `Le CRM n'a pas accepté la fiche : ${message}. Elle reste en attente sur cet appareil.` },
      { status: 502 },
    );
  }
}
