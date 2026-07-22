"use client";

import { useState } from "react";

const interets = [
  "AGROVITA — agriculture & agro-industrie",
  "ODT — développement territorial",
  "Bureau d'Ingénierie Conseil (les deux)",
  "Autre / je ne sais pas encore",
];

export default function ContactForm() {
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
      <div className="rounded-lg border border-white/20 bg-white/5 p-8 text-center">
        <p className="font-display text-xl text-white">Demande reçue.</p>
        <p className="mt-2 text-white/80">
          Merci. Un expert vous répond sous 48 h ouvrées à l&apos;adresse indiquée.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-gold";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input name="nom" required placeholder="Nom *" className={field} aria-label="Nom" />
      <input name="organisation" placeholder="Organisation" className={field} aria-label="Organisation" />
      <input name="email" type="email" required placeholder="E-mail *" className={field} aria-label="E-mail" />
      <input name="telephone" placeholder="Téléphone" className={field} aria-label="Téléphone" />
      <input name="pays" placeholder="Pays" className={field} aria-label="Pays" />
      <select name="interet" defaultValue="" className={field} aria-label="Domaine d'intérêt">
        <option value="" disabled className="text-navy">
          Votre domaine d&apos;intérêt…
        </option>
        {interets.map((i) => (
          <option key={i} value={i} className="text-navy">
            {i}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Votre projet en quelques mots *"
        className={`${field} sm:col-span-2`}
        aria-label="Votre projet"
      />
      <div className="flex items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-soft disabled:opacity-60"
        >
          {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
        </button>
        {status === "error" && (
          <p className="text-sm text-gold-soft">
            Une erreur est survenue. Écrivez-nous à contact@xp-nova.com.
          </p>
        )}
      </div>
      <p className="text-xs text-white/50 sm:col-span-2">
        Vos données servent uniquement à traiter votre demande. Prise de contact libre et sans engagement.
      </p>
    </form>
  );
}
