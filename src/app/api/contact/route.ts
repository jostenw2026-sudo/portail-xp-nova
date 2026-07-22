import { NextResponse } from "next/server";
import { odooConfigured, odooCreate } from "@/lib/odoo";

// Réception du formulaire de contact ODT → CRM Odoo (crm.lead), source-taggé.
// Secrets ODOO_URL/ODOO_DB/ODOO_USER/ODOO_API_KEY injectés par l'environnement
// (Coolify) ; jamais dans le dépôt. Non bloquant : si Odoo est indisponible ou
// non configuré, la demande est tracée en log (le visiteur n'est jamais bloqué).

const SOURCE = "odt.xp-nova.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot anti-spam
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const required = ["nom", "organisation", "email", "pays", "message"];
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
      val("typeOrg") && `Type d'organisation : ${val("typeOrg")}`,
      val("objet") && `Objet : ${val("objet")}`,
      val("pays") && `Pays : ${val("pays")}`,
      val("budget") && `Budget estimatif : ${val("budget")}`,
      val("telephone") && `Téléphone : ${val("telephone")}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Injection CRM Odoo — non bloquante.
    if (odooConfigured()) {
      try {
        const leadId = await odooCreate("crm.lead", {
          name: `[${SOURCE}] ${val("nom")}${val("objet") ? ` — ${val("objet")}` : ""}`,
          contact_name: val("nom"),
          email_from: val("email"),
          ...(val("telephone") ? { phone: val("telephone") } : {}),
          ...(val("organisation") ? { partner_name: val("organisation") } : {}),
          description: [recap, "", val("message")].filter((l) => l !== "").join("\n"),
        });
        console.log(`[contact ODT] lead Odoo créé (id=${leadId})`);
      } catch (err) {
        console.warn(`[contact ODT] Odoo indisponible (demande tracée) : ${(err as Error).message}`);
      }
    } else {
      console.warn("[contact ODT] Odoo non configuré — demande en log :", {
        nom: val("nom"),
        email: val("email"),
        pays: val("pays"),
        objet: val("objet"),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
