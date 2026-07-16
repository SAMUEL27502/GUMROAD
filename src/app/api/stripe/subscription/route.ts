import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripePriceId, isStripeConfigured, PLAN_RANK } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";
import type { PlanTier } from "@/lib/auth/user";

const bodySchema = z.object({
  action: z.enum(["upgrade", "downgrade", "cancel", "resume", "status"]),
  plan: z.enum(["STARTER", "PRO", "ELITE"]).optional(),
  interval: z.enum(["monthly", "yearly"]).optional(),
  subscriptionId: z.string().optional(),
  currentPlan: z.enum(["STARTER", "PRO", "ELITE"]).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { action, plan, interval = "monthly", subscriptionId, currentPlan } = parsed.data;

    if (action === "status") {
      return NextResponse.json({
        mode: isStripeConfigured() ? "live" : "demo",
        configured: isStripeConfigured(),
      });
    }

    // Demo mode — client store applies the change
    if (!isStripeConfigured()) {
      return NextResponse.json({
        mode: "demo",
        action,
        plan: plan ?? currentPlan,
        interval,
        ok: true,
      });
    }

    const stripe = getStripe();
    if (!stripe || !subscriptionId) {
      return NextResponse.json(
        { error: "Stripe subscriptionId required for live mode" },
        { status: 400 }
      );
    }

    if (action === "cancel") {
      const sub = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return NextResponse.json({
        mode: "live",
        action,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        status: sub.status,
      });
    }

    if (action === "resume") {
      const sub = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      return NextResponse.json({
        mode: "live",
        action,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        status: sub.status,
      });
    }

    if ((action === "upgrade" || action === "downgrade") && plan) {
      if (currentPlan && PLAN_RANK[plan as PlanTier] === PLAN_RANK[currentPlan]) {
        return NextResponse.json({ error: "Already on this plan" }, { status: 400 });
      }
      if (
        action === "upgrade" &&
        currentPlan &&
        PLAN_RANK[plan as PlanTier] < PLAN_RANK[currentPlan]
      ) {
        return NextResponse.json({ error: "Use downgrade for lower plans" }, { status: 400 });
      }
      if (
        action === "downgrade" &&
        currentPlan &&
        PLAN_RANK[plan as PlanTier] > PLAN_RANK[currentPlan]
      ) {
        return NextResponse.json({ error: "Use upgrade for higher plans" }, { status: 400 });
      }

      if (plan === "STARTER") {
        const sub = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        return NextResponse.json({
          mode: "live",
          action: "downgrade",
          plan: "STARTER",
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
      }

      const priceId = getStripePriceId(plan, interval);
      if (!priceId) {
        return NextResponse.json({ error: "Missing Stripe price ID" }, { status: 400 });
      }

      const existing = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = existing.items.data[0]?.id;
      if (!itemId) {
        return NextResponse.json({ error: "Subscription has no items" }, { status: 400 });
      }

      const sub = await stripe.subscriptions.update(subscriptionId, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: "create_prorations",
        cancel_at_period_end: false,
        metadata: { plan, interval },
      });

      return NextResponse.json({
        mode: "live",
        action,
        plan,
        status: sub.status,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[stripe/subscription]", error);
    return NextResponse.json({ error: "Subscription update failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isStripeConfigured(),
    mode: isStripeConfigured() ? "live" : "demo",
  });
}
