import type { PlanTier } from "@/services/auth/user";
import { appUrl, PLAN_RANK } from "@/services/payments/types";
import { getPayPalPlanId, isPayPalConfigured } from "@/services/paypal/config";
import { paypalFetch } from "@/services/paypal/server";
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

interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

interface PayPalSubscription {
  id: string;
  status?: string;
  links?: PayPalLink[];
}

export function createPayPalProvider(): PaymentProvider {
  return {
    id: "paypal",
    isConfigured: () => isPayPalConfigured(),

    async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
      const base = appUrl();
      if (!isPayPalConfigured()) {
        return {
          mode: "demo",
          provider: "paypal",
          url: `${base}/billing?checkout=success&plan=${input.plan}&interval=${input.interval}&provider=paypal&demo=1`,
          sessionId: `paypal_demo_${Date.now()}`,
        };
      }

      const planId = getPayPalPlanId(input.plan, input.interval);
      if (!planId) {
        throw new Error(
          "PayPal Plan ID missing. Set PAYPAL_PLAN_PRO_MONTHLY / YEARLY and ELITE equivalents."
        );
      }

      const returnUrl =
        input.returnUrl ||
        `${base}/billing?checkout=success&provider=paypal&plan=${input.plan}&interval=${input.interval}`;
      const cancelUrl = input.cancelUrl || `${base}/pricing?checkout=cancelled&provider=paypal`;

      const { ok, data, status } = await paypalFetch<PayPalSubscription>("/v1/billing/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          plan_id: planId,
          custom_id: input.userId || undefined,
          subscriber: input.customerEmail
            ? { email_address: input.customerEmail }
            : undefined,
          application_context: {
            brand_name: "TradeBib",
            locale: "en-US",
            shipping_preference: "NO_SHIPPING",
            user_action: "SUBSCRIBE_NOW",
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        }),
      });

      if (!ok) {
        console.error("[paypal] create subscription failed", status, data);
        throw new Error("PayPal subscription create failed");
      }

      const approve = data.links?.find((l) => l.rel === "approve");
      if (!approve?.href) throw new Error("PayPal approval URL missing");

      return {
        mode: "live",
        provider: "paypal",
        url: approve.href,
        sessionId: data.id,
      };
    },

    async createPortal(input: PortalInput): Promise<PortalResult> {
      const returnUrl = input.returnUrl || `${appUrl()}/billing`;
      // PayPal has no Stripe-style billing portal; surface manage URL / demo panel
      if (!isPayPalConfigured()) {
        return {
          mode: "demo",
          provider: "paypal",
          url: `${returnUrl}?portal=demo&provider=paypal`,
          message: "PayPal not configured — demo portal.",
        };
      }

      return {
        mode: "live",
        provider: "paypal",
        url: `${returnUrl}?portal=paypal`,
        message: "Manage PayPal subscriptions from this billing page or PayPal.com.",
      };
    },

    async updateSubscription(input: SubscriptionUpdateInput): Promise<SubscriptionUpdateResult> {
      if (input.action === "status") {
        return {
          mode: isPayPalConfigured() ? "live" : "demo",
          provider: "paypal",
          action: "status",
          ok: true,
        };
      }

      if (!isPayPalConfigured()) {
        return {
          mode: "demo",
          provider: "paypal",
          action: input.action,
          plan: input.plan ?? input.currentPlan,
          ok: true,
        };
      }

      if (!input.subscriptionId) {
        throw new Error("PayPal subscriptionId required for live mode");
      }

      if (input.action === "cancel") {
        const { ok } = await paypalFetch(`/v1/billing/subscriptions/${input.subscriptionId}/cancel`, {
          method: "POST",
          body: JSON.stringify({ reason: "User cancelled from TradeBib" }),
        });
        if (!ok) throw new Error("PayPal cancel failed");
        return {
          mode: "live",
          provider: "paypal",
          action: "cancel",
          ok: true,
          cancelAtPeriodEnd: true,
          status: "CANCELLED",
        };
      }

      if (input.action === "resume") {
        const { ok } = await paypalFetch(
          `/v1/billing/subscriptions/${input.subscriptionId}/activate`,
          {
            method: "POST",
            body: JSON.stringify({ reason: "User resumed from TradeBib" }),
          }
        );
        if (!ok) throw new Error("PayPal resume failed");
        return {
          mode: "live",
          provider: "paypal",
          action: "resume",
          ok: true,
          cancelAtPeriodEnd: false,
          status: "ACTIVE",
        };
      }

      if ((input.action === "upgrade" || input.action === "downgrade") && input.plan) {
        const plan = input.plan as PlanTier;
        if (input.currentPlan && PLAN_RANK[plan] === PLAN_RANK[input.currentPlan]) {
          throw new Error("Already on this plan");
        }

        if (plan === "STARTER") {
          const { ok } = await paypalFetch(
            `/v1/billing/subscriptions/${input.subscriptionId}/cancel`,
            {
              method: "POST",
              body: JSON.stringify({ reason: "Downgrade to Starter" }),
            }
          );
          if (!ok) throw new Error("PayPal downgrade cancel failed");
          return {
            mode: "live",
            provider: "paypal",
            action: "downgrade",
            ok: true,
            plan: "STARTER",
            cancelAtPeriodEnd: true,
          };
        }

        const planId = getPayPalPlanId(plan, input.interval || "monthly");
        if (!planId) throw new Error("Missing PayPal plan ID");

        const base = appUrl();
        const { ok, data } = await paypalFetch<PayPalSubscription>(
          `/v1/billing/subscriptions/${input.subscriptionId}/revise`,
          {
            method: "POST",
            body: JSON.stringify({
              plan_id: planId,
              application_context: {
                brand_name: "TradeBib",
                return_url: `${base}/billing?checkout=success&provider=paypal&plan=${plan}&interval=${input.interval || "monthly"}`,
                cancel_url: `${base}/billing?checkout=cancelled&provider=paypal`,
              },
            }),
          }
        );

        if (!ok) throw new Error("PayPal revise failed");

        const approve = data.links?.find((l) => l.rel === "approve");
        return {
          mode: "live",
          provider: "paypal",
          action: input.action,
          ok: true,
          plan,
          message: approve?.href
            ? `Approval required: ${approve.href}`
            : "Subscription revise submitted",
        };
      }

      throw new Error("Invalid action");
    },

    async listInvoices(): Promise<InvoiceDTO[]> {
      // PayPal transaction search requires additional scopes; demo/store covers UI.
      return [];
    },
  };
}
