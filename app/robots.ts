import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL, absoluteUrl } from "@/app/(frontend)/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/file/"],
      disallow: ["/admin", "/api/", "/preview"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
