"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site, cta } from "@/content/site";
import { navEn, ctaEn } from "@/content/en";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const en = pathname === "/en" || pathname.startsWith("/en/");

  const NAV = en ? navEn : nav;
  const CTA = en ? ctaEn : cta;
  const home = en ? "/en" : "/";
  const switchTarget = en ? (pathname.replace(/^\/en\/?/, "/") || "/") : `/en${pathname === "/" ? "" : pathname}`;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* Barre utilitaire — contact + langue */}
      <div className="bg-navy text-white/90 text-sm">
        <div className="container-x flex items-center justify-end gap-4 py-1.5">
          <a href={`mailto:${site.email}`} className="hidden text-white/80 hover:text-white sm:inline">
            {site.email}
          </a>
          <Link
            href={switchTarget}
            className="rounded border border-white/30 px-2 py-0.5 text-xs font-bold text-white no-underline hover:border-gold hover:text-gold"
            aria-label={en ? "Version française" : "English version"}
          >
            {en ? "FR" : "EN"}
          </Link>
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
                {site.ecosystem.map((e) => (
                  <a
                    key={e.key}
                    href={e.url}
                    target="_blank"
                    rel="noopener"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-line bg-light px-4 py-3 no-underline hover:border-gold"
                  >
                    <span className="flex flex-col">
                      <span className="font-extrabold text-navy">{e.name}</span>
                      <span className="text-sm text-grey">{e.tagline}</span>
                    </span>
                    <span className="text-navy">→</span>
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
