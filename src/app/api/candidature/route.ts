import { NextResponse } from "next/server";
import { odooConfigured, odooCreate } from "@/lib/odoo";

// Réception d'une candidature (Carrières) en multipart/form-data → CRM Odoo.
// Le lead crm.lead est créé, puis les pièces jointes (CV, diplômes…) sont
// rattachées via ir.attachment. Non bloquant : si Odoo est indisponible, la
// candidature est tracée en log (le candidat n'est jamais bloqué).

export const runtime = "nodejs";

const SOURCE = "xp-nova.com";
const MAX_FILES = 6;
const MAX_FILE = 5 * 1024 * 1024; // 5 Mo par fichier
const MAX_TOTAL = 15 * 1024 * 1024; // 15 Mo au total
const ALLOWED = /\.(pdf|docx?|jpe?g|png)$/i;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const val = (k: string) => {
      const v = form.get(k);
      return typeof v === "string" ? v.trim() : "";
    };

    // Honeypot anti-spam
    if (val("website")) return NextResponse.json({ ok: true });

    for (const f of ["nom", "email", "message"]) {
      if (!val(f)) return NextResponse.json({ error: `Champ manquant : ${f}` }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val("email"))) {
      return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });
    }

    // Pièces jointes (CV, diplômes…)
    const files = form.getAll("documents").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Trop de fichiers (max ${MAX_FILES}).` }, { status: 400 });
    }
    let total = 0;
    for (const f of files) {
      if (!ALLOWED.test(f.name)) {
        return NextResponse.json({ error: `Format non autorisé : ${f.name}` }, { status: 400 });
      }
      if (f.size > MAX_FILE) {
        return NextResponse.json({ error: `Fichier trop volumineux (max 5 Mo) : ${f.name}` }, { status: 400 });
      }
      total += f.size;
    }
    if (total > MAX_TOTAL) {
      return NextResponse.json({ error: "Pièces jointes trop volumineuses (max 15 Mo au total)." }, { status: 400 });
    }

    const poste = val("poste") || "Candidature spontanée";
    const recap = [
      `Poste visé : ${poste}`,
      val("profil") && `Poste actuel / spécialité : ${val("profil")}`,
      val("telephone") && `Téléphone : ${val("telephone")}`,
      val("lien") && `CV / portfolio : ${val("lien")}`,
      files.length ? `Pièces jointes : ${files.map((f) => f.name).join(", ")}` : "",
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
        // Pièces jointes → ir.attachment liées au lead (best-effort, une par une).
        for (const f of files) {
          try {
            const b64 = Buffer.from(await f.arrayBuffer()).toString("base64");
            await odooCreate("ir.attachment", {
              name: f.name,
              datas: b64,
              res_model: "crm.lead",
              res_id: leadId,
              ...(f.type ? { mimetype: f.type } : {}),
            });
          } catch (err) {
            console.warn(`[candidature XP-NOVA] pièce jointe échouée (${f.name}) : ${(err as Error).message}`);
          }
        }
      } catch (err) {
        console.warn(`[candidature XP-NOVA] Odoo indisponible (candidature tracée) : ${(err as Error).message}`);
      }
    } else {
      console.warn("[candidature XP-NOVA] Odoo non configuré — candidature en log :", {
        nom: val("nom"),
        email: val("email"),
        poste,
        fichiers: files.map((f) => f.name),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
