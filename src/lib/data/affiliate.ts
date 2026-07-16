export type AffiliateTier = "STARTER" | "PARTNER" | "ELITE";
export type ConversionStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "BLOCKED";
export type CommissionStatus = "PENDING" | "APPROVED" | "PAID" | "VOID";
export type WithdrawalStatus = "PENDING" | "PROCESSING" | "PAID" | "REJECTED";

export interface AffiliateProfile {
  referralCode: string;
  tier: AffiliateTier;
  commissionRate: number; // percent e.g. 20
  nextTierAt: number;
  payoutMethod: "paypal" | "bank" | "stripe";
  payoutDestination: string;
  minWithdrawal: number;
}

export interface AffiliateClick {
  id: string;
  date: string;
  source: string;
  landingPath: string;
  country: string;
}

export interface AffiliateConversion {
  id: string;
  name: string;
  email: string;
  plan: "STARTER" | "PRO" | "ELITE";
  status: ConversionStatus;
  signedUpAt: string;
  activatedAt?: string;
  commissionEarned: number;
}

export interface AffiliateCommission {
  id: string;
  referralName: string;
  description: string;
  amount: number;
  rate: number;
  status: CommissionStatus;
  createdAt: string;
  paidAt?: string;
}

export interface AffiliateWithdrawal {
  id: string;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  method: string;
  destination: string;
  requestedAt: string;
  processedAt?: string;
}

export const affiliateProfile: AffiliateProfile = {
  referralCode: "TRADEBIB-NOVA42",
  tier: "PARTNER",
  commissionRate: 20,
  nextTierAt: 30,
  payoutMethod: "paypal",
  payoutDestination: "affiliate@tradebib.com",
  minWithdrawal: 50,
};

export function buildReferralLink(code: string, baseUrl?: string) {
  const base =
    baseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "https://tradebib.com");
  return `${base}/register?ref=${code}`;
}

export const affiliateClicks: AffiliateClick[] = [
  {
    id: "clk1",
    date: "2026-07-15 22:14",
    source: "Twitter",
    landingPath: "/pricing",
    country: "US",
  },
  {
    id: "clk2",
    date: "2026-07-15 19:02",
    source: "YouTube",
    landingPath: "/marketplace",
    country: "GB",
  },
  {
    id: "clk3",
    date: "2026-07-15 14:41",
    source: "Direct",
    landingPath: "/register",
    country: "SG",
  },
  {
    id: "clk4",
    date: "2026-07-14 11:20",
    source: "Discord",
    landingPath: "/recommend",
    country: "DE",
  },
  {
    id: "clk5",
    date: "2026-07-14 08:05",
    source: "Blog",
    landingPath: "/blog",
    country: "AU",
  },
  {
    id: "clk6",
    date: "2026-07-13 21:33",
    source: "Telegram",
    landingPath: "/pricing",
    country: "AE",
  },
];

export const affiliateConversions: AffiliateConversion[] = [
  {
    id: "conv1",
    name: "Marcus Chen",
    email: "marcus@example.com",
    plan: "PRO",
    status: "ACTIVE",
    signedUpAt: "2026-06-12",
    activatedAt: "2026-06-12",
    commissionEarned: 98.0,
  },
  {
    id: "conv2",
    name: "Elena Kowalski",
    email: "elena@example.com",
    plan: "ELITE",
    status: "ACTIVE",
    signedUpAt: "2026-06-18",
    activatedAt: "2026-06-19",
    commissionEarned: 198.0,
  },
  {
    id: "conv3",
    name: "James Liu",
    email: "james@example.com",
    plan: "PRO",
    status: "ACTIVE",
    signedUpAt: "2026-06-28",
    activatedAt: "2026-06-28",
    commissionEarned: 49.0,
  },
  {
    id: "conv4",
    name: "Priya Nair",
    email: "priya@example.com",
    plan: "STARTER",
    status: "PENDING",
    signedUpAt: "2026-07-10",
    commissionEarned: 0,
  },
  {
    id: "conv5",
    name: "Sam Rivera",
    email: "sam@example.com",
    plan: "PRO",
    status: "INACTIVE",
    signedUpAt: "2026-05-02",
    activatedAt: "2026-05-03",
    commissionEarned: 49.0,
  },
  {
    id: "conv6",
    name: "Ana Mendes",
    email: "ana@example.com",
    plan: "ELITE",
    status: "ACTIVE",
    signedUpAt: "2026-07-01",
    activatedAt: "2026-07-01",
    commissionEarned: 99.0,
  },
];

