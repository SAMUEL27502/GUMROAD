import { bots, type Bot } from "@/lib/data/bots";

export type LeaderboardTrader = {
  id: string;
  rank: number;
  name: string;
  handle: string;
  /** URL slug without @ */
  slug: string;
  roi: number;
  profit: number;
  bots: number;
  followers: number;
  winRate: number;
  country: string;
  verified: boolean;
  bio?: string;
  joinedAt?: string;
  strategies?: string[];
};

export type LeaderboardBotEntry = {
  rank: number;
  bot: Bot;
  score: number;
  profitEstimate: number;
};

export const topTraders: LeaderboardTrader[] = [
  {
    id: "t1",
    rank: 1,
    name: "NovaCapital",
    handle: "@novacapital",
    slug: "novacapital",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 42.8,
    profit: 128400,
    bots: 6,
    followers: 1820,
    winRate: 68.4,
    country: "SG",
    verified: true,
  },
  {
    id: "t2",
    rank: 2,
    name: "TokyoRange",
    handle: "@tokyorange",
    slug: "tokyorange",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 36.2,
    profit: 96400,
    bots: 4,
    followers: 1240,
    winRate: 71.2,
    country: "JP",
    verified: true,
  },
  {
    id: "t3",
    rank: 3,
    name: "GoldEdge",
    handle: "@goldedge",
    slug: "goldedge",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 31.5,
    profit: 87200,
    bots: 3,
    followers: 980,
    winRate: 64.8,
    country: "AE",
    verified: true,
  },
  {
    id: "t4",
    rank: 4,
    name: "LondonBreak",
    handle: "@londonbreak",
    slug: "londonbreak",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 28.1,
    profit: 71500,
    bots: 5,
    followers: 760,
    winRate: 62.1,
    country: "GB",
    verified: false,
  },
  {
    id: "t5",
    rank: 5,
    name: "QuietGrid",
    handle: "@quietgrid",
    slug: "quietgrid",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 24.4,
    profit: 58300,
    bots: 2,
    followers: 640,
    winRate: 74.5,
    country: "DE",
    verified: true,
  },
  {
    id: "t6",
    rank: 6,
    name: "AuroraFX",
    handle: "@aurorafx",
    slug: "aurorafx",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 22.9,
    profit: 54100,
    bots: 4,
    followers: 2110,
    winRate: 59.6,
    country: "CA",
    verified: true,
  },
  {
    id: "t7",
    rank: 7,
    name: "PulseScalper",
    handle: "@pulsescalper",
    slug: "pulsescalper",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 21.3,
    profit: 49800,
    bots: 3,
    followers: 1540,
    winRate: 66.0,
    country: "US",
    verified: false,
  },
  {
    id: "t8",
    rank: 8,
    name: "NordicSwing",
    handle: "@nordicswing",
    slug: "nordicswing",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 19.7,
    profit: 45200,
    bots: 2,
    followers: 890,
    winRate: 70.3,
    country: "SE",
    verified: true,
  },
  {
    id: "t9",
    rank: 9,
    name: "DesertTrend",
    handle: "@deserttrend",
    slug: "deserttrend",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 18.2,
    profit: 38900,
    bots: 5,
    followers: 1320,
    winRate: 61.4,
    country: "ZA",
    verified: false,
  },
  {
    id: "t10",
    rank: 10,
    name: "HarborEA",
    handle: "@harborea",
    slug: "harborea",
    bio: "Public TradeBib trader focused on verified MT5 automation and risk-aware growth.",
    joinedAt: "2025-11-01",
    strategies: ["Trend", "Scalping"],
    roi: 16.8,
    profit: 34100,
    bots: 3,
    followers: 720,
    winRate: 63.9,
    country: "AU",
    verified: true,
  },
];

/** @deprecated Prefer `topTraders` — kept for older imports */
export const leaderboard = topTraders.map(({ rank, name, roi, bots, followers }) => ({
  rank,
  name,
  roi,
  bots,
  followers,
}));

function botScore(bot: Bot) {
  return Number(
    (bot.roi * 2.2 + bot.rating * 12 + Math.log10(bot.subscribers + 10) * 8 + bot.winRate * 0.35).toFixed(1)
  );
}

function profitEstimate(bot: Bot) {
  // Demo monthly P&L proxy from ROI × subscriber base
  return Math.round(bot.roi * bot.subscribers * 0.85);
}

export function getTopBots(limit = 10): LeaderboardBotEntry[] {
  return [...bots]
    .map((bot) => ({
      bot,
      score: botScore(bot),
      profitEstimate: profitEstimate(bot),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function getMostProfitableBots(limit = 10): LeaderboardBotEntry[] {
  return [...bots]
    .map((bot) => ({
      bot,
      score: bot.roi,
      profitEstimate: profitEstimate(bot),
      rank: 0,
    }))
    .sort((a, b) => b.bot.roi - a.bot.roi || b.profitEstimate - a.profitEstimate)
    .slice(0, limit)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function getMostFollowedBots(limit = 10): LeaderboardBotEntry[] {
  return [...bots]
    .map((bot) => ({
      bot,
      score: bot.subscribers,
      profitEstimate: profitEstimate(bot),
      rank: 0,
    }))
    .sort((a, b) => b.bot.subscribers - a.bot.subscribers)
    .slice(0, limit)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export function getMostProfitableTraders(limit = 10): LeaderboardTrader[] {
  return [...topTraders]
    .sort((a, b) => b.profit - a.profit || b.roi - a.roi)
    .slice(0, limit)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

export function getMostFollowedTraders(limit = 10): LeaderboardTrader[] {
  return [...topTraders]
    .sort((a, b) => b.followers - a.followers || b.roi - a.roi)
    .slice(0, limit)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}


export function getTraderBySlug(slug: string) {
  const normalized = slug.replace(/^@/, "").toLowerCase();
  return topTraders.find((t) => t.slug === normalized || t.handle.replace("@", "") === normalized);
}

export function getTraderByHandle(handle: string) {
  return getTraderBySlug(handle);
}
