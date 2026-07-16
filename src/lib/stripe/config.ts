import type { PlanTier } from "@/lib/auth/user";

export type BillingInterval = "monthly" | "yearly";

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (!key || key.includes("your-") || key.includes("sk_test_placeholder")) return false;
  return key.startsWith("sk_");
}

/** Stripe Price IDs — set in env for live Checkout. */
export const stripePriceEnv = {
  proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  proYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
  eliteMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY ?? "",
  eliteYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "",
};

export function getStripePriceId(plan: PlanTier, interval: BillingInterval): string | null {
  if (plan === "STARTER") return null;
  if (plan === "PRO") {
    return interval === "yearly" ? stripePriceEnv.proYearly || null : stripePriceEnv.proMonthly || null;
  }
  return interval === "yearly"
    ? stripePriceEnv.eliteYearly || null
    : stripePriceEnv.eliteMonthly || null;
}

export function planFromPriceId(priceId: string): { plan: PlanTier; interval: BillingInterval } | null {
  const map: Record<string, { plan: PlanTier; interval: BillingInterval }> = {};
  if (stripePriceEnv.proMonthly) map[stripePriceEnv.proMonthly] = { plan: "PRO", interval: "monthly" };
  if (stripePriceEnv.proYearly) map[stripePriceEnv.proYearly] = { plan: "PRO", interval: "yearly" };
  if (stripePriceEnv.eliteMonthly)
    map[stripePriceEnv.eliteMonthly] = { plan: "ELITE", interval: "monthly" };
  if (stripePriceEnv.eliteYearly) map[stripePriceEnv.eliteYearly] = { plan: "ELITE", interval: "yearly" };
  return map[priceId] ?? null;
}

export const PLAN_RANK: Record<PlanTier, number> = {
  STARTER: 0,
  PRO: 1,
  ELITE: 2,
};

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
