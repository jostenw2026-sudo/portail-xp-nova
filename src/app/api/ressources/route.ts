import { NextResponse } from "next/server";
import { odooConfigured, odooCreate } from "@/lib/odoo";

// Demande d'un document "sur demande" -> CRM Odoo (crm.lead), source-taggé.
// Même logique non bloquante que /api/contact : si Odoo est indisponible ou non
// configuré, la demande est tracée en log (le visiteur n'est jamais bloqué).

const SOURCE = "xp-nova.com — ressources";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot anti-spam
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const required = ["nom", "email", "pays", "document"];
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
      `Document demandé : ${val("document")}`,
      val("organisation") && `Organisation : ${val("organisation")}`,
      val("pays") && `Pays : ${val("pays")}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Injection CRM Odoo — non bloquante.
    if (odooConfigured()) {
      try {
        const leadId = await odooCreate("crm.lead", {
          name: `[${SOURCE}] ${val("document")} — ${val("nom")}`,
          contact_name: val("nom"),
          email_from: val("email"),
          ...(val("organisation") ? { partner_name: val("organisation") } : {}),
          description: recap,
        });
        console.log(`[ressources] lead Odoo créé (id=${leadId})`);
      } catch (err) {
        console.warn(`[ressources] Odoo indisponible (demande tracée) : ${(err as Error).message}`);
      }
    } else {
      console.warn("[ressources] Odoo non configuré — demande en log :", {
        nom: val("nom"),
        email: val("email"),
        pays: val("pays"),
        document: val("document"),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