export const seedAffiliateCommissions: AffiliateCommission[] = [
  {
    id: "com1",
    referralName: "Elena Kowalski",
    description: "Elite monthly · July",
    amount: 99.0,
    rate: 20,
    status: "APPROVED",
    createdAt: "2026-07-01",
  },
  {
    id: "com2",
    referralName: "Marcus Chen",
    description: "Pro monthly · July",
    amount: 49.0,
    rate: 20,
    status: "APPROVED",
    createdAt: "2026-07-02",
  },
  {
    id: "com3",
    referralName: "Ana Mendes",
    description: "Elite yearly bonus",
    amount: 99.0,
    rate: 20,
    status: "PENDING",
    createdAt: "2026-07-05",
  },
  {
    id: "com4",
    referralName: "James Liu",
    description: "Pro monthly · July",
    amount: 49.0,
    rate: 20,
    status: "PENDING",
    createdAt: "2026-07-08",
  },
  {
    id: "com5",
    referralName: "Marcus Chen",
    description: "Pro monthly · June",
    amount: 49.0,
    rate: 20,
    status: "PAID",
    createdAt: "2026-06-02",
    paidAt: "2026-06-15",
  },
  {
    id: "com6",
    referralName: "Elena Kowalski",
    description: "Elite monthly · June",
    amount: 99.0,
    rate: 20,
    status: "PAID",
    createdAt: "2026-06-03",
    paidAt: "2026-06-15",
  },
];

export const seedAffiliateWithdrawals: AffiliateWithdrawal[] = [
  {
    id: "wd1",
    amount: 250.0,
    currency: "USD",
    status: "PAID",
    method: "paypal",
    destination: "affiliate@tradebib.com",
    requestedAt: "2026-06-10",
    processedAt: "2026-06-15",
  },
  {
    id: "wd2",
    amount: 180.0,
    currency: "USD",
    status: "PROCESSING",
    method: "paypal",
    destination: "affiliate@tradebib.com",
    requestedAt: "2026-07-08",
  },
  {
    id: "wd3",
    amount: 75.0,
    currency: "USD",
    status: "PENDING",
    method: "paypal",
    destination: "affiliate@tradebib.com",
    requestedAt: "2026-07-14",
  },
];

export function computeAffiliateStats(
  conversions: AffiliateConversion[],
  commissions: AffiliateCommission[],
  withdrawals: AffiliateWithdrawal[],
  clicks: AffiliateClick[]
) {
  const activeReferrals = conversions.filter((c) => c.status === "ACTIVE").length;
  const pendingCommission = commissions
    .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
    .reduce((sum, c) => sum + c.amount, 0);
  const paidCommission = commissions
    .filter((c) => c.status === "PAID")
    .reduce((sum, c) => sum + c.amount, 0);
  const lifetimeEarnings = commissions
    .filter((c) => c.status !== "VOID")
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === "PENDING" || w.status === "PROCESSING")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = Math.max(0, pendingCommission - pendingWithdrawals);
  const conversionRate =
    clicks.length > 0 ? Number(((conversions.length / clicks.length) * 100).toFixed(1)) : 0;

  return {
    clicks: clicks.length,
    conversions: conversions.length,
    activeReferrals,
    conversionRate,
    pendingCommission,
    paidCommission,
    lifetimeEarnings,
    pendingWithdrawals,
    availableBalance,
  };
}
