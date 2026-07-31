"use client";

import { useState } from "react";

// Formulaire de candidature (spontanée ou sur poste) -> /api/candidature -> Odoo.
// Non bloquant : le canal CRM est en best-effort côté serveur.

export default function CareersForm({
  roles,
  lang = "fr",
}: {
  roles: string[];
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
      const res = await fetch("/api/candidature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const T = en
    ? {
        nom: "Full name *", email: "Professional email *", tel: "Phone",
        poste: "Role you are applying for", profil: "Current role / specialisation",
        lien: "Link to your CV or portfolio (LinkedIn, Drive…)",
        message: "Your motivation *", select: "Select…", spontanee: "Spontaneous application",
        send: "Send my application", sending: "Sending…",
        okTitle: "Application received",
        okText: "Thank you — we have received your application. Shortlisted profiles are contacted directly. Applications from women and young graduates are warmly encouraged.",
        err: "An error occurred. Write to us at contact@xp-nova.com.",
        note: "Your data is used solely to process your application. No file upload here — please share a link to your CV.",
      }
    : {
        nom: "Nom complet *", email: "E-mail professionnel *", tel: "Téléphone",
        poste: "Poste visé", profil: "Poste actuel / spécialité",
        lien: "Lien vers votre CV ou portfolio (LinkedIn, Drive…)",
        message: "Votre motivation *", select: "Sélectionner…", spontanee: "Candidature spontanée",
        send: "Envoyer ma candidature", sending: "Envoi…",
        okTitle: "Candidature reçue",
        okText: "Merci — nous avons bien reçu votre candidature. Les profils retenus sont contactés directement. Les candidatures des femmes et des jeunes diplômés sont vivement encouragées.",
        err: "Une erreur est survenue. Écrivez-nous à contact@xp-nova.com.",
        note: "Vos données servent uniquement à traiter votre candidature. Pas de pièce jointe ici — partagez un lien vers votre CV.",
      };

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-line bg-light p-8 text-center">
        <h3 className="title-3 text-navy">{T.okTitle}</h3>
        <p className="mt-2 text-grey">{T.okText}</p>
      </div>
    );
  }

  const field = "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-royal";
  const label = "block text-sm font-semibold text-navy mb-1";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label className={label} htmlFor="nom">{T.nom}</label>
        <input id="nom" name="nom" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="email">{T.email}</label>
        <input id="email" name="email" type="email" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="telephone">{T.tel}</label>
        <input id="telephone" name="telephone" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="poste">{T.poste}</label>
        <select id="poste" name="poste" className={field} defaultValue="">
          <option value="" disabled>{T.select}</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          <option value={T.spontanee}>{T.spontanee}</option>
        </select>
      </div>
      <div>
        <label className={label} htmlFor="profil">{T.profil}</label>
        <input id="profil" name="profil" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="lien">{T.lien}</label>
        <input id="lien" name="lien" className={field} placeholder="https://…" />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="message">{T.message}</label>
        <textarea id="message" name="message" required rows={5} className={field} />
      </div>
      <div className="flex items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-soft disabled:opacity-60"
        >
          {status === "sending" ? T.sending : T.send}
        </button>
        {status === "error" && <p className="text-sm text-red-600">{T.err}</p>}
      </div>
      <p className="text-xs text-grey sm:col-span-2">{T.note}</p>
    </form>
  );
}
