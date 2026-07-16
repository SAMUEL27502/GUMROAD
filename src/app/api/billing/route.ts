import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider, providerStatus } from "@/services/payments";

const checkoutSchema = z.object({
  provider: z.enum(["stripe", "paypal"]).default("stripe"),
  plan: z.enum(["PRO", "ELITE"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  customerEmail: z.string().email().optional(),
  userId: z.string().optional(),
  customerId: z.string().optional(),
});

const portalSchema = z.object({
  provider: z.enum(["stripe", "paypal"]).default("stripe"),
  customerId: z.string().optional(),
  returnUrl: z.string().url().optional(),
});

const subscriptionSchema = z.object({
  provider: z.enum(["stripe", "paypal"]).default("stripe"),
  action: z.enum(["upgrade", "downgrade", "cancel", "resume", "status"]),
  plan: z.enum(["STARTER", "PRO", "ELITE"]).optional(),
  interval: z.enum(["monthly", "yearly"]).optional(),
  subscriptionId: z.string().optional(),
  currentPlan: z.enum(["STARTER", "PRO", "ELITE"]).optional(),
});

/** Unified multi-provider checkout */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const intent = url.searchParams.get("intent") || "checkout";
    const json = await request.json().catch(() => ({}));

    if (intent === "portal") {
      const parsed = portalSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const provider = getPaymentProvider(parsed.data.provider);
      const result = await provider.createPortal(parsed.data);
      return NextResponse.json(result);
    }

    if (intent === "subscription") {
      const parsed = subscriptionSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const provider = getPaymentProvider(parsed.data.provider);
      const result = await provider.updateSubscription(parsed.data);
      return NextResponse.json(result);
    }

    const parsed = checkoutSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const provider = getPaymentProvider(parsed.data.provider);
    const result = await provider.createCheckout(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[billing]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Billing request failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ providers: providerStatus() });
}
