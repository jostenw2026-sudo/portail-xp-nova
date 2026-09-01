"use client";

import { useState } from "react";
import type { Ressource } from "@/content/ressources";
import RessourceRequestForm from "@/components/RessourceRequestForm";

// Carte d'une ressource — accès contrôlé.
//  - à paraître  -> badge "À paraître"
//  - produit     -> bouton qui déplie le formulaire d'inscription (lead Odoo, validation manuelle)

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
    request: en ? "Register to receive" : "S'inscrire pour recevoir",
    onRequest: en ? "On request" : "Sur demande",
  };

  return (
    <div className="flex flex-col rounded-lg border border-line bg-paper p-6">
      <div className="flex items-center justify-between">
        <span className="rounded bg-light px-2.5 py-1 text-xs font-semibold text-navy">{r.typeLabel ?? r.type}</span>
        <span className="text-xs font-semibold text-gold">{T.onRequest}</span>
      </div>
      <h3 className="title-3 mt-3 text-navy">{r.title}</h3>
      <p className="mt-2 flex-1 text-grey">{r.desc}</p>

      <div className="mt-4">
        {r.docStatus === "a-paraitre" ? (
          <span className="inline-block rounded-md border border-line px-4 py-2 text-sm text-grey">
            {T.aParaitre}
          </span>
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
