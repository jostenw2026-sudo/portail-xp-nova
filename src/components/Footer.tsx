import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      {/* Liseré or supérieur — signature template documentaire (Annexe A.4) */}
      <div className="h-1.5 bg-gold" />
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Image
            src="/brand/logo_xpnova_white.png"
            alt="XP-NOVA — Bureau d'Ingénierie Conseil"
            width={350}
            height={80}
            className="h-[70px] w-auto"
          />
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            {site.baseline}. {site.devise}
          </p>
        </div>

        <div>
          <p className="font-bold text-white mb-3">Navigation</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/70 hover:text-gold no-underline">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/engagements" className="text-white/70 hover:text-gold no-underline">
                Engagements
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-white mb-3">Écosystème</p>
          <ul className="space-y-2 text-sm">
            {site.ecosystem.map((e) => (
              <li key={e.key}>
                <a href={e.url} target="_blank" rel="noopener" className="text-white/70 hover:text-gold">
                  {e.name} — {e.tagline}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-bold text-white mb-3">Contact</p>
          <address className="not-italic text-sm space-y-1 text-white/70">
            <p>{site.address}</p>
            <p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-white/70 hover:text-gold">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-white/70 hover:text-gold">
                {site.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-white/55">
          <p>
            © {new Date().getFullYear()} {site.legalName} — {site.legal.forme}, capital{" "}
            {site.legal.capital} · RCCM {site.legal.rccm} · NIU {site.legal.niu}
          </p>
          <p className="flex gap-4">
            <Link href="/mentions-legales" className="text-white/55 hover:text-gold no-underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-white/55 hover:text-gold no-underline">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
