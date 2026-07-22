"use client";

import { useState } from "react";
import { metiers } from "@/content/metiers";
import { metiersEn } from "@/content/en";

const orgTypesFr = [
  "Bailleur / partenaire technique et financier",
  "Administration / agence publique",
  "Collectivité territoriale",
  "Entreprise privée",
  "Bureau d'études partenaire",
  "Autre",
];
const orgTypesEn = [
  "Development partner / technical & financial partner",
  "Government / public agency",
  "Local authority",
  "Private company",
  "Partner engineering firm",
  "Other",
];

export default function ContactForm({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const en = lang === "en";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
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

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-line bg-light p-8 text-center">
        <h3 className="title-3 text-navy">{en ? "Request received" : "Demande reçue"}</h3>
        <p className="mt-2 text-grey">
          {en
            ? "Thank you. An expert will reply within 48 business hours at the address you provided."
            : "Merci. Un expert vous répond sous 48 h ouvrées à l'adresse indiquée."}
        </p>
      </div>
    );
  }

  const orgTypes = en ? orgTypesEn : orgTypesFr;
  const items = en ? metiersEn : metiers;
  const field = "w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-royal";
  const label = "block text-sm font-semibold text-navy mb-1";
  const T = en
    ? {
        name: "Name *",
        org: "Organisation *",
        email: "Email *",
        phone: "Phone",
        country: "Country *",
        orgType: "Organisation type",
        select: "Select…",
        subject: "Subject",
        partnership: "Partnership / consortium",
        other: "Other",
        budget: "Estimated budget",
        optional: "(optional)",
        budgetPh: "E.g. to be determined",
        project: "Your project *",
        sending: "Sending…",
        submit: "Send my request",
        error: "Something went wrong. Please write to us directly at contact@xp-nova.com.",
        privacy:
          "Your data is used solely to handle your request. Getting in touch is free and without commitment; we scope the need before any proposal.",
      }
    : {
        name: "Nom *",
        org: "Organisation *",
        email: "E-mail *",
        phone: "Téléphone",
        country: "Pays *",
        orgType: "Type d'organisation",
        select: "Sélectionner…",
        subject: "Objet",
        partnership: "Partenariat / groupement",
        other: "Autre",
        budget: "Budget estimatif",
        optional: "(optionnel)",
        budgetPh: "Ex. : à déterminer",
        project: "Votre projet *",
        sending: "Envoi…",
        submit: "Envoyer ma demande",
        error: "Une erreur est survenue. Écrivez-nous directement à contact@xp-nova.com.",
        privacy:
          "Vos données servent uniquement à traiter votre demande. La prise de contact est libre et sans engagement ; l'instruction du besoin précède toute proposition.",
      };

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {/* Honeypot anti-spam (invisible) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label className={label} htmlFor="nom">{T.name}</label>
        <input id="nom" name="nom" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="organisation">{T.org}</label>
        <input id="organisation" name="organisation" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="email">{T.email}</label>
        <input id="email" name="email" type="email" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="telephone">{T.phone}</label>
        <input id="telephone" name="telephone" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="pays">{T.country}</label>
        <input id="pays" name="pays" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="typeOrg">{T.orgType}</label>
        <select id="typeOrg" name="typeOrg" className={field} defaultValue="">
          <option value="" disabled>{T.select}</option>
          {orgTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="objet">{T.subject}</label>
        <select id="objet" name="objet" className={field} defaultValue="">
          <option value="" disabled>{T.select}</option>
          {items.map((m) => (
            <option key={m.slug} value={m.title}>{m.title}</option>
          ))}
          <option value={T.partnership}>{T.partnership}</option>
          <option value={T.other}>{T.other}</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="budget">
          {T.budget} <span className="font-normal text-grey">{T.optional}</span>
        </label>
        <input id="budget" name="budget" className={field} placeholder={T.budgetPh} />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="message">{T.project}</label>
        <textarea id="message" name="message" required rows={5} className={field} />
      </div>

      <div className="sm:col-span-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-soft disabled:opacity-60"
        >
          {status === "sending" ? T.sending : T.submit}
        </button>
        {status === "error" && <p className="text-sm text-red-600">{T.error}</p>}
      </div>
      <p className="sm:col-span-2 text-xs text-grey">{T.privacy}</p>
    </form>
  );
}
