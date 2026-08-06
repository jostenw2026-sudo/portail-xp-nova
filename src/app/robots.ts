import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// CHANTIER : tant que SITE_ENV != "production", tout est en noindex (bingeco.xp-nova.com).
// À la bascule sur xp-nova.com, définir SITE_ENV=production.
const isProd = process.env.SITE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
