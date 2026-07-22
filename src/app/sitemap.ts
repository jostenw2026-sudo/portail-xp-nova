import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { metiers } from "@/content/metiers";
import { references } from "@/content/references";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticPaths = [
    "",
    "/cabinet",
    "/metiers",
    "/methode",
    "/references",
    "/equipe",
    "/ressources",
    "/engagements",
    "/contact",
  ];
  const now = new Date();
  const frStatic = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const enStatic = staticPaths.map((p) => ({
    url: `${base}/en${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 0.9 : 0.7,
  }));
  const metierPages = metiers.flatMap((m) => [
    { url: `${base}/metiers/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/en/metiers/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
  ]);
  const refPages = references.flatMap((r) => [
    { url: `${base}/references/${r.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${base}/en/references/${r.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
  ]);
  return [...frStatic, ...enStatic, ...metierPages, ...refPages];
}
