export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Bot {
  id: string;
  slug: string;
  name: string;
  description: string;
  strategy: string;
  tradingPair: string;
  riskLevel: RiskLevel;
  roi: number;
  drawdown: number;
  winRate: number;
  profitFactor: number;
  subscribers: number;
  price: number;
  rating: number;
  imageGradient: string;
  /** Optional photo URL; falls back to gradient artwork when omitted */
  imageUrl?: string;
  verified: boolean;
  category: string;
  tags: string[];
  featured: boolean;
  monthlyReturns: { month: string; return: number }[];
  equityCurve: { date: string; equity: number }[];
  drawdownSeries: { date: string; drawdown: number }[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
  }[];
  faq: { question: string; answer: string }[];
}

export const bots: Bot[] = [
  {
    id: "1",
    slug: "goldscalper-pro",
    name: "GoldScalper Pro",
    description:
      "High-frequency gold scalper optimized for XAUUSD sessions with adaptive spread filters and multi-timeframe confirmation.",
    strategy: "Scalping",
    tradingPair: "XAUUSD",
    riskLevel: "HIGH",
    roi: 18.4,
    drawdown: 12.2,
    winRate: 71.5,
    profitFactor: 1.92,
    subscribers: 2840,
    price: 79,
    rating: 4.8,
    imageGradient: "from-amber-500/40 via-yellow-600/20 to-orange-900/40",
    verified: true,
    category: "Metals",
    tags: ["Gold", "Scalping", "Intraday"],
    featured: true,
    monthlyReturns: [
      { month: "Jan", return: 4.2 },
      { month: "Feb", return: 3.1 },
      { month: "Mar", return: 5.8 },
      { month: "Apr", return: 2.4 },
      { month: "May", return: 6.1 },
      { month: "Jun", return: 3.9 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10420 },
      { date: "Mar", equity: 10743 },
      { date: "Apr", equity: 11366 },
      { date: "May", equity: 11639 },
      { date: "Jun", equity: 12349 },
      { date: "Jul", equity: 12830 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -2.1 },
      { date: "Feb", drawdown: -4.5 },
      { date: "Mar", drawdown: -3.2 },
      { date: "Apr", drawdown: -8.1 },
      { date: "May", drawdown: -5.4 },
      { date: "Jun", drawdown: -12.2 },
      { date: "Jul", drawdown: -6.8 },
    ],
    reviews: [
      {
        id: "r1",
        author: "Marcus T.",
        rating: 5,
        title: "Consistent gold scalps",
        content:
          "Been running this for 3 months on a small live account. Drawdowns are manageable and the win rate holds up.",
        date: "2026-05-12",
      },
      {
        id: "r2",
        author: "Elena K.",
        rating: 4,
        title: "Strong but needs low spreads",
        content: "Works best with ECN brokers. Avoid high-spread sessions around news.",
        date: "2026-04-28",
      },
    ],
    faq: [
      {
        question: "What timeframe does GoldScalper Pro use?",
        answer: "Primarily M1 and M5 with H1 trend filter confirmation.",
      },
      {
        question: "Minimum deposit recommended?",
        answer: "We recommend at least $500 with 1:100 leverage for proper risk sizing.",
      },
    ],
  },
  {
    id: "2",
    slug: "eurotrend-ai",
    name: "EuroTrend AI",
    description:
      "AI-assisted EURUSD trend follower that combines LSTM signals with classic structure breaks and ATR-based trailing stops.",
    strategy: "Trend Following",
    tradingPair: "EURUSD",
    riskLevel: "MEDIUM",
    roi: 11.2,
    drawdown: 8.4,
    winRate: 58.3,
    profitFactor: 1.74,
    subscribers: 4120,
    price: 49,
    rating: 4.7,
    imageGradient: "from-sky-500/40 via-blue-600/20 to-indigo-900/40",
    verified: true,
    category: "Forex",
    tags: ["EURUSD", "AI", "Trend"],
    featured: true,
    monthlyReturns: [
      { month: "Jan", return: 2.1 },
      { month: "Feb", return: 1.8 },
      { month: "Mar", return: 3.4 },
      { month: "Apr", return: 1.2 },
      { month: "May", return: 2.9 },
      { month: "Jun", return: 2.0 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10210 },
      { date: "Mar", equity: 10394 },
      { date: "Apr", equity: 10747 },
      { date: "May", equity: 10876 },
      { date: "Jun", equity: 11191 },
      { date: "Jul", equity: 11415 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -1.2 },
      { date: "Feb", drawdown: -3.4 },
      { date: "Mar", drawdown: -2.1 },
      { date: "Apr", drawdown: -5.6 },
      { date: "May", drawdown: -4.2 },
      { date: "Jun", drawdown: -8.4 },
      { date: "Jul", drawdown: -3.9 },
    ],
    reviews: [
      {
        id: "r3",
        author: "James L.",
        rating: 5,
        title: "Smooth equity curve",
        content: "One of the cleaner trend EAs I've tried. Good risk controls.",
        date: "2026-06-02",
      },
    ],
    faq: [
      {
        question: "Does it trade during news?",
        answer: "It pauses entries 30 minutes before and after high-impact USD/EUR events.",
      },
    ],
  },
  {
    id: "3",
    slug: "nightowl-grid",
    name: "NightOwl Grid",
    description:
      "Asian-session grid strategy designed for low-volatility ranges with soft recovery logic and equity protection.",
    strategy: "Grid",
    tradingPair: "USDJPY",
    riskLevel: "MEDIUM",
    roi: 9.6,
    drawdown: 14.1,
    winRate: 82.1,
    profitFactor: 1.45,
    subscribers: 1890,
    price: 39,
    rating: 4.4,
    imageGradient: "from-violet-500/30 via-slate-700/40 to-blue-900/40",
    verified: true,
    category: "Forex",
    tags: ["Grid", "Asian Session", "USDJPY"],
    featured: true,
    monthlyReturns: [
      { month: "Jan", return: 1.5 },
      { month: "Feb", return: 2.2 },
      { month: "Mar", return: 1.1 },
      { month: "Apr", return: 2.8 },
      { month: "May", return: 0.9 },
      { month: "Jun", return: 1.7 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10150 },
      { date: "Mar", equity: 10373 },
      { date: "Apr", equity: 10487 },
      { date: "May", equity: 10781 },
      { date: "Jun", equity: 10878 },
      { date: "Jul", equity: 11063 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -3.1 },
      { date: "Feb", drawdown: -6.2 },
      { date: "Mar", drawdown: -9.4 },
      { date: "Apr", drawdown: -5.1 },
      { date: "May", drawdown: -14.1 },
      { date: "Jun", drawdown: -7.8 },
      { date: "Jul", drawdown: -4.5 },
    ],
    reviews: [
      {
        id: "r4",
        author: "Yuki S.",
        rating: 4,
        title: "Quiet overnight profits",
        content: "Great for set-and-forget overnight trading on JPY pairs.",
        date: "2026-03-19",
      },
    ],
    faq: [
      {
        question: "Is martingale used?",
        answer: "No hard martingale. Soft grid spacing with max basket size limits.",
      },
    ],
  },
  {
    id: "4",
    slug: "silverbullet-rsi",
    name: "SilverBullet RSI",
    description:
      "Mean-reversion RSI system for silver with divergence detection and session-based filters.",
    strategy: "Mean Reversion",
    tradingPair: "XAGUSD",
    riskLevel: "MEDIUM",
    roi: 13.8,
    drawdown: 10.5,
    winRate: 64.2,
    profitFactor: 1.68,
    subscribers: 1560,
    price: 45,
    rating: 4.5,
    imageGradient: "from-slate-400/40 via-zinc-600/30 to-slate-900/50",
    verified: true,
    category: "Metals",
    tags: ["Silver", "RSI", "Mean Reversion"],
    featured: false,
    monthlyReturns: [
      { month: "Jan", return: 2.8 },
      { month: "Feb", return: 1.9 },
      { month: "Mar", return: 3.2 },
      { month: "Apr", return: 2.1 },
      { month: "May", return: 2.4 },
      { month: "Jun", return: 1.6 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10280 },
      { date: "Mar", equity: 10475 },
      { date: "Apr", equity: 10810 },
      { date: "May", equity: 11037 },
      { date: "Jun", equity: 11302 },
      { date: "Jul", equity: 11483 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -2.4 },
      { date: "Feb", drawdown: -5.1 },
      { date: "Mar", drawdown: -3.8 },
      { date: "Apr", drawdown: -10.5 },
      { date: "May", drawdown: -6.2 },
      { date: "Jun", drawdown: -4.1 },
      { date: "Jul", drawdown: -3.3 },
    ],
    reviews: [],
    faq: [
      {
        question: "Best broker conditions?",
        answer: "Low commission metals accounts with tight XAGUSD spreads.",
      },
    ],
  },
  {
    id: "5",
    slug: "cryptoforex-hybrid",
    name: "CryptoForex Hybrid",
    description:
      "Cross-asset hybrid that hedges BTCUSD momentum with correlated forex pairs for smoother equity.",
    strategy: "Hybrid",
    tradingPair: "BTCUSD",
    riskLevel: "HIGH",
    roi: 22.1,
    drawdown: 18.7,
    winRate: 54.8,
    profitFactor: 1.81,
    subscribers: 980,
    price: 99,
    rating: 4.3,
    imageGradient: "from-orange-500/40 via-rose-600/20 to-amber-900/40",
    verified: false,
    category: "Crypto",
    tags: ["BTC", "Hybrid", "Momentum"],
    featured: true,
    monthlyReturns: [
      { month: "Jan", return: 5.1 },
      { month: "Feb", return: -1.2 },
      { month: "Mar", return: 7.4 },
      { month: "Apr", return: 3.2 },
      { month: "May", return: 4.8 },
      { month: "Jun", return: 2.1 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10510 },
      { date: "Mar", equity: 10384 },
      { date: "Apr", equity: 11152 },
      { date: "May", equity: 11509 },
      { date: "Jun", equity: 12061 },
      { date: "Jul", equity: 12314 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -4.2 },
      { date: "Feb", drawdown: -11.5 },
      { date: "Mar", drawdown: -8.1 },
      { date: "Apr", drawdown: -18.7 },
      { date: "May", drawdown: -9.4 },
      { date: "Jun", drawdown: -6.2 },
      { date: "Jul", drawdown: -5.1 },
    ],
    reviews: [
      {
        id: "r5",
        author: "Alex R.",
        rating: 4,
        title: "Volatile but rewarding",
        content: "Expect swings. Position sizing is everything with this one.",
        date: "2026-05-30",
      },
    ],
    faq: [
      {
        question: "Is crypto CFDs supported?",
        answer: "Yes — designed for MT5 crypto CFDs with 24/7 sessions.",
      },
    ],
  },
  {
    id: "6",
    slug: "dollarhedge-ea",
    name: "DollarHedge EA",
    description:
      "USD basket hedger that balances DXY exposure across majors for portfolio-level risk reduction.",
    strategy: "Hedging",
    tradingPair: "USD Basket",
    riskLevel: "LOW",
    roi: 6.4,
    drawdown: 4.2,
    winRate: 61.0,
    profitFactor: 1.52,
    subscribers: 3210,
    price: 29,
    rating: 4.6,
    imageGradient: "from-emerald-500/30 via-teal-700/20 to-slate-900/50",
    verified: true,
    category: "Forex",
    tags: ["Hedge", "USD", "Portfolio"],
    featured: false,
    monthlyReturns: [
      { month: "Jan", return: 0.9 },
      { month: "Feb", return: 1.1 },
      { month: "Mar", return: 0.8 },
      { month: "Apr", return: 1.4 },
      { month: "May", return: 1.0 },
      { month: "Jun", return: 0.7 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10090 },
      { date: "Mar", equity: 10201 },
      { date: "Apr", equity: 10283 },
      { date: "May", equity: 10427 },
      { date: "Jun", equity: 10531 },
      { date: "Jul", equity: 10605 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -1.1 },
      { date: "Feb", drawdown: -2.4 },
      { date: "Mar", drawdown: -1.8 },
      { date: "Apr", drawdown: -4.2 },
      { date: "May", drawdown: -2.1 },
      { date: "Jun", drawdown: -1.5 },
      { date: "Jul", drawdown: -1.2 },
    ],
    reviews: [],
    faq: [
      {
        question: "Can this run alongside other bots?",
        answer: "Yes — it's designed as a portfolio overlay with low correlation.",
      },
    ],
  },
  {
    id: "7",
    slug: "asian-range-trader",
    name: "Asian Range Trader",
    description:
      "Range-bound breakout fade for AUDUSD during Tokyo session with volume profile confirmation.",
    strategy: "Range",
    tradingPair: "AUDUSD",
    riskLevel: "LOW",
    roi: 7.9,
    drawdown: 5.8,
    winRate: 68.4,
    profitFactor: 1.61,
    subscribers: 2240,
    price: 35,
    rating: 4.5,
    imageGradient: "from-cyan-500/30 via-sky-700/20 to-slate-900/50",
    verified: true,
    category: "Forex",
    tags: ["Range", "Asian Session", "AUDUSD"],
    featured: false,
    monthlyReturns: [
      { month: "Jan", return: 1.2 },
      { month: "Feb", return: 1.5 },
      { month: "Mar", return: 0.9 },
      { month: "Apr", return: 1.8 },
      { month: "May", return: 1.1 },
      { month: "Jun", return: 1.3 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10120 },
      { date: "Mar", equity: 10272 },
      { date: "Apr", equity: 10364 },
      { date: "May", equity: 10551 },
      { date: "Jun", equity: 10667 },
      { date: "Jul", equity: 10806 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -1.4 },
      { date: "Feb", drawdown: -3.2 },
      { date: "Mar", drawdown: -2.1 },
      { date: "Apr", drawdown: -5.8 },
      { date: "May", drawdown: -2.9 },
      { date: "Jun", drawdown: -2.0 },
      { date: "Jul", drawdown: -1.6 },
    ],
    reviews: [],
    faq: [
      {
        question: "Active hours?",
        answer: "Primarily 00:00–08:00 GMT during Asian range formation.",
      },
    ],
  },
  {
    id: "8",
    slug: "breakouthunter",
    name: "BreakoutHunter",
    description:
      "Volatility expansion hunter for GBPUSD London open with fakeout filters and trailing profit locks.",
    strategy: "Breakout",
    tradingPair: "GBPUSD",
    riskLevel: "HIGH",
    roi: 15.6,
    drawdown: 13.9,
    winRate: 49.2,
    profitFactor: 1.88,
    subscribers: 1750,
    price: 59,
    rating: 4.4,
    imageGradient: "from-rose-500/40 via-red-700/20 to-slate-900/50",
    verified: true,
    category: "Forex",
    tags: ["Breakout", "London", "GBPUSD"],
    featured: true,
    monthlyReturns: [
      { month: "Jan", return: 3.4 },
      { month: "Feb", return: 2.1 },
      { month: "Mar", return: 4.2 },
      { month: "Apr", return: 1.5 },
      { month: "May", return: 3.8 },
      { month: "Jun", return: 2.2 },
    ],
    equityCurve: [
      { date: "Jan", equity: 10000 },
      { date: "Feb", equity: 10340 },
      { date: "Mar", equity: 10557 },
      { date: "Apr", equity: 11000 },
      { date: "May", equity: 11165 },
      { date: "Jun", equity: 11589 },
      { date: "Jul", equity: 11844 },
    ],
    drawdownSeries: [
      { date: "Jan", drawdown: -3.8 },
      { date: "Feb", drawdown: -7.2 },
      { date: "Mar", drawdown: -5.1 },
      { date: "Apr", drawdown: -13.9 },
      { date: "May", drawdown: -8.4 },
      { date: "Jun", drawdown: -6.1 },
      { date: "Jul", drawdown: -4.7 },
    ],
    reviews: [
      {
        id: "r6",
        author: "Priya N.",
        rating: 5,
        title: "Catches London moves",
        content: "When GBP expands, this EA is on it. Worth the risk for active traders.",
        date: "2026-06-10",
      },
    ],
    faq: [
      {
        question: "News filter?",
        answer: "Skips Bank of England and high-impact GBP releases automatically.",
      },
    ],
  },
];

export function getBotBySlug(slug: string) {
  return bots.find((b) => b.slug === slug);
}

export function getFeaturedBots() {
  return bots.filter((b) => b.featured);
}
