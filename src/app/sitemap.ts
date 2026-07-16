import type { MetadataRoute } from "next";

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
    "/privacy",
    "/terms",
    "/risk-disclosure",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/marketplace" ? 0.9 : 0.7,
  }));
}
