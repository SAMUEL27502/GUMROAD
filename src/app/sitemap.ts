import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://tradebib.com";
  const routes = [
    "",
    "/marketplace",
    "/recommend",
    "/charts",
    "/dashboard",
    "/mt5",
    "/pricing",
    "/login",
    "/register",
    "/about",
    "/blog",
    "/careers",
    "/contact",
    "/compare",
    "/calculator",
    "/calendar",
    "/news",
    "/journal",
    "/leaderboard",
    "/notifications",
    "/referrals",
    "/affiliate",
    "/privacy",
    "/terms",
    "/risk-disclosure",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/marketplace" || route === "/blog" ? 0.9 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...blogEntries];
}
