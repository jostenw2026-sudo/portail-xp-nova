import { NextResponse } from "next/server";
import { odooConfigured, odooCreate } from "@/lib/odoo";

// Formulaire du portail xp-nova.com → CRM Odoo (crm.lead), source-taggé.
// Secrets ODOO_* injectés par l'environnement (Coolify) ; jamais dans le dépôt.
// Non bloquant : Odoo indisponible/non configuré → demande tracée en log.

const SOURCE = "xp-nova.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({ ok: true }); // honeypot
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
    const recap = [
      val("interet") && `Intérêt : ${val("interet")}`,
      val("organisation") && `Organisation : ${val("organisation")}`,
      val("pays") && `Pays : ${val("pays")}`,
      val("telephone") && `Téléphone : ${val("telephone")}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (odooConfigured()) {
      try {
        const leadId = await odooCreate("crm.lead", {
          name: `[${SOURCE}] ${val("nom")}${val("interet") ? ` — ${val("interet")}` : ""}`,
          contact_name: val("nom"),
          email_from: val("email"),
          ...(val("telephone") ? { phone: val("telephone") } : {}),
          ...(val("organisation") ? { partner_name: val("organisation") } : {}),
          description: [recap, "", val("message")].filter((l) => l !== "").join("\n"),
        });
        console.log(`[contact portail] lead Odoo créé (id=${leadId})`);
      } catch (err) {
        console.warn(`[contact portail] Odoo indisponible (demande tracée) : ${(err as Error).message}`);
      }
    } else {
      console.warn("[contact portail] Odoo non configuré — demande en log :", {
        nom: val("nom"),
        email: val("email"),
        interet: val("interet"),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
