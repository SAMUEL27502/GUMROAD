import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanTier } from "@/lib/auth/user";
import type { BillingInterval } from "@/lib/stripe/config";

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
}

interface BillingState {
  plan: PlanTier;
  status: SubscriptionStatus;
  interval: BillingInterval;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  invoices: BillingInvoice[];
  setFromCheckout: (plan: PlanTier, interval: BillingInterval) => void;
  upgrade: (plan: PlanTier) => void;
  downgrade: (plan: PlanTier) => void;
  cancel: () => void;
  resume: () => void;
  setStatus: (status: SubscriptionStatus) => void;
  addInvoice: (invoice: BillingInvoice) => void;
  openPortalDemo: () => void;
}

function nextPeriodEnd(interval: BillingInterval) {
  const d = new Date();
  if (interval === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function makeInvoice(plan: PlanTier, interval: BillingInterval, amount: number): BillingInvoice {
  const id = `inv_${Date.now()}`;
  return {
    id,
    number: `TB-${String(Date.now()).slice(-6)}`,
    amount,
    currency: "usd",
    status: "paid",
    createdAt: new Date().toISOString(),
    description: `${plan} plan · ${interval}`,
    pdfUrl: undefined,
  };
}

const planAmount: Record<PlanTier, { monthly: number; yearly: number }> = {
  STARTER: { monthly: 0, yearly: 0 },
  PRO: { monthly: 29, yearly: 290 },
  ELITE: { monthly: 79, yearly: 790 },
};

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      plan: "STARTER",
      status: "NONE",
      interval: "monthly",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: nextPeriodEnd("monthly"),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      invoices: [
        {
          id: "inv_seed_1",
          number: "TB-100241",
          amount: 29,
          currency: "usd",
          status: "paid",
          createdAt: "2026-06-15T10:00:00.000Z",
          description: "PRO plan · monthly",
        },
        {
          id: "inv_seed_2",
          number: "TB-100182",
          amount: 29,
          currency: "usd",
          status: "paid",
          createdAt: "2026-05-15T10:00:00.000Z",
          description: "PRO plan · monthly",
        },
      ],
      setFromCheckout: (plan, interval) => {
        const amount = planAmount[plan][interval];
        set({
          plan,
          interval,
          status: "ACTIVE",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: nextPeriodEnd(interval),
          stripeCustomerId: get().stripeCustomerId ?? `cus_demo_${Date.now()}`,
          stripeSubscriptionId: `sub_demo_${Date.now()}`,
          invoices: [makeInvoice(plan, interval, amount), ...get().invoices],
        });
      },
      upgrade: (plan) => {
        const { interval } = get();
        const amount = planAmount[plan][interval];
        set({
          plan,
          status: "ACTIVE",
          cancelAtPeriodEnd: false,
          invoices: [makeInvoice(plan, interval, amount), ...get().invoices],
        });
      },
      downgrade: (plan) => {
        set({
          plan,
          cancelAtPeriodEnd: plan === "STARTER",
          status: plan === "STARTER" ? "CANCELLED" : "ACTIVE",
          invoices:
            plan === "STARTER"
              ? get().invoices
              : [makeInvoice(plan, get().interval, planAmount[plan][get().interval]), ...get().invoices],
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
      openPortalDemo: () => {
        /* no-op — UI handles toast + panel */
      },
    }),
    { name: "tradebib-billing" }
  )
);
