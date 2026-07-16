import type { PlanTier } from "@/lib/auth/user";

export type BillingInterval = "monthly" | "yearly";
export type PaymentProviderId = "stripe" | "paypal";

export type SubscriptionAction = "upgrade" | "downgrade" | "cancel" | "resume" | "status";

export interface CheckoutInput {
  plan: Extract<PlanTier, "PRO" | "ELITE">;
  interval: BillingInterval;
  customerEmail?: string;
  userId?: string;
  customerId?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  mode: "live" | "demo";
  provider: PaymentProviderId;
  url: string;
  sessionId?: string;
}

export interface PortalInput {
  customerId?: string;
  returnUrl?: string;
}

export interface PortalResult {
  mode: "live" | "demo";
  provider: PaymentProviderId;
  url: string;
  message?: string;
}

export interface SubscriptionUpdateInput {
  action: SubscriptionAction;
  plan?: PlanTier;
  interval?: BillingInterval;
  subscriptionId?: string;
  currentPlan?: PlanTier;
}

export interface SubscriptionUpdateResult {
  mode: "live" | "demo";
  provider: PaymentProviderId;
  action: SubscriptionAction;
  ok: boolean;
  plan?: PlanTier;
  status?: string;
  cancelAtPeriodEnd?: boolean;
  message?: string;
}

export interface InvoiceDTO {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  pdfUrl?: string;
  description: string;
}

/** Shared contract implemented by Stripe and PayPal adapters. */
export interface PaymentProvider {
  id: PaymentProviderId;
  isConfigured(): boolean;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  createPortal(input: PortalInput): Promise<PortalResult>;
  updateSubscription(input: SubscriptionUpdateInput): Promise<SubscriptionUpdateResult>;
  listInvoices?(customerId: string): Promise<InvoiceDTO[]>;
}

export const PLAN_RANK: Record<PlanTier, number> = {
  STARTER: 0,
  PRO: 1,
  ELITE: 2,
};

export const PLAN_AMOUNTS: Record<PlanTier, { monthly: number; yearly: number }> = {
  STARTER: { monthly: 0, yearly: 0 },
  PRO: { monthly: 29, yearly: 290 },
  ELITE: { monthly: 79, yearly: 790 },
};

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
