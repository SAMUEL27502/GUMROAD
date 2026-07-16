import {
  appUrl,
  getStripePriceId,
  isStripeConfigured,
  PLAN_RANK,
} from "@/services/stripe/config";
import { getStripe } from "@/services/stripe/server";
import type {
  CheckoutInput,
  CheckoutResult,
  PaymentProvider,
  PortalInput,
  PortalResult,
  SubscriptionUpdateInput,
  SubscriptionUpdateResult,
  InvoiceDTO,
} from "@/services/payments/types";
import type { PlanTier } from "@/services/auth/user";

export function createStripeProvider(): PaymentProvider {
  return {
    id: "stripe",
    isConfigured: () => isStripeConfigured(),

    async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
      const base = appUrl();
      if (!isStripeConfigured()) {
        return {
          mode: "demo",
          provider: "stripe",
          url: `${base}/billing?checkout=success&plan=${input.plan}&interval=${input.interval}&provider=stripe&demo=1`,
          sessionId: `cs_demo_${Date.now()}`,
        };
      }

      const stripe = getStripe();
      if (!stripe) throw new Error("Stripe unavailable");

      const priceId = getStripePriceId(input.plan, input.interval);
      if (!priceId) {
        throw new Error(
          "Stripe Price ID missing. Set STRIPE_PRICE_PRO_MONTHLY / YEARLY and ELITE equivalents."
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url:
          input.returnUrl ||
          `${base}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}&provider=stripe`,
        cancel_url: input.cancelUrl || `${base}/pricing?checkout=cancelled`,
        customer: input.customerId || undefined,
        customer_email: input.customerId ? undefined : input.customerEmail,
        client_reference_id: input.userId,
        metadata: {
          plan: input.plan,
          interval: input.interval,
          userId: input.userId ?? "",
          provider: "stripe",
        },
        subscription_data: {
          metadata: {
            plan: input.plan,
            interval: input.interval,
            userId: input.userId ?? "",
          },
        },
        allow_promotion_codes: true,
      });

      return {
        mode: "live",
        provider: "stripe",
        url: session.url!,
        sessionId: session.id,
      };
    },

    async createPortal(input: PortalInput): Promise<PortalResult> {
      const returnUrl = input.returnUrl || `${appUrl()}/billing`;
      if (!isStripeConfigured()) {
        return {
          mode: "demo",
          provider: "stripe",
          url: `${returnUrl}?portal=demo&provider=stripe`,
          message: "Stripe not configured — demo portal.",
        };
      }

      const stripe = getStripe();
      if (!stripe || !input.customerId) {
        throw new Error("Stripe customerId required");
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: input.customerId,
        return_url: returnUrl,
      });

      return { mode: "live", provider: "stripe", url: session.url };
    },

    async updateSubscription(input: SubscriptionUpdateInput): Promise<SubscriptionUpdateResult> {
      if (input.action === "status") {
        return {
          mode: isStripeConfigured() ? "live" : "demo",
          provider: "stripe",
          action: "status",
          ok: true,
        };
      }

      if (!isStripeConfigured()) {
        return {
          mode: "demo",
          provider: "stripe",
          action: input.action,
          plan: input.plan ?? input.currentPlan,
          ok: true,
        };
      }

      const stripe = getStripe();
      if (!stripe || !input.subscriptionId) {
        throw new Error("Stripe subscriptionId required for live mode");
      }

      if (input.action === "cancel") {
        const sub = await stripe.subscriptions.update(input.subscriptionId, {
          cancel_at_period_end: true,
        });
        return {
          mode: "live",
          provider: "stripe",
          action: "cancel",
          ok: true,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          status: sub.status,
        };
      }

      if (input.action === "resume") {
        const sub = await stripe.subscriptions.update(input.subscriptionId, {
          cancel_at_period_end: false,
        });
        return {
          mode: "live",
          provider: "stripe",
          action: "resume",
          ok: true,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          status: sub.status,
        };
      }

      if ((input.action === "upgrade" || input.action === "downgrade") && input.plan) {
        const plan = input.plan as PlanTier;
        if (input.currentPlan && PLAN_RANK[plan] === PLAN_RANK[input.currentPlan]) {
          throw new Error("Already on this plan");
        }

        if (plan === "STARTER") {
          const sub = await stripe.subscriptions.update(input.subscriptionId, {
            cancel_at_period_end: true,
          });
          return {
            mode: "live",
            provider: "stripe",
            action: "downgrade",
            ok: true,
            plan: "STARTER",
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          };
        }

        const priceId = getStripePriceId(plan, input.interval || "monthly");
        if (!priceId) throw new Error("Missing Stripe price ID");

        const existing = await stripe.subscriptions.retrieve(input.subscriptionId);
        const itemId = existing.items.data[0]?.id;
        if (!itemId) throw new Error("Subscription has no items");

        const sub = await stripe.subscriptions.update(input.subscriptionId, {
          items: [{ id: itemId, price: priceId }],
          proration_behavior: "create_prorations",
          cancel_at_period_end: false,
          metadata: { plan, interval: input.interval || "monthly" },
        });

        return {
          mode: "live",
          provider: "stripe",
          action: input.action,
          ok: true,
          plan,
          status: sub.status,
        };
      }

      throw new Error("Invalid action");
    },

    async listInvoices(customerId: string): Promise<InvoiceDTO[]> {
      const stripe = getStripe();
      if (!stripe) return [];
      const list = await stripe.invoices.list({ customer: customerId, limit: 24 });
      return list.data.map((inv) => ({
        id: inv.id,
        number: inv.number ?? inv.id,
        amount: (inv.amount_paid || inv.amount_due) / 100,
        currency: inv.currency,
        status: inv.status ?? "open",
        createdAt: new Date((inv.created ?? 0) * 1000).toISOString(),
        pdfUrl: inv.invoice_pdf ?? undefined,
        description: inv.lines.data[0]?.description ?? "Subscription",
      }));
    },
  };
}
