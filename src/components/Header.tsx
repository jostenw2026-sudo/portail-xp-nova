"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site, cta } from "@/content/site";
import { navEn, ctaEn } from "@/content/en";

// Accroches courtes bilingues des deux pôles (les noms/URL viennent de site.ecosystem).
const POLE_TAGLINES: Record<string, { fr: string; en: string }> = {
  agrovita: { fr: "Agriculture & agro-industrie", en: "Agriculture & agri-business" },
  odt: { fr: "Développement territorial", en: "Territorial development" },
};

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="opacity-70">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const en = pathname === "/en" || pathname.startsWith("/en/");

  const NAV = en ? navEn : nav;
  const CTA = en ? ctaEn : cta;
  const home = en ? "/en" : "/";
  const switchTarget = en ? (pathname.replace(/^\/en\/?/, "/") || "/") : `/en${pathname === "/" ? "" : pathname}`;

  const poles = site.ecosystem.map((e) => ({
    key: e.key,
    name: e.name,
    url: e.url,
    tagline: en ? (POLE_TAGLINES[e.key]?.en ?? e.tagline) : (POLE_TAGLINES[e.key]?.fr ?? e.tagline),
  }));

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* Barre utilitaire — écosystème mis en évidence (CDC §3.1) */}
      <div className="bg-navy text-white">
        <div className="container-x flex items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-wider text-gold sm:inline">
              {en ? "Our divisions" : "Nos pôles"}
            </span>
            <div className="flex items-center gap-2">
              {poles.map((p) => (
                <a
                  key={p.key}
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-bold text-white no-underline transition-colors hover:border-gold hover:bg-gold/15"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span>{p.name}</span>
                  <span className="hidden font-medium text-white/60 md:inline">· {p.tagline}</span>
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>
          <span className="ml-auto flex shrink-0 items-center gap-4">
            <a href={`mailto:${site.email}`} className="hidden text-sm text-white/80 hover:text-white lg:inline">
              {site.email}
            </a>
            <Link
              href={switchTarget}
              className="rounded border border-white/30 px-2 py-0.5 text-xs font-bold text-white no-underline hover:border-gold hover:text-gold"
              aria-label={en ? "Version française" : "English version"}
            >
              {en ? "FR" : "EN"}
            </Link>
          </span>
        </div>
      </div>

      <div className="container-x flex items-center justify-between py-3">
        <Link href={home} className="flex items-center" aria-label="XP-NOVA">
          <Image
            src="/brand/logo_xpnova_color.png"
            alt="XP-NOVA — Bureau d'Ingénierie Conseil"
            width={350}
            height={80}
            priority
            className="h-[70px] w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label={en ? "Main navigation" : "Navigation principale"}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink font-semibold hover:text-royal no-underline">
              {n.label}
            </Link>
          ))}
          <Link
            href={CTA.primary.href}
            className="rounded-md bg-gold px-4 py-2 font-semibold text-navy hover:bg-gold-soft no-underline"
          >
            Contact
          </Link>
        </nav>

        <button
          className="lg:hidden inline-flex flex-col gap-1.5 p-2"
          aria-label={en ? "Open menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-paper" aria-label={en ? "Mobile navigation" : "Navigation mobile"}>
          <div className="container-x py-3 flex flex-col">
            {NAV.map((n) => (
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
              href={CTA.primary.href}
              className="mt-3 rounded-md bg-gold px-4 py-3 text-center font-semibold text-navy no-underline"
              onClick={() => setOpen(false)}
            >
              {CTA.primary.label}
            </Link>

            {/* Écosystème — accès direct aux deux pôles depuis le menu mobile */}
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-grey">
                {en ? "Our divisions" : "Nos pôles"}
              </p>
              <div className="flex flex-col gap-2">
                {poles.map((p) => (
                  <a
                    key={p.key}
                    href={p.url}
                    target="_blank"
                    rel="noopener"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-line bg-light px-4 py-3 no-underline hover:border-gold"
                  >
                    <span className="flex flex-col">
                      <span className="font-extrabold text-navy">{p.name}</span>
                      <span className="text-sm text-grey">{p.tagline}</span>
                    </span>
                    <span className="text-navy"><ArrowUpRight /></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
