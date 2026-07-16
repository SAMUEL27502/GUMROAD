import readingTime from "reading-time";

export type BlogCategory =
  | "Guides"
  | "Risk"
  | "Markets"
  | "Infrastructure"
  | "Analytics"
  | "Product";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  updatedAt?: string;
  category: BlogCategory;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  content: string;
}

export const blogCategories: { name: BlogCategory; slug: string; description: string }[] = [
  { name: "Guides", slug: "guides", description: "How-to frameworks for evaluating and running EAs" },
  { name: "Risk", slug: "risk", description: "Capital allocation and drawdown control" },
  { name: "Markets", slug: "markets", description: "Sessions, pairs, and market conditions" },
  { name: "Infrastructure", slug: "infrastructure", description: "VPS, MT5, and uptime practices" },
  { name: "Analytics", slug: "analytics", description: "Metrics that matter for bot performance" },
  { name: "Product", slug: "product", description: "TradeBib platform updates" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "how-to-evaluate-mt5-bots",
    title: "How to Evaluate MT5 Bots Before You Subscribe",
    excerpt:
      "A practical framework for assessing drawdown, win rate, and live vs. backtested performance.",
    author: "TradeBib Editorial",
    date: "2026-07-10",
    updatedAt: "2026-07-12",
    category: "Guides",
    tags: ["MT5", "due-diligence", "ROI"],
    seoTitle: "How to Evaluate MT5 Bots Before Subscribing | TradeBib",
    seoDescription:
      "Assess drawdown, win rate, live vs backtested performance, and risk before you subscribe to any MetaTrader 5 Expert Advisor.",
    content: `
## Start with risk, not ROI

High advertised returns are meaningless without context. Before you subscribe to any MetaTrader 5 Expert Advisor, score the bot on **risk first**.

### Checklist

1. **Max drawdown** — Prefer systems with documented drawdown under your personal tolerance.
2. **Sample size** — At least several hundred live or verified trades.
3. **Live vs backtest** — Favor bots with verified live history, not only optimized backtests.
4. **Spread sensitivity** — Scalpers often fail on wide-spread brokers.
5. **Correlation** — Check how the bot behaves alongside your existing portfolio.

> Tip: On TradeBib, use the Compare page to overlay equity and drawdown curves side by side.

### A simple scoring model

| Factor | Weight | What good looks like |
| --- | --- | --- |
| Drawdown | 30% | Stable, disclosed, within advertised range |
| Win rate + PF | 25% | Consistent across months |
| Live track record | 25% | Verified MT5 sync |
| Cost / value | 20% | Price per 1% ROI is competitive |

### Next steps

- Browse the [marketplace](/marketplace)
- Run the [AI recommendation quiz](/recommend)
- Compare finalists on [/compare](/compare)
`.trim(),
  },
  {
    id: "b2",
    slug: "risk-management-for-ea-portfolios",
    title: "Risk Management for Multi-Bot EA Portfolios",
    excerpt:
      "Learn how to allocate capital across correlated strategies and set portfolio-level stop rules.",
    author: "Sarah Mitchell",
    date: "2026-07-05",
    category: "Risk",
    tags: ["portfolio", "drawdown", "allocation"],
    seoDescription:
      "Allocate capital across correlated Expert Advisors and set portfolio-level stop rules for safer automated trading.",
    content: `
## Why single-bot risk is not enough

Running three “medium risk” bots can still create **high portfolio risk** if they share the same pairs, sessions, or market regimes.

### Allocation rules

- Cap any single bot at **25–35%** of automation capital.
- Avoid stacking multiple high-frequency gold scalpers.
- Mix strategies: trend + mean reversion + range.
- Keep a cash buffer for margin and news spikes.

### Portfolio stop rules

1. Soft pause at **-8%** portfolio equity from peak.
2. Hard flatten at **-12%**.
3. Review correlation after any 5-day losing streak.

\`\`\`text
Portfolio DD = 1 - (Equity / Peak Equity)
\`\`\`

If two bots both trade XAUUSD during London open, treat them as one risk bucket.
`.trim(),
  },
  {
    id: "b3",
    slug: "gold-scalping-session-guide",
    title: "Gold Scalping: Best Sessions and Broker Conditions",
    excerpt:
      "When XAUUSD moves best, which spreads to avoid, and how verified bots handle volatility spikes.",
    author: "Marcus Chen",
    date: "2026-06-28",
    category: "Markets",
    tags: ["XAUUSD", "scalping", "sessions"],
    content: `
## Best windows for XAUUSD scalping

Gold tends to offer cleaner scalp conditions during:

- **London open**
- **London / New York overlap**

Avoid thin Asian liquidity unless your EA is specifically designed for range conditions.

### Broker conditions that matter

- Raw / ECN spreads
- Fast execution
- Transparent commission model
- Stable investor password sync for monitoring

### Volatility spikes

News events can double spreads in seconds. Verified bots usually:

1. Pause around high-impact events
2. Use max-spread filters
3. Reduce lot size when ATR expands
`.trim(),
  },
  {
    id: "b4",
    slug: "mt5-vps-deployment-tips",
    title: "MT5 VPS Deployment: 5 Tips for 24/7 Uptime",
    excerpt:
      "From broker proximity to auto-restart scripts — keep your Expert Advisors running reliably.",
    author: "TradeBib Editorial",
    date: "2026-06-20",
    category: "Infrastructure",
    tags: ["VPS", "MT5", "uptime"],
    content: `
## Keep EAs online

1. **Choose a VPS near your broker** to reduce latency.
2. **Disable sleep** and Windows updates during trading hours.
3. **Monitor investor sync** from TradeBib so you notice disconnects early.
4. **Use auto-restart** for terminal crashes.
5. **Separate demo and live** terminals to avoid mix-ups.

### Health checks

- Terminal running
- Algo trading enabled
- Internet stable
- Disk space available
- Clock synced to UTC
`.trim(),
  },
  {
    id: "b5",
    slug: "understanding-profit-factor",
    title: "Understanding Profit Factor and Why It Matters",
    excerpt:
      "Profit factor is more than a vanity metric. Here's how to interpret it across different strategies.",
    author: "Elena Kowalski",
    date: "2026-06-12",
    category: "Analytics",
    tags: ["profit-factor", "metrics", "analysis"],
    content: `
## What profit factor means

**Profit factor** = Gross profit / Gross loss

- \`1.0\` = break-even before costs
- \`1.3–1.6\` = often healthy for retail EAs
- \`2.0+\` = strong, but verify sample size and overfitting

### Strategy context

| Strategy | Typical PF | Watch for |
| --- | --- | --- |
| Scalping | 1.2–1.5 | Spreads & commissions |
| Trend | 1.4–2.0 | Long flat periods |
| Grid | Variable | Tail risk / margin |

A high profit factor with tiny trade count is not evidence — it is a warning.
`.trim(),
  },
  {
    id: "b6",
    slug: "tradebib-platform-update-july",
    title: "Platform Update: July 2026",
    excerpt:
      "New bot comparison tools, enhanced economic calendar, and improved MT5 sync reliability.",
    author: "TradeBib Team",
    date: "2026-07-01",
    category: "Product",
    tags: ["changelog", "product", "release"],
    content: `
## What's new in July

- **Bot Comparison** overlays for equity, ROI, and drawdown
- **AI Recommendations** based on risk, capital, style, and pairs
- **Notification Center** for bot, trade, subscription, and security alerts
- **Affiliate Dashboard** with clicks, conversions, commissions, and withdrawals
- More reliable **MT5 account sync**

### Try it

1. [Compare bots](/compare)
2. [Get recommendations](/recommend)
3. [Open notifications](/notifications)
`.trim(),
  },
];

export function getReadingTime(content: string) {
  const result = readingTime(content || "");
  const minutes = Math.max(1, Math.ceil(result.minutes));
  return {
    minutes,
    text: `${minutes} min read`,
    words: result.words,
  };
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: BlogCategory | "All") {
  if (category === "All") return blogPosts;
  return blogPosts.filter((p) => p.category === category);
}

export function searchBlogPosts(query: string, category: BlogCategory | "All" = "All") {
  const q = query.trim().toLowerCase();
  return getBlogPostsByCategory(category).filter((post) => {
    if (!q) return true;
    const haystack = [
      post.title,
      post.excerpt,
      post.author,
      post.category,
      post.tags.join(" "),
      post.content,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getCategorySlug(category: BlogCategory) {
  return blogCategories.find((c) => c.name === category)?.slug ?? category.toLowerCase();
}

export function getCategoryBySlug(slug: string) {
  return blogCategories.find((c) => c.slug === slug);
}

/** Back-compat card shape previously used from admin.ts */
export const blogPostsSummary = blogPosts.map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  author: post.author,
  date: post.date,
  category: post.category,
  readTime: getReadingTime(post.content).text,
}));
