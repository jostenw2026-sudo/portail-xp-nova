import Image from "next/image";
import { portal, branches, metiers, methode, piliers, stats } from "@/content/portal";
import { HeroBlueprint, MotifAgro, MotifTerritory } from "@/components/illustrations";
import ContactForm from "@/components/ContactForm";

const motifs: Record<string, React.ReactNode> = {
  agrovita: <MotifAgro className="h-full w-full" />,
  odt: <MotifTerritory className="h-full w-full" />,
};

export default function Home() {
  return (
    <>
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <Image
            src="/brand/logo_xpnova_color.png"
            alt="XP-NOVA — Bureau d'Ingénierie Conseil"
            width={200}
            height={46}
            priority
            className="h-10 w-auto"
          />
          <nav className="flex items-center gap-2 text-sm font-semibold">
            {branches.map((b) => (
              <a
                key={b.key}
                href={b.url}
                className="hidden rounded-md px-3 py-2 text-navy no-underline hover:bg-light sm:inline-block"
              >
                {b.name}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-md bg-gold px-4 py-2 text-navy no-underline hover:bg-gold-soft"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-navy text-white">
        <HeroBlueprint className="pointer-events-none absolute -right-16 -top-10 h-[520px] w-[520px] opacity-90 md:right-0" />
        <div className="container-x relative flex flex-col gap-6 py-20 md:py-28">
          <p className="eyebrow">Bureau d&apos;Ingénierie Conseil</p>
          <h1 className="title-hero max-w-4xl !text-white">
            Une même ingénierie,
            <br />
            deux domaines d&apos;<span className="text-gold">application</span>.
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            XP-NOVA conçoit, structure, pilote et sécurise les projets — de l&apos;idée à
            l&apos;impact mesuré. Choisissez le domaine qui correspond à votre projet.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {branches.map((b) => (
              <a
                key={b.key}
                href={b.url}
                className="rounded-md bg-gold px-6 py-3 font-semibold text-navy no-underline hover:bg-gold-soft"
              >
                Accéder à {b.name} →
              </a>
            ))}
          </div>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/60">« {portal.devise} »</p>
        </div>
        <div className="h-1 bg-gold" />
      </section>

      {/* ---------- STATS ---------- */}
      <section className="border-b border-line bg-light">
        <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-extrabold text-gold md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-grey">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- LES DEUX BRANCHES (redirection) ---------- */}
      <section className="container-x py-16 md:py-24">
        <div className="mb-10 flex max-w-3xl flex-col gap-4">
          <p className="eyebrow">Nos domaines d&apos;application</p>
          <h2 className="title-1 gold-rule">Deux branches, un seul bureau d&apos;ingénierie</h2>
          <p className="text-lg text-grey">
            Chaque branche applique la même exigence d&apos;ingénierie à son domaine. Accédez
            directement au site dédié à votre secteur.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {branches.map((b) => (
            <a
              key={b.key}
              href={b.url}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper no-underline transition-shadow hover:shadow-xl"
            >
              <div className="relative h-28 w-full overflow-hidden border-b border-line">
                {motifs[b.key]}
                <span className="absolute bottom-0 left-0 h-1 w-full" style={{ background: b.accent }} />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-3xl font-extrabold text-navy">{b.name}</h3>
                  <span className="text-sm font-semibold" style={{ color: b.accent }}>
                    {b.host}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-grey">
                  {b.domaine}
                </p>
                <p className="mt-4 font-display text-lg italic" style={{ color: b.accent }}>
                  « {b.signature} »
                </p>
                <p className="mt-4 flex-1 text-ink/90">{b.desc}</p>
                <p className="mt-4 text-sm text-grey">{b.audience}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-navy">
                  Accéder au site {b.name}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- SOCLE COMMUN ---------- */}
      <section className="bg-light">
        <div className="container-x py-16 md:py-24">
          <div className="mb-10 flex max-w-3xl flex-col gap-4">
            <p className="eyebrow">Ce qui est commun aux deux domaines</p>
            <h2 className="title-1 gold-rule">Une seule ingénierie</h2>
            <p className="text-lg text-grey">
              Quel que soit le secteur, XP-NOVA mobilise les mêmes métiers et la même méthode pour
              transformer une intention en projet sécurisé, finançable et durable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {metiers.map((m) => (
              <span
                key={m}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-navy"
              >
                {m}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
              Notre méthode en 6 phases
            </p>
            <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {methode.map((p, i) => (
                <li key={p} className="rounded-lg border border-line bg-paper p-4 text-center">
                  <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-gold font-display text-sm font-bold text-navy">
                    {i + 1}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-navy">{p}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- POURQUOI XP-NOVA ---------- */}
      <section className="container-x py-16 md:py-24">
        <div className="mb-10 flex max-w-3xl flex-col gap-4">
          <p className="eyebrow">Pourquoi XP-NOVA</p>
          <h2 className="title-1 gold-rule">Une signature d&apos;ingénierie reconnue</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {piliers.map((p) => (
            <div key={p.t} className="rounded-lg border border-line bg-paper p-6">
              <div className="mb-3 h-1 w-8 rounded bg-gold" />
              <h3 className="title-3 text-navy">{p.t}</h3>
              <p className="mt-2 text-grey">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-grey">
          {portal.legalName} — {portal.baseline}, société établie à Yaoundé depuis 2006 (ex-INNOVA),
          repositionnée en 2026. Interventions aux standards des partenaires techniques et
          financiers.
        </p>
      </section>

      {/* ---------- CONTACT (formulaire → Odoo) ---------- */}
      <section id="contact" className="scroll-mt-20 bg-navy text-white">
        <div className="container-x grid gap-10 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Parlons de votre projet</p>
            <h2 className="title-1 mt-3 !text-white">Un projet à structurer&nbsp;?</h2>
            <p className="mt-4 max-w-md text-white/80">
              Décrivez votre besoin : un expert vous répond sous 48 h ouvrées. Vous pouvez aussi
              accéder directement au site dédié à votre domaine.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {branches.map((b) => (
                <a
                  key={b.key}
                  href={b.url}
                  className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:border-gold hover:text-gold"
                >
                  {b.name} — {b.host}
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
        <div className="h-1 bg-gold" />
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-navy text-white/80">
        <div className="container-x grid gap-10 py-14 md:grid-cols-3">
          <div>
            <Image
              src="/brand/logo_xpnova_white.png"
              alt="XP-NOVA — Bureau d'Ingénierie Conseil"
              width={200}
              height={46}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              {portal.baseline}. {portal.devise}
            </p>
          </div>
          <div>
            <p className="mb-3 font-bold text-white">Nos sites</p>
            <ul className="space-y-2 text-sm">
              {branches.map((b) => (
                <li key={b.key}>
                  <a href={b.url} className="text-white/70 hover:text-gold">
                    {b.name} — {b.host}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-white">Contact</p>
            <address className="space-y-1 text-sm not-italic text-white/70">
              <p>{portal.address}</p>
              <p>
                <a
                  href={`tel:${portal.phone.replace(/\s/g, "")}`}
                  className="text-white/70 hover:text-gold"
                >
                  {portal.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${portal.email}`} className="text-white/70 hover:text-gold">
                  {portal.email}
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="container-x py-5 text-xs text-white/55">
            © {new Date().getFullYear()} {portal.legalName} — {portal.legal.forme}, capital{" "}
            {portal.legal.capital} · RCCM {portal.legal.rccm} · NIU {portal.legal.niu}
          </div>
        </div>
      </footer>
    </>
  );
}
