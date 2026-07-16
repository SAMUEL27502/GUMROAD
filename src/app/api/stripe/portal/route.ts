import { NextResponse } from "next/server";
import { z } from "zod";
import { appUrl, isStripeConfigured } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

const bodySchema = z.object({
  customerId: z.string().min(1).optional(),
  returnUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const returnUrl = parsed.data.returnUrl || `${appUrl()}/billing`;

    if (!isStripeConfigured()) {
      return NextResponse.json({
        mode: "demo",
        url: `${returnUrl}?portal=demo`,
        message: "Stripe not configured — opening demo customer portal panel.",
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe unavailable" }, { status: 500 });
    }

    const customerId = parsed.data.customerId;
    if (!customerId) {
      return NextResponse.json({ error: "customerId required" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ mode: "live", url: session.url });
  } catch (error) {
    console.error("[stripe/portal]", error);
    return NextResponse.json({ error: "Portal session failed" }, { status: 500 });
  }
}
