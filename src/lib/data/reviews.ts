export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface BotReview {
  id: string;
  botId: string;
  botSlug: string;
  botName: string;
  userId: string;
  author: string;
  rating: ReviewRating;
  title: string;
  content: string;
  helpfulCount: number;
  helpfulVotedBy: string[];
  verifiedOwner: boolean;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  botId: string;
  botSlug: string;
  botName: string;
  userId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  verifiedOwner: boolean;
}

/** Seed reviews derived from marketplace bots (approved + some pending). */
export const seedReviews: BotReview[] = [
  {
    id: "rev-gold-1",
    botId: "1",
    botSlug: "goldscalper-pro",
    botName: "GoldScalper Pro",
    userId: "user-marcus",
    author: "Marcus T.",
    rating: 5,
    title: "Consistent gold scalps",
    content:
      "Been running this for 3 months on a small live account. Drawdowns are manageable and the win rate holds up.",
    helpfulCount: 18,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-05-12",
    updatedAt: "2026-05-12",
  },
  {
    id: "rev-gold-2",
    botId: "1",
    botSlug: "goldscalper-pro",
    botName: "GoldScalper Pro",
    userId: "user-elena",
    author: "Elena K.",
    rating: 4,
    title: "Strong but needs low spreads",
    content: "Works best with ECN brokers. Avoid high-spread sessions around news.",
    helpfulCount: 11,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-04-28",
    updatedAt: "2026-04-28",
  },
  {
    id: "rev-euro-1",
    botId: "2",
    botSlug: "eurotrend-ai",
    botName: "EuroTrend AI",
    userId: "user-james",
    author: "James L.",
    rating: 5,
    title: "Steady EURUSD trends",
    content: "Good risk control. Occasional misses on news days, but overall solid.",
    helpfulCount: 9,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    id: "rev-euro-2",
    botId: "2",
    botSlug: "eurotrend-ai",
    botName: "EuroTrend AI",
    userId: "user-priya",
    author: "Priya N.",
    rating: 4,
    title: "Great for beginners",
    content: "Clear strategy and reasonable drawdown. Easy to leave running overnight.",
    helpfulCount: 7,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-05-20",
    updatedAt: "2026-05-20",
  },
  {
    id: "rev-owl-1",
    botId: "3",
    botSlug: "nightowl-grid",
    botName: "NightOwl Grid",
    userId: "user-sam",
    author: "Sam R.",
    rating: 5,
    title: "Quiet overnight profits",
    content: "Works well on demo and live with investor sync. Grid spacing is sensible.",
    helpfulCount: 14,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-06-18",
    updatedAt: "2026-06-18",
  },
  {
    id: "rev-silver-1",
    botId: "4",
    botSlug: "silverbullet-rsi",
    botName: "SilverBullet RSI",
    userId: "user-ana",
    author: "Ana M.",
    rating: 4,
    title: "Solid mean reversion",
    content: "Silver sessions are choppy but the RSI filters keep false signals down.",
    helpfulCount: 5,
    helpfulVotedBy: [],
    verifiedOwner: false,
    approved: true,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    id: "rev-crypto-1",
    botId: "5",
    botSlug: "cryptoforex-hybrid",
    botName: "CryptoForex Hybrid",
    userId: "user-devon",
    author: "Devon C.",
    rating: 3,
    title: "Volatile but interesting",
    content: "Needs wider stops. Performance swings with BTC volatility.",
    helpfulCount: 3,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: true,
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "rev-break-1",
    botId: "8",
    botSlug: "breakouthunter",
    botName: "BreakoutHunter",
    userId: "user-kai",
    author: "Kai W.",
    rating: 3,
    title: "Needs more filters",
    content: "False breakouts during Asian range. Otherwise OK on London open.",
    helpfulCount: 2,
    helpfulVotedBy: [],
    verifiedOwner: true,
    approved: false,
    createdAt: "2026-07-12",
    updatedAt: "2026-07-12",
  },
];

export function averageRating(reviews: BotReview[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

export function ratingDistribution(reviews: BotReview[]): Record<ReviewRating, number> {
  const dist: Record<ReviewRating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    dist[r.rating] += 1;
  }
  return dist;
}
