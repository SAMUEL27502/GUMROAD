import { bots, type Bot, type RiskLevel } from "@/lib/data/bots";

export type RiskTolerance = RiskLevel;
export type CapitalBand = "under500" | "500to2000" | "2000to10000" | "10000plus";
export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const TRADING_STYLES = [
  "Scalping",
  "Trend Following",
  "Grid",
  "Mean Reversion",
  "Swing",
  "Breakout",
  "Hedging",
  "Range",
  "Hybrid",
] as const;

export type TradingStyle = (typeof TRADING_STYLES)[number];

export const FAVORITE_PAIRS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "NZDUSD",
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "ETHUSD",
  "NAS100",
  "US30",
] as const;

export type FavoritePair = (typeof FAVORITE_PAIRS)[number];

export interface RecommendationInput {
  riskTolerance: RiskTolerance;
  capital: CapitalBand;
  experience: ExperienceLevel;
  tradingStyles: string[];
  favoritePairs: string[];
}

export interface ScoreBreakdown {
  risk: number;
  capital: number;
  experience: number;
  style: number;
  pairs: number;
}

export interface RecommendationMatch {
  bot: Bot;
  score: number;
  matchPercent: number;
  reasons: string[];
  breakdown: ScoreBreakdown;
}

const WEIGHTS = {
  risk: 0.3,
  capital: 0.15,
  experience: 0.2,
  style: 0.2,
  pairs: 0.15,
} as const;

const STYLE_ALIASES: Record<string, string[]> = {
  Scalping: ["Scalping"],
  "Trend Following": ["Trend Following", "Swing"],
  Grid: ["Grid"],
  "Mean Reversion": ["Mean Reversion", "Range"],
  Swing: ["Trend Following", "Swing", "Range"],
  Breakout: ["Breakout"],
  Hedging: ["Hedging"],
  Range: ["Range", "Mean Reversion"],
  Hybrid: ["Hybrid", "AI Hybrid"],
};

const BEGINNER_FRIENDLY = new Set(["Trend Following", "Range", "Hedging", "Mean Reversion"]);
const ADVANCED_STYLES = new Set(["Scalping", "Grid", "Breakout", "Hybrid"]);

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function riskDistance(a: RiskLevel, b: RiskLevel): number {
  const order: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];
  return Math.abs(order.indexOf(a) - order.indexOf(b));
}

