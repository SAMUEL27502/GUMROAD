import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/lib/payments";
import { isPayPalConfigured } from "@/lib/paypal/config";

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
    const result = await getPaymentProvider("paypal").updateSubscription(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[paypal/subscription]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal subscription update failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isPayPalConfigured(),
    mode: isPayPalConfigured() ? "live" : "demo",
    provider: "paypal",
  });
}
