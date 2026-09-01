"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const VIDEO_ID = "997JPwgGuwc";
const POSTER = "/video/xpnova-video-poster.jpg";

const T = {
  fr: {
    eyebrow: "En vidéo",
    title: "Découvrez XP-NOVA en 80 secondes",
    intro:
      "Notre approche de l'ingénierie du développement territorial, condensée : de l'étude bancable au financement, jusqu'à l'impact mesuré sur le terrain.",
    points: [
      "Des livrables aux standards des bailleurs et des banques",
      "Des décaissements libérés sur jalons vérifiés",
      "Un impact mesuré, sourcé et daté",
    ],
    cta: "Découvrir la méthode",
    ctaHref: "/methode",
    play: "Lire la présentation",
    duration: "1 min 20",
  },
  en: {
    eyebrow: "In video",
    title: "Discover XP-NOVA in 80 seconds",
    intro:
      "Our approach to territorial development engineering, in brief: from bankable studies to financing, all the way to measured impact on the ground.",
    points: [
      "Deliverables meeting the standards of lenders and banks",
      "Disbursements released against verified milestones",
      "Impact that is measured, sourced and dated",
    ],
    cta: "Explore the method",
    ctaHref: "/en/methode",
    play: "Play the presentation",
    duration: "1 min 20",
  },
};

export default function VideoPresentation({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const t = lang === "en" ? T.en : T.fr;
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-navy text-white py-16 md:py-24">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Colonne texte */}
          <div className="flex max-w-xl flex-col gap-4">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="title-1 gold-rule !text-white">{t.title}</h2>
            <p className="text-lg text-white/80">{t.intro}</p>
            <ul className="mt-2 flex flex-col gap-2">
              {t.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href={t.ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy no-underline transition-colors hover:bg-gold-soft"
              >
                {t.cta}
              </Link>
            </div>
          </div>

          {/* Colonne vidéo (verticale 9:16) */}
          <div className="mx-auto w-full max-w-[340px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              {playing ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={t.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={t.play}
                  className="group absolute inset-0 h-full w-full cursor-pointer"
                >
                  <Image
                    src={POSTER}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold shadow-lg transition-transform group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-navy" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="absolute bottom-3 left-3 text-sm font-semibold text-white drop-shadow">
                    {t.play}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                    {t.duration}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