function normalizePair(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function pairTokens(bot: Bot): string[] {
  const tokens = new Set<string>();
  tokens.add(normalizePair(bot.tradingPair));
  for (const tag of bot.tags) {
    tokens.add(normalizePair(tag));
  }
  // Soft aliases for multi-pair / basket bots
  if (bot.tradingPair.toLowerCase().includes("basket") || bot.category === "Forex") {
    for (const p of ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD"]) {
      if (bot.tradingPair.toLowerCase().includes("basket")) tokens.add(p);
    }
  }
  if (bot.category === "Metals") {
    tokens.add("XAUUSD");
    tokens.add("XAGUSD");
    tokens.add("GOLD");
    tokens.add("SILVER");
  }
  if (bot.category === "Crypto") {
    tokens.add("BTCUSD");
    tokens.add("ETHUSD");
  }
  return [...tokens];
}

function scoreRisk(bot: Bot, riskTolerance: RiskTolerance): { score: number; reason?: string } {
  const dist = riskDistance(bot.riskLevel, riskTolerance);
  let score = dist === 0 ? 100 : dist === 1 ? 55 : 15;

  // Drawdown finesse: lower drawdown favored for conservative traders
  if (riskTolerance === "LOW") {
    if (bot.drawdown <= 6) score += 10;
    else if (bot.drawdown >= 12) score -= 20;
  } else if (riskTolerance === "HIGH") {
    if (bot.roi >= 15) score += 8;
  }

  score = clamp(score);
  const reason =
    dist === 0
      ? `Matches your ${riskTolerance.toLowerCase()} risk tolerance`
      : dist === 1
        ? `Nearby risk profile (${bot.riskLevel})`
        : undefined;

  return { score, reason };
}

function scoreCapital(bot: Bot, capital: CapitalBand): { score: number; reason?: string } {
  const price = bot.price;
  let score = 50;
  let reason: string | undefined;

  switch (capital) {
    case "under500":
      score = price <= 35 ? 100 : price <= 50 ? 70 : price <= 65 ? 35 : 10;
      if (bot.riskLevel === "HIGH") score -= 25;
      if (bot.drawdown > 10) score -= 15;
      if (score >= 70) reason = "Fits smaller account size and pricing";
      break;
    case "500to2000":
      score = price <= 50 ? 95 : price <= 70 ? 80 : 55;
      if (score >= 75) reason = "Subscription cost fits mid-size capital";
      break;
    case "2000to10000":
      score = price <= 90 ? 90 : 75;
      if (bot.roi >= 12) score += 8;
      reason = "Capital supports this bot’s pricing tier";
      break;
    case "10000plus":
      score = 85 + Math.min(15, Math.round(bot.rating * 2));
      if (bot.verified) score += 5;
      reason = "Premium capital can run higher-tier EAs";
      break;
  }

  return { score: clamp(score), reason };
}

function scoreExperience(
  bot: Bot,
  experience: ExperienceLevel
): { score: number; reason?: string } {
  let score = 50;
  let reason: string | undefined;

  if (experience === "BEGINNER") {
    score = 40;
    if (bot.riskLevel === "LOW") score += 35;
    else if (bot.riskLevel === "MEDIUM") score += 15;
    else score -= 25;

    if (BEGINNER_FRIENDLY.has(bot.strategy)) score += 20;
    if (ADVANCED_STYLES.has(bot.strategy)) score -= 15;
    if (bot.drawdown <= 8) score += 10;
    if (bot.verified) score += 5;
    if (score >= 70) reason = "Beginner-friendly risk and strategy profile";
  } else if (experience === "INTERMEDIATE") {
    score = 70;
    if (bot.riskLevel === "MEDIUM") score += 20;
    else if (bot.riskLevel === "LOW" || bot.riskLevel === "HIGH") score += 8;
    if (bot.winRate >= 60) score += 5;
    reason = "Balanced profile for intermediate traders";
  } else {
    score = 65;
    if (bot.riskLevel === "HIGH") score += 20;
    if (ADVANCED_STYLES.has(bot.strategy)) score += 15;
    if (bot.roi >= 14) score += 10;
    if (bot.profitFactor >= 1.7) score += 5;
    reason = "Advanced strategy with stronger return profile";
  }

  return { score: clamp(score), reason };
}

function scoreStyle(bot: Bot, tradingStyles: string[]): { score: number; reason?: string } {
  if (!tradingStyles.length) return { score: 50 };

  const botStyle = bot.strategy.toLowerCase();
  const botTags = bot.tags.map((t) => t.toLowerCase());

  let best = 0;
  let matched: string | undefined;

  for (const style of tradingStyles) {
    const aliases = STYLE_ALIASES[style] ?? [style];
    for (const alias of aliases) {
      const a = alias.toLowerCase();
      if (botStyle === a || botStyle.includes(a) || a.includes(botStyle)) {
        best = Math.max(best, 100);
        matched = style;
      } else if (botTags.some((t) => t === a || t.includes(a))) {
        best = Math.max(best, 80);
        matched = matched ?? style;
      }
    }
  }

  if (best === 0) {
    // Partial credit for related families
    if (
      tradingStyles.includes("Swing") &&
      (bot.strategy === "Trend Following" || bot.strategy === "Range")
    ) {
      best = 65;
      matched = "Swing";
    }
  }

  return {
    score: best || 20,
    reason: matched ? `Aligns with your ${matched} style` : undefined,
  };
}

function scorePairs(bot: Bot, favoritePairs: string[]): { score: number; reason?: string } {
  if (!favoritePairs.length) return { score: 50 };

  const tokens = pairTokens(bot);
  const favorites = favoritePairs.map(normalizePair);

  const hits = favorites.filter((fav) =>
    tokens.some((t) => t === fav || t.includes(fav) || fav.includes(t))
  );

  if (hits.length === 0) {
    // Category soft match: forex majors vs forex bot
    const wantsMetals = favorites.some((f) => f.includes("XAU") || f.includes("XAG") || f === "GOLD");
    const wantsCrypto = favorites.some((f) => f.includes("BTC") || f.includes("ETH"));
    if (wantsMetals && bot.category === "Metals") {
      return { score: 55, reason: "Same metals category as your preferred pairs" };
    }
    if (wantsCrypto && bot.category === "Crypto") {
      return { score: 55, reason: "Same crypto category as your preferred pairs" };
    }
    return { score: 18 };
  }

  const ratio = hits.length / favorites.length;
  const score = clamp(55 + ratio * 45 + (hits.includes(normalizePair(bot.tradingPair)) ? 10 : 0));
  return {
    score,
    reason: `Trades ${bot.tradingPair}, matching your preferred pairs`,
  };
}

export function scoreBot(bot: Bot, input: RecommendationInput): RecommendationMatch {
  const risk = scoreRisk(bot, input.riskTolerance);
  const capital = scoreCapital(bot, input.capital);
  const experience = scoreExperience(bot, input.experience);
  const style = scoreStyle(bot, input.tradingStyles);
  const pairs = scorePairs(bot, input.favoritePairs);

  const breakdown: ScoreBreakdown = {
    risk: risk.score,
    capital: capital.score,
    experience: experience.score,
    style: style.score,
    pairs: pairs.score,
  };

  const weighted =
    breakdown.risk * WEIGHTS.risk +
    breakdown.capital * WEIGHTS.capital +
    breakdown.experience * WEIGHTS.experience +
    breakdown.style * WEIGHTS.style +
    breakdown.pairs * WEIGHTS.pairs;

  // Soft boosts for quality signals
  let quality = 0;
  if (bot.verified) quality += 2;
  if (bot.rating >= 4.6) quality += 2;
  if (bot.featured) quality += 1;

  const score = clamp(weighted + quality);
  const reasons = [risk.reason, capital.reason, experience.reason, style.reason, pairs.reason].filter(
    Boolean
  ) as string[];

  return {
    bot,
    score: Number(score.toFixed(1)),
    matchPercent: Math.round(score),
    reasons: reasons.slice(0, 4),
    breakdown,
  };
}

export function recommendBots(
  input: RecommendationInput,
  options?: { catalog?: Bot[]; limit?: number; minScore?: number }
): RecommendationMatch[] {
  const catalog = options?.catalog ?? bots;
  const limit = options?.limit ?? 6;
  const minScore = options?.minScore ?? 0;

  return catalog
    .map((bot) => scoreBot(bot, input))
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score || b.bot.rating - a.bot.rating)
    .slice(0, limit);
}

