import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog", "/marketplace", "/bots"],
        disallow: ROBOTS_DISALLOW,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
