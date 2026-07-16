import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/services/payments";

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
    const result = await getPaymentProvider("stripe").createCheckout(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
