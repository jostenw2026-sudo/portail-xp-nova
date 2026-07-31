import { NextResponse } from "next/server";
import { odooConfigured, odooCreate } from "@/lib/odoo";

// Réception d'une candidature (Carrières) → CRM Odoo (crm.lead), tag recrutement.
// Secrets Odoo injectés par l'environnement (Coolify). Non bloquant : si Odoo
// est indisponible, la candidature est tracée en log (le candidat n'est jamais bloqué).

const SOURCE = "xp-nova.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot anti-spam
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const required = ["nom", "email", "message"];
    for (const f of required) {
      if (!body[f] || String(body[f]).trim() === "") {
        return NextResponse.json({ error: `Champ manquant : ${f}` }, { status: 400 });
      }
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) {
      return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });
    }

    const val = (k: string) => (body[k] ? String(body[k]).trim() : "");
    const poste = val("poste") || "Candidature spontanée";
    const recap = [
      `Poste visé : ${poste}`,
      val("profil") && `Poste actuel / spécialité : ${val("profil")}`,
      val("telephone") && `Téléphone : ${val("telephone")}`,
      val("lien") && `CV / portfolio : ${val("lien")}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (odooConfigured()) {
      try {
        const leadId = await odooCreate("crm.lead", {
          name: `[${SOURCE}] Candidature — ${poste} — ${val("nom")}`,
          contact_name: val("nom"),
          email_from: val("email"),
          ...(val("telephone") ? { phone: val("telephone") } : {}),
          ...(val("profil") ? { partner_name: val("profil") } : {}),
          description: [recap, "", val("message")].filter((l) => l !== "").join("\n"),
        });
        console.log(`[candidature XP-NOVA] lead Odoo créé (id=${leadId})`);
      } catch (err) {
        console.warn(`[candidature XP-NOVA] Odoo indisponible (candidature tracée) : ${(err as Error).message}`);
      }
    } else {
      console.warn("[candidature XP-NOVA] Odoo non configuré — candidature en log :", {
        nom: val("nom"),
        email: val("email"),
        poste,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
