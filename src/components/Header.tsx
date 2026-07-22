"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { nav, site, cta } from "@/content/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* Barre utilitaire — écosystème (CDC §3.1) */}
      <div className="bg-navy text-white/90 text-sm">
        <div className="container-x flex items-center justify-between py-1.5">
          <span className="hidden sm:inline text-white/70">
            Écosystème :{" "}
            {site.ecosystem.map((e, i) => (
              <span key={e.key}>
                <a href={e.url} target="_blank" rel="noopener" className="text-gold hover:underline">
                  {e.name}
                </a>
                {i < site.ecosystem.length - 1 ? " · " : ""}
              </span>
            ))}
          </span>
          <a href={`mailto:${site.email}`} className="text-white/80 hover:text-white ml-auto">
            {site.email}
          </a>
        </div>
      </div>

      <div className="container-x flex items-center justify-between py-3">
        <Link href="/" className="flex items-center" aria-label="XP-NOVA — accueil">
          <Image
            src="/brand/logo_xpnova_color.png"
            alt="XP-NOVA — Bureau d'Ingénierie Conseil"
            width={200}
            height={46}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation principale">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-ink font-semibold hover:text-royal no-underline"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={cta.primary.href}
            className="rounded-md bg-gold px-4 py-2 font-semibold text-navy hover:bg-gold-soft no-underline"
          >
            Contact
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex flex-col gap-1.5 p-2"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-paper" aria-label="Navigation mobile">
          <div className="container-x py-3 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="py-2.5 font-semibold text-ink border-b border-line no-underline"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href={cta.primary.href}
              className="mt-3 rounded-md bg-gold px-4 py-3 text-center font-semibold text-navy no-underline"
              onClick={() => setOpen(false)}
            >
              Parlons de votre projet
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
