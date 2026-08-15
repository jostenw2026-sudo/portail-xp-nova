/**
 * Téléchargement contrôlé d'un document de la bibliothèque.
 * Vérifie la session ET que le dossier du document est autorisé pour le rôle.
 */
import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/portal/dal";
import { roleFolders } from "@/lib/portal/roles";
import { getDocumentBinary, getRoleFolderIds } from "@/lib/portal/odooData";
import { OdooNotConfiguredError } from "@/lib/portal/odoo";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getOptionalSession();
  if (!session?.sub) return new NextResponse("Non authentifié", { status: 401 });

  const { id } = await ctx.params;
  const docId = Number(id);
  if (!Number.isInteger(docId) || docId <= 0) return new NextResponse("Identifiant invalide", { status: 400 });

  try {
    const doc = await getDocumentBinary(docId);
    if (!doc) return new NextResponse("Introuvable", { status: 404 });

    // Contrôle d'accès : le document doit appartenir à un sous-dossier d'audience
    // autorisé pour le rôle (vérification par id, sous l'espace parent "Portail").
    const folderId = Array.isArray(doc.folder_id) ? doc.folder_id[0] : 0;
    const allowedIds = await getRoleFolderIds(roleFolders[session.role] ?? []);
    if (!folderId || !allowedIds.includes(folderId)) {
      return new NextResponse("Accès refusé", { status: 403 });
    }

    if (!doc.datas || typeof doc.datas !== "string") {
      return new NextResponse("Contenu indisponible", { status: 404 });
    }
    const buffer = Buffer.from(doc.datas, "base64");
    const filename = (doc.name || `document-${docId}`).replace(/["\r\n]/g, "");
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": (doc.mimetype as string) || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    if (e instanceof OdooNotConfiguredError) {
      return new NextResponse("Connexion Odoo non configurée", { status: 503 });
    }
    return new NextResponse("Erreur lors de la récupération du document", { status: 502 });
  }
}
