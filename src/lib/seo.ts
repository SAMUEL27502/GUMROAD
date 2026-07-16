import type { Metadata } from "next";

export const SITE_NAME = "TradeBib";
export const SITE_TAGLINE = "Automated MT5 Bots Marketplace";
export const DEFAULT_DESCRIPTION =
  "Browse, subscribe, and deploy verified MetaTrader 5 Expert Advisors with real performance data, MT5 sync, and AI recommendations.";
export const DEFAULT_KEYWORDS = [
  "MT5",
  "Expert Advisors",
  "Forex bots",
  "automated trading",
  "TradeBib",
  "MetaTrader 5",
  "EA marketplace",
  "trading bots",
];

export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "https://tradebib.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return getBaseUrl();
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph-image");

type CreateMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: CreateMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : undefined;

  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle || `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle || `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export function serializeJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getBaseUrl(),
    logo: absoluteUrl("/opengraph-image"),
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getBaseUrl(),
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/marketplace")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function softwareApplicationJsonLd(bot: {
  name: string;
  description: string;
  slug: string;
  price: number;
  rating: number;
  strategy: string;
  tradingPair: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: bot.name,
    description: bot.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "MetaTrader 5",
    url: absoluteUrl(`/bots/${bot.slug}`),
    offers: {
      "@type": "Offer",
      price: bot.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: bot.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: Math.max(1, Math.round(bot.rating * 20)),
    },
    keywords: [bot.strategy, bot.tradingPair, "MT5", "Expert Advisor"],
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  date: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  words: number;
  minutes: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/opengraph-image") },
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.words,
    timeRequired: `PT${post.minutes}M`,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl("/opengraph-image"),
    url: absoluteUrl(`/blog/${post.slug}`),
  };
}

/** Public indexable routes for sitemap */
export const PUBLIC_SITEMAP_ROUTES: {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/marketplace", changeFrequency: "daily", priority: 0.95 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/recommend", changeFrequency: "weekly", priority: 0.85 },
  { path: "/compare", changeFrequency: "weekly", priority: 0.85 },
  { path: "/leaderboard", changeFrequency: "daily", priority: 0.8 },
  { path: "/mt5", changeFrequency: "weekly", priority: 0.8 },
  { path: "/charts", changeFrequency: "weekly", priority: 0.75 },
  { path: "/calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.7 },
  { path: "/news", changeFrequency: "daily", priority: 0.7 },
  { path: "/signals", changeFrequency: "daily", priority: 0.85 },
  { path: "/brokers", changeFrequency: "weekly", priority: 0.75 },
  { path: "/copy", changeFrequency: "weekly", priority: 0.8 },
  { path: "/heatmap", changeFrequency: "weekly", priority: 0.65 },
  { path: "/vps", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.65 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/journal", changeFrequency: "monthly", priority: 0.55 },
  { path: "/alerts", changeFrequency: "monthly", priority: 0.5 },
  { path: "/kyc", changeFrequency: "monthly", priority: 0.45 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/risk-disclosure", changeFrequency: "monthly", priority: 0.3 },
];

export const ROBOTS_DISALLOW = [
  "/admin",
  "/admin/",
  "/api/",
  "/profile",
  "/dashboard",
  "/billing",
  "/notifications",
  "/referrals",
  "/affiliate",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/",
  "/design-system",
  "/animations",
];
