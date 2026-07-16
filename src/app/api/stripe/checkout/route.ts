import { NextResponse } from "next/server";
import { z } from "zod";
import {
  appUrl,
  getStripePriceId,
  isStripeConfigured,
} from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

const bodySchema = z.object({
  plan: z.enum(["PRO", "ELITE"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  customerEmail: z.string().email().optional(),
  userId: z.string().optional(),
  customerId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { plan, interval, customerEmail, userId, customerId } = parsed.data;
    const base = appUrl();

    // Demo mode — no Stripe keys: return client-handled success URL
    if (!isStripeConfigured()) {
      const url = `${base}/billing?checkout=success&plan=${plan}&interval=${interval}&demo=1`;
      return NextResponse.json({
        mode: "demo",
        url,
        sessionId: `cs_demo_${Date.now()}`,
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe unavailable" }, { status: 500 });
    }

    const priceId = getStripePriceId(plan, interval);
    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Stripe Price ID missing. Set STRIPE_PRICE_PRO_MONTHLY / YEARLY and ELITE equivalents.",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/pricing?checkout=cancelled`,
      customer: customerId || undefined,
      customer_email: customerId ? undefined : customerEmail,
      client_reference_id: userId,
      metadata: {
        plan,
        interval,
        userId: userId ?? "",
      },
      subscription_data: {
        metadata: { plan, interval, userId: userId ?? "" },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      mode: "live",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
