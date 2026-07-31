"use client";

import { useState } from "react";

// Formulaire de candidature (spontanée ou sur poste) -> /api/candidature -> Odoo.
// Envoi multipart : les pièces jointes (CV, diplômes…) sont rattachées au lead.

const MAX_FILES = 6;
const MAX_TOTAL = 15 * 1024 * 1024; // 15 Mo

export default function CareersForm({
  roles,
  lang = "fr",
}: {
  roles: string[];
  lang?: "fr" | "en";
}) {
  const en = lang === "en";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const T = en
    ? {
        nom: "Full name *", email: "Professional email *", tel: "Phone",
        poste: "Role you are applying for", profil: "Current role / specialisation",
        lien: "Link to your CV or portfolio (LinkedIn, Drive…)",
        docs: "Documents — CV, diplomas, certificates",
        docsHelp: "PDF, Word or images · up to 6 files · 5 MB each, 15 MB total.",
        message: "Your motivation *", select: "Select…", spontanee: "Spontaneous application",
        send: "Send my application", sending: "Sending…",
        okTitle: "Application received",
        okText: "Thank you — we have received your application and documents. Shortlisted profiles are contacted directly. Applications from women and young graduates are warmly encouraged.",
        err: "An error occurred. Write to us at contact@xp-nova.com.",
        tooMany: "Too many files (max 6).",
        tooBig: "Attachments are too large (15 MB total maximum).",
        note: "Your data and documents are used solely to process your application.",
      }
    : {
        nom: "Nom complet *", email: "E-mail professionnel *", tel: "Téléphone",
        poste: "Poste visé", profil: "Poste actuel / spécialité",
        lien: "Lien vers votre CV ou portfolio (LinkedIn, Drive…)",
        docs: "Documents — CV, diplômes, attestations",
        docsHelp: "PDF, Word ou images · jusqu'à 6 fichiers · 5 Mo chacun, 15 Mo au total.",
        message: "Votre motivation *", select: "Sélectionner…", spontanee: "Candidature spontanée",
        send: "Envoyer ma candidature", sending: "Envoi…",
        okTitle: "Candidature reçue",
        okText: "Merci — nous avons bien reçu votre candidature et vos documents. Les profils retenus sont contactés directement. Les candidatures des femmes et des jeunes diplômés sont vivement encouragées.",
        err: "Une erreur est survenue. Écrivez-nous à contact@xp-nova.com.",
        tooMany: "Trop de fichiers (max 6).",
        tooBig: "Pièces jointes trop volumineuses (15 Mo au total maximum).",
        note: "Vos données et documents servent uniquement à traiter votre candidature.",
      };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Validation client des pièces jointes.
    const files = fd.getAll("documents").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > MAX_FILES) {
      setErrMsg(T.tooMany);
      setStatus("error");
      return;
    }
    if (files.reduce((s, f) => s + f.size, 0) > MAX_TOTAL) {
      setErrMsg(T.tooBig);
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/candidature", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setErrMsg("");
      setStatus("error");
    }
  }

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
        <label className={label} htmlFor="documents">{T.docs}</label>
        <input
          id="documents"
          name="documents"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
          className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-royal"
        />
        <p className="mt-1 text-xs text-grey">{T.docsHelp}</p>
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
        {status === "error" && <p className="text-sm text-red-600">{errMsg || T.err}</p>}
      </div>
      <p className="text-xs text-grey sm:col-span-2">{T.note}</p>
    </form>
  );
}
