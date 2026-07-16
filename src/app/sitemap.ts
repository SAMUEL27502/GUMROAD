import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/blog";
import { bots } from "@/lib/data/bots";
import { PUBLIC_SITEMAP_ROUTES, absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(route.path || "/"),
    lastModified: new Date("2026-07-15"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const botEntries: MetadataRoute.Sitemap = bots.map((bot) => ({
    url: absoluteUrl(`/bots/${bot.slug}`),
    lastModified: new Date("2026-07-15"),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...blogEntries, ...botEntries];
}
