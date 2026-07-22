import type { MetadataRoute } from "next";
import { portal } from "@/content/portal";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: portal.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
