import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/pricing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/propuesta/", "/proyecto/", "/gracias"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
