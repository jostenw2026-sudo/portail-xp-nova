import type { MetadataRoute } from "next";
import { portal } from "@/content/portal";

// Portail xp-nova.com — production : indexation ouverte.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${portal.url}/sitemap.xml`,
  };
}
