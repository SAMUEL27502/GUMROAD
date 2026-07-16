import type { PlanTier } from "@/services/auth/user";
import type { BillingInterval } from "@/services/payments/types";

export function isPayPalConfigured() {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const secret = process.env.PAYPAL_CLIENT_SECRET ?? "";
  if (!clientId || !secret) return false;
  if (clientId.includes("your-") || secret.includes("your-")) return false;
  return true;
}

export function paypalApiBase() {
  const mode = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

/** PayPal Subscription Plan IDs (Billing Plans). */
export const paypalPlanEnv = {
  proMonthly: process.env.PAYPAL_PLAN_PRO_MONTHLY ?? "",
  proYearly: process.env.PAYPAL_PLAN_PRO_YEARLY ?? "",
  eliteMonthly: process.env.PAYPAL_PLAN_ELITE_MONTHLY ?? "",
  eliteYearly: process.env.PAYPAL_PLAN_ELITE_YEARLY ?? "",
};

export function getPayPalPlanId(plan: PlanTier, interval: BillingInterval): string | null {
  if (plan === "STARTER") return null;
  if (plan === "PRO") {
    return interval === "yearly" ? paypalPlanEnv.proYearly || null : paypalPlanEnv.proMonthly || null;
  }
  return interval === "yearly"
    ? paypalPlanEnv.eliteYearly || null
    : paypalPlanEnv.eliteMonthly || null;
}

export function planFromPayPalPlanId(
  planId: string
): { plan: PlanTier; interval: BillingInterval } | null {
  const map: Record<string, { plan: PlanTier; interval: BillingInterval }> = {};
  if (paypalPlanEnv.proMonthly) map[paypalPlanEnv.proMonthly] = { plan: "PRO", interval: "monthly" };
  if (paypalPlanEnv.proYearly) map[paypalPlanEnv.proYearly] = { plan: "PRO", interval: "yearly" };
  if (paypalPlanEnv.eliteMonthly)
    map[paypalPlanEnv.eliteMonthly] = { plan: "ELITE", interval: "monthly" };
  if (paypalPlanEnv.eliteYearly)
    map[paypalPlanEnv.eliteYearly] = { plan: "ELITE", interval: "yearly" };
  return map[planId] ?? null;
}