export function defaultRecommendationInput(): RecommendationInput {
  return {
    riskTolerance: "MEDIUM",
    capital: "500to2000",
    experience: "INTERMEDIATE",
    tradingStyles: [],
    favoritePairs: [],
  };
}

export const CAPITAL_OPTIONS: { value: CapitalBand; label: string; hint: string }[] = [
  { value: "under500", label: "Under $500", hint: "Lean EAs, lower risk preferred" },
  { value: "500to2000", label: "$500 – $2,000", hint: "Most retail setups" },
  { value: "2000to10000", label: "$2,000 – $10,000", hint: "Room for mid/premium bots" },
  { value: "10000plus", label: "$10,000+", hint: "Full marketplace access" },
];

export const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; hint: string }[] = [
  { value: "BEGINNER", label: "Beginner", hint: "Prefer stable, lower-risk systems" },
  { value: "INTERMEDIATE", label: "Intermediate", hint: "Comfortable with balanced risk" },
  { value: "ADVANCED", label: "Advanced", hint: "Ready for aggressive strategies" },
];

export const RISK_OPTIONS: { value: RiskTolerance; label: string; hint: string }[] = [
  { value: "LOW", label: "Conservative", hint: "Protect capital, smaller swings" },
  { value: "MEDIUM", label: "Balanced", hint: "Mix of growth and control" },
  { value: "HIGH", label: "Aggressive", hint: "Higher ROI, larger drawdowns OK" },
];
