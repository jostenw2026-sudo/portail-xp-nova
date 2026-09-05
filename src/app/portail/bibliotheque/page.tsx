import { verifySession } from "@/lib/portal/dal";
import { roleFolders, roleLabels } from "@/lib/portal/roles";
import { getDocuments } from "@/lib/portal/odooData";
import { PortalChrome } from "@/components/portal/PortalUI";
import { Panel, Table, withData } from "@/components/portal/dataStates";
import { formatDate, m2oLabel } from "@/lib/portal/format";

export const dynamic = "force-dynamic";

function typeLabel(mimetype?: string | false): string {
  if (!mimetype) return "—";
  if (mimetype.includes("pdf")) return "PDF";
  if (mimetype.includes("word") || mimetype.includes("document")) return "Word";
  if (mimetype.includes("sheet") || mimetype.includes("excel")) return "Excel";
  if (mimetype.includes("image")) return "Image";
  return mimetype.split("/").pop() ?? "Fichier";
}

export default async function BibliothequePage() {
  const session = await verifySession();
  const folders = roleFolders[session.role];

  return (
    <>
      <PortalChrome session={session} />
      <div className="container-x py-10 md:py-14">
        <p className="eyebrow mb-3">{roleLabels[session.role]}</p>
        <h1 className="title-1 gold-rule text-navy">Bibliothèque</h1>
        <p className="mt-3 max-w-2xl text-lg text-grey">
          Documents, études, guides et ressources accessibles à votre profil.
        </p>

        <div className="mt-8 space-y-8">
          {/* Catalogues spéciaux */}
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/catalogue-prestations-odt-20260905.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-line bg-paper p-5 hover:border-gold transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded bg-gold/10 text-gold">
                📄
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy">Catalogue des prestations ODT</h3>
                <p className="text-sm text-grey">PDF • 5 septembre 2026</p>
              </div>
              <div className="text-gold">→</div>
            </a>

            <a
              href="/catalogue-agrovita-interactif.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-line bg-paper p-5 hover:border-gold transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded bg-gold/10 text-gold">
                🌿
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy">Catalogue AGROVITA interactif</h3>
                <p className="text-sm text-grey">HTML • Août 2026</p>
              </div>
              <div className="text-gold">→</div>
            </a>
          </div>

          <Panel title={`Documents disponibles (${folders.join(", ")})`}>
            {await withData(
              () => getDocuments(folders),
              (docs) => (
                <Table
                  head={["Document", "Espace", "Type", "Ajouté le", ""]}
                  rows={docs.map((d) => [
                    d.name,
                    m2oLabel(d.folder_id),
                    typeLabel(d.mimetype),
                    formatDate(d.create_date),
                    <a
                      key="dl"
                      href={`/api/portal/documents/${d.id}`}
                      className="font-semibold text-royal no-underline hover:text-navy"
                    >
                      Télécharger
                    </a>,
                  ])}
                />
              ),
            )}
          </Panel>
          <p className="mt-4 text-xs text-grey">
            Les documents « sur demande » et le dépôt de fichiers arriveront en Phase C.
          </p>
        </div>
      </div>
    </>
  );
}
