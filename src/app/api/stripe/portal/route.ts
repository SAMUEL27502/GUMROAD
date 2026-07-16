import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/services/payments";

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
    const result = await getPaymentProvider("stripe").createPortal(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[stripe/portal]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Portal session failed" },
      { status: 500 }
    );
  }
}
