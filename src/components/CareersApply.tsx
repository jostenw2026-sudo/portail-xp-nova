"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Job } from "@/lib/jobs";

// Moteur d'offres + candidature. Affiche les offres publiées (Odoo), renvoie
// vers la fiche dédiée de chaque offre, permet de postuler à une offre précise
// (pré-sélection, y compris via ?poste= dans l'URL) et gère l'envoi multipart
// avec pièces jointes obligatoires (CV requis).

const MAX_FILES = 6;
const MAX_TOTAL = 15 * 1024 * 1024; // 15 Mo

interface Props {
  offers: Job[];
  roles: string[];
  postes: string[];
  vivier: string[];
  postesLabel: string;
  vivierLabel: string;
  formTitle: string;
  formIntro: string;
  lang?: "fr" | "en";
}

export default function CareersApply({
  offers, roles, postes, vivier, postesLabel, vivierLabel, formTitle, formIntro, lang = "fr",
}: Props) {
  const en = lang === "en";
  const base = en ? "/en/carrieres" : "/carrieres";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [poste, setPoste] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const T = en
    ? {
        offresTitle: "Open positions", postesUnit: "position(s)", applyTo: "Apply to this position", details: "View position",
        noOffers: "No open position is published right now — you are welcome to send a spontaneous application below.",
        nom: "Full name *", email: "Professional email *", tel: "Phone",
        posteLabel: "Position", profil: "Current role / specialisation",
        lien: "Link to your CV or portfolio (LinkedIn, Drive…)",
        docs: "Documents — CV, diplomas, certificates *",
        docsHelp: "CV required. PDF, Word or images · up to 6 files · 5 MB each, 15 MB total.",
        message: "Your motivation *", select: "Select…", spontanee: "Spontaneous application",
        send: "Send my application", sending: "Sending…",
        okTitle: "Application received",
        okText: "Thank you — we have received your application and documents. Shortlisted profiles are contacted directly. Applications from women and young graduates are warmly encouraged.",
        err: "An error occurred. Write to us at contact@xp-nova.com.",
        cvRequired: "Please attach at least your CV.",
        tooMany: "Too many files (max 6).",
        tooBig: "Attachments are too large (15 MB total maximum).",
        note: "Your data and documents are used solely to process your application.",
      }
    : {
        offresTitle: "Offres en cours", postesUnit: "poste(s)", applyTo: "Postuler à ce poste", details: "Voir l'offre",
        noOffers: "Aucune offre ouverte n'est publiée pour le moment — vous pouvez envoyer une candidature spontanée ci-dessous.",
        nom: "Nom complet *", email: "E-mail professionnel *", tel: "Téléphone",
        posteLabel: "Poste visé", profil: "Poste actuel / spécialité",
        lien: "Lien vers votre CV ou portfolio (LinkedIn, Drive…)",
        docs: "Documents — CV, diplômes, attestations *",
        docsHelp: "CV obligatoire. PDF, Word ou images · jusqu'à 6 fichiers · 5 Mo chacun, 15 Mo au total.",
        message: "Votre motivation *", select: "Sélectionner…", spontanee: "Candidature spontanée",
        send: "Envoyer ma candidature", sending: "Envoi…",
        okTitle: "Candidature reçue",
        okText: "Merci — nous avons bien reçu votre candidature et vos documents. Les profils retenus sont contactés directement. Les candidatures des femmes et des jeunes diplômés sont vivement encouragées.",
        err: "Une erreur est survenue. Écrivez-nous à contact@xp-nova.com.",
        cvRequired: "Veuillez joindre au moins votre CV.",
        tooMany: "Trop de fichiers (max 6).",
        tooBig: "Pièces jointes trop volumineuses (15 Mo au total maximum).",
        note: "Vos données et documents servent uniquement à traiter votre candidature.",
      };

  const roleOptions = Array.from(new Set([...offers.map((o) => o.name), ...roles]));

  // Pré-sélection d'un poste passé dans l'URL (ex. depuis une fiche d'offre :
  // /carrieres?poste=Ingénieur…#candidature) puis défilement vers le formulaire.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("poste");
    if (p) {
      setPoste(p);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  function applyTo(name: string) {
    setPoste(name);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function meta(o: Job): string {
    return [o.contractType, o.location, o.department, o.positions ? `${o.positions} ${T.postesUnit}` : ""]
      .filter(Boolean)
      .join(" · ");
  }
  function teaser(html: string): string {
    const t = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return t.length > 180 ? `${t.slice(0, 180)}…` : t;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const files = fd.getAll("documents").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) {
      setErrMsg(T.cvRequired);
      setStatus("error");
      return;
    }
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
      setPoste("");
    } catch {
      setErrMsg("");
      setStatus("error");
    }
  }

  const field = "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-royal";
  const label = "block text-sm font-semibold text-navy mb-1";

  return (
    <>
      {offers.length > 0 ? (
        <div className="mb-12">
          <h3 className="title-2 gold-rule">{T.offresTitle}</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {offers.map((o) => (
              <div key={o.id} className="flex flex-col rounded-lg border border-line bg-paper p-6">
                <h4 className="title-3 text-navy">
                  <Link href={`${base}/${o.slug}`} className="no-underline hover:text-royal">{o.name}</Link>
                </h4>
                {meta(o) ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold">{meta(o)}</p> : null}
                {o.description ? <p className="mt-2 text-sm text-grey">{teaser(o.description)}</p> : null}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => applyTo(o.name)}
                    className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-royal"
                  >
                    {T.applyTo}
                  </button>
                  <Link href={`${base}/${o.slug}`} className="text-sm font-semibold text-royal no-underline hover:underline">
                    {T.details} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-12 rounded-md border border-line bg-light p-4 text-sm text-grey">{T.noOffers}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper p-6">
          <p className="eyebrow mb-3">{postesLabel}</p>
          <ul className="space-y-2">
            {postes.map((p) => (
              <li key={p} className="flex gap-2 text-ink/90"><span className="text-gold">▹</span><span>{p}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-light p-6">
          <p className="eyebrow mb-3">{vivierLabel}</p>
          <ul className="space-y-2">
            {vivier.map((p) => (
              <li key={p} className="flex gap-2 text-ink/90"><span className="text-gold">▹</span><span>{p}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={formRef} className="mt-12 scroll-mt-28">
        <h3 className="title-2 gold-rule">{formTitle}</h3>
        <p className="mt-3 mb-6 max-w-2xl text-grey">{formIntro}</p>

        {status === "ok" ? (
          <div className="rounded-lg border border-line bg-light p-8 text-center">
            <h4 className="title-3 text-navy">{T.okTitle}</h4>
            <p className="mt-2 text-grey">{T.okText}</p>
          </div>
        ) : (
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
              <label className={label} htmlFor="poste">{T.posteLabel}</label>
              <select id="poste" name="poste" className={field} value={poste} onChange={(e) => setPoste(e.target.value)}>
                <option value="">{T.select}</option>
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                {poste && !roleOptions.includes(poste) && poste !== T.spontanee ? (
                  <option value={poste}>{poste}</option>
                ) : null}
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
                required
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
        )}
      </div>
    </>
  );
}
