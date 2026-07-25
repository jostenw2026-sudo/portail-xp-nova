"use client";

import { useState } from "react";
import type { Ressource } from "@/content/ressources";
import RessourceRequestForm from "@/components/RessourceRequestForm";

// Carte d'une ressource. Trois cas :
//  - à paraître        -> badge "À paraître"
//  - public + fichier  -> téléchargement direct (+ version EN si dispo)
//  - sur-demande       -> bouton qui déplie le formulaire de demande (lead Odoo)

export default function RessourceItem({
  r,
  lang = "fr",
}: {
  r: Ressource & { typeLabel?: string };
  lang?: "fr" | "en";
}) {
  const en = lang === "en";
  const [open, setOpen] = useState(false);

  const T = {
    aParaitre: en ? "Coming soon" : "À paraître",
    download: en ? "Download" : "Télécharger",
    request: en ? "Request access" : "Demander l'accès",
    free: en ? "Free download" : "Téléchargement libre",
    onRequest: en ? "On request" : "Sur demande",
  };

  return (
    <div className="flex flex-col rounded-lg border border-line bg-paper p-6">
      <div className="flex items-center justify-between">
        <span className="rounded bg-light px-2.5 py-1 text-xs font-semibold text-navy">{r.typeLabel ?? r.type}</span>
        <span className={`text-xs font-semibold ${r.acces === "public" ? "text-royal" : "text-gold"}`}>
          {r.acces === "public" ? T.free : T.onRequest}
        </span>
      </div>
      <h3 className="title-3 mt-3 text-navy">{r.title}</h3>
      <p className="mt-2 flex-1 text-grey">{r.desc}</p>

      <div className="mt-4">
        {r.docStatus === "a-paraitre" ? (
          <span className="inline-block rounded-md border border-line px-4 py-2 text-sm text-grey">
            {T.aParaitre}
          </span>
        ) : r.acces === "public" && r.file ? (
          <div className="flex flex-wrap gap-2">
            <a
              href={`/ressources/${r.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              {T.download}
            </a>
            {r.fileEn && (
              <a
                href={`/ressources/${r.fileEn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md border border-line px-4 py-2 text-sm font-semibold text-navy"
              >
                EN
              </a>
            )}
          </div>
        ) : !open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-block rounded-md bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-navy"
          >
            {T.request}
          </button>
        ) : (
          <RessourceRequestForm document={r.title} lang={lang} />
        )}
      </div>
    </div>
  );
}
