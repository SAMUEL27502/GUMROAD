export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  plan: "STARTER" | "PRO" | "ELITE";
  role: "USER" | "ADMIN" | "AFFILIATE";
  joined: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
};

export type AdminBotRecord = {
  id: string;
  name: string;
  slug: string;
  strategy: string;
  tradingPair: string;
  category: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  price: number;
  roi: number;
  verified: boolean;
  approved: boolean;
};

export type AdminCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  botCount: number;
};

export type AdminReviewRecord = {
  id: string;
  botName: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  approved: boolean;
  verifiedOwner: boolean;
  helpfulCount: number;
  date: string;
};

export type AdminPricingRecord = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  popular: boolean;
  active: boolean;
};

export type AdminCouponRecord = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxRedemptions: number;
  redeemed: number;
  expiresAt: string;
  active: boolean;
};

export type AdminAnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  audience: "ALL" | "PRO" | "ELITE" | "ADMIN";
  published: boolean;
  createdAt: string;
};

export const seedAdminCategories: AdminCategoryRecord[] = [
  { id: "cat1", name: "Forex", slug: "forex", description: "Major and minor FX pairs", botCount: 28 },
  { id: "cat2", name: "Metals", slug: "metals", description: "Gold, silver, and precious metals", botCount: 8 },
  { id: "cat3", name: "Crypto", slug: "crypto", description: "BTC, ETH, and crypto indices", botCount: 7 },
  { id: "cat4", name: "Indices", slug: "indices", description: "Equity and volatility indices", botCount: 7 },
];

export const seedAdminReviews: AdminReviewRecord[] = [
  {
    id: "r1",
    botName: "GoldScalper Pro",
    author: "Marcus Chen",
    rating: 5,
    title: "Solid gold sessions",
    content: "Consistent during London open. Drawdown stayed within advertised range.",
    approved: true,
    verifiedOwner: true,
    helpfulCount: 18,
    date: "2026-07-10",
  },
  {
    id: "r2",
    botName: "EuroTrend AI",
    author: "Elena Kowalski",
    rating: 4,
    title: "Steady EURUSD trends",
    content: "Good risk control. Occasional misses on news days.",
    approved: true,
    verifiedOwner: true,
    helpfulCount: 9,
    date: "2026-07-08",
  },
  {
    id: "r3",
    botName: "BreakoutHunter",
    author: "James Liu",
    rating: 3,
    title: "Needs more filters",
    content: "False breakouts during Asian range. Otherwise OK.",
    approved: false,
    verifiedOwner: true,
    helpfulCount: 2,
    date: "2026-07-12",
  },
  {
    id: "r4",
    botName: "NightOwl Grid",
    author: "Priya Nair",
    rating: 5,
    title: "Quiet overnight profits",
    content: "Works well on demo and live with investor sync.",
    approved: false,
    verifiedOwner: false,
    helpfulCount: 0,
    date: "2026-07-14",
  },
];

export const seedAdminPricing: AdminPricingRecord[] = [
  {
    id: "price1",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with verified bots and core analytics.",
    popular: false,
    active: true,
  },
  {
    id: "price2",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For active traders running a focused bot portfolio.",
    popular: true,
    active: true,
  },
  {
    id: "price3",
    name: "Elite",
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Unlimited automation with dedicated infrastructure.",
    popular: false,
    active: true,
  },
];

export const seedAdminCoupons: AdminCouponRecord[] = [
  {
    id: "cp1",
    code: "WELCOME20",
    type: "PERCENT",
    value: 20,
    maxRedemptions: 500,
    redeemed: 184,
    expiresAt: "2026-12-31",
    active: true,
  },
  {
    id: "cp2",
    code: "PRO50",
    type: "FIXED",
    value: 50,
    maxRedemptions: 100,
    redeemed: 42,
    expiresAt: "2026-09-30",
    active: true,
  },
  {
    id: "cp3",
    code: "ELITE100",
    type: "FIXED",
    value: 100,
    maxRedemptions: 50,
    redeemed: 50,
    expiresAt: "2026-06-30",
    active: false,
  },
];

export const seedAdminAnnouncements: AdminAnnouncementRecord[] = [
  {
    id: "an1",
    title: "Scheduled MT5 maintenance",
    body: "Investor sync will pause Saturday 02:00–04:00 UTC for infrastructure upgrades.",
    audience: "ALL",
    published: true,
    createdAt: "2026-07-14",
  },
  {
    id: "an2",
    title: "Elite VPS regions expanded",
    body: "New London and Tokyo VPS nodes are available for Elite subscribers.",
    audience: "ELITE",
    published: true,
    createdAt: "2026-07-10",
  },
  {
    id: "an3",
    title: "Draft: Summer promo",
    body: "20% off Pro yearly — draft for marketing review.",
    audience: "PRO",
    published: false,
    createdAt: "2026-07-15",
  },
];
