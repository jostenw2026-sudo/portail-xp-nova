"use client";

import { useState } from "react";

// Formulaire de demande d'un document "sur demande".
// Même canal que le contact : POST /api/ressources -> lead Odoo (non bloquant).

export default function RessourceRequestForm({
  document,
  lang = "fr",
}: {
  document: string;
  lang?: "fr" | "en";
}) {
  const en = lang === "en";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/ressources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, document }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="mt-3 rounded-md bg-light p-3 text-sm text-navy">
        {en
          ? `Thank you — your request for “${document}” has been recorded. After validation, this document will be sent to you by email (usually within 48 business hours).`
          : `Merci — votre demande concernant « ${document} » est enregistrée. Après validation, ce document vous sera transmis par e-mail (généralement sous 48 h ouvrées).`}
      </p>
    );
  }

  const field = "w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-royal";
  const T = en
    ? { email: "Professional email *", nom: "Name *", org: "Organisation", pays: "Country *", send: "Send my request", sending: "Sending…", err: "Error. Write to contact@xp-nova.com.", note: "Your data is used solely to handle this request." }
    : { email: "E-mail professionnel *", nom: "Nom *", org: "Organisation", pays: "Pays *", send: "Envoyer ma demande", sending: "Envoi…", err: "Erreur. Écrivez à contact@xp-nova.com.", note: "Vos données servent uniquement à traiter cette demande." };

  return (
    <form onSubmit={onSubmit} className="mt-3 grid gap-2">
      {/* Honeypot anti-spam (invisible) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input name="email" type="email" required placeholder={T.email} className={field} />
      <div className="grid grid-cols-2 gap-2">
        <input name="nom" required placeholder={T.nom} className={field} />
        <input name="pays" required placeholder={T.pays} className={field} />
      </div>
      <input name="organisation" placeholder={T.org} className={field} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-md bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-navy disabled:opacity-60"
      >
        {status === "sending" ? T.sending : T.send}
      </button>
      {status === "error" && <p className="text-xs text-red-600">{T.err}</p>}
      <p className="text-xs text-grey">{T.note}</p>
    </form>
  );
}
