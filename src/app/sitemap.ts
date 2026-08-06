import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { metiers } from "@/content/metiers";

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
  return [...frStatic, ...enStatic, ...metierPages];
}
