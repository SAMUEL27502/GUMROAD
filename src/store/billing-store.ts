import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanTier } from "@/services/auth/user";
import type { BillingInterval, PaymentProviderId } from "@/services/payments/types";
import { PLAN_AMOUNTS } from "@/services/payments/types";

export type SubscriptionStatus =
  | "NONE"
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELLED"
  | "INCOMPLETE";

export interface BillingInvoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "draft";
  createdAt: string;
  pdfUrl?: string;
  description: string;
  provider?: PaymentProviderId;
}

interface BillingState {
  plan: PlanTier;
  status: SubscriptionStatus;
  interval: BillingInterval;
  provider: PaymentProviderId;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  paypalSubscriberId: string | null;
  paypalSubscriptionId: string | null;
  invoices: BillingInvoice[];
  setProvider: (provider: PaymentProviderId) => void;
  setFromCheckout: (
    plan: PlanTier,
    interval: BillingInterval,
    provider?: PaymentProviderId
  ) => void;
  upgrade: (plan: PlanTier) => void;
  downgrade: (plan: PlanTier) => void;
  cancel: () => void;
  resume: () => void;
  setStatus: (status: SubscriptionStatus) => void;
  addInvoice: (invoice: BillingInvoice) => void;
}

function nextPeriodEnd(interval: BillingInterval) {
  const d = new Date();
  if (interval === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function makeInvoice(
  plan: PlanTier,
  interval: BillingInterval,
  amount: number,
  provider: PaymentProviderId
): BillingInvoice {
  return {
    id: `inv_${Date.now()}`,
    number: `TB-${String(Date.now()).slice(-6)}`,
    amount,
    currency: "usd",
    status: "paid",
    createdAt: new Date().toISOString(),
    description: `${plan} plan · ${interval} · ${provider}`,
    provider,
  };
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      plan: "STARTER",
      status: "NONE",
      interval: "monthly",
      provider: "stripe",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: nextPeriodEnd("monthly"),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalSubscriberId: null,
      paypalSubscriptionId: null,
      invoices: [
        {
          id: "inv_seed_1",
          number: "TB-100241",
          amount: 29,
          currency: "usd",
          status: "paid",
          createdAt: "2026-06-15T10:00:00.000Z",
          description: "PRO plan · monthly · stripe",
          provider: "stripe",
        },
        {
          id: "inv_seed_2",
          number: "TB-100182",
          amount: 29,
          currency: "usd",
          status: "paid",
          createdAt: "2026-05-15T10:00:00.000Z",
          description: "PRO plan · monthly · stripe",
          provider: "stripe",
        },
      ],
      setProvider: (provider) => set({ provider }),
      setFromCheckout: (plan, interval, provider = get().provider) => {
        const amount = PLAN_AMOUNTS[plan][interval];
        set({
          plan,
          interval,
          provider,
          status: "ACTIVE",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: nextPeriodEnd(interval),
          stripeCustomerId:
            provider === "stripe"
              ? get().stripeCustomerId ?? `cus_demo_${Date.now()}`
              : get().stripeCustomerId,
          stripeSubscriptionId:
            provider === "stripe" ? `sub_demo_${Date.now()}` : get().stripeSubscriptionId,
          paypalSubscriberId:
            provider === "paypal"
              ? get().paypalSubscriberId ?? `paypal_subr_${Date.now()}`
              : get().paypalSubscriberId,
          paypalSubscriptionId:
            provider === "paypal" ? `paypal_sub_${Date.now()}` : get().paypalSubscriptionId,
          invoices: [makeInvoice(plan, interval, amount, provider), ...get().invoices],
        });
      },
      upgrade: (plan) => {
        const { interval, provider } = get();
        const amount = PLAN_AMOUNTS[plan][interval];
        set({
          plan,
          status: "ACTIVE",
          cancelAtPeriodEnd: false,
          invoices: [makeInvoice(plan, interval, amount, provider), ...get().invoices],
        });
      },
      downgrade: (plan) => {
        const { interval, provider } = get();
        set({
          plan,
          cancelAtPeriodEnd: plan === "STARTER",
          status: plan === "STARTER" ? "CANCELLED" : "ACTIVE",
          invoices:
            plan === "STARTER"
              ? get().invoices
              : [
                  makeInvoice(plan, interval, PLAN_AMOUNTS[plan][interval], provider),
                  ...get().invoices,
                ],
        });
      },
      cancel: () =>
        set({
          cancelAtPeriodEnd: true,
          status: "ACTIVE",
        }),
      resume: () =>
        set({
          cancelAtPeriodEnd: false,
          status: "ACTIVE",
        }),
      setStatus: (status) => set({ status }),
      addInvoice: (invoice) => set((s) => ({ invoices: [invoice, ...s.invoices] })),
    }),
    { name: "tradebib-billing" }
  )
);
