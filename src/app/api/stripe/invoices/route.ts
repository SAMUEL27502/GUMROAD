import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/services/stripe/config";
import { getStripe } from "@/services/stripe/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!isStripeConfigured()) {
      return NextResponse.json({
        mode: "demo",
        invoices: [],
        message: "Use client billing store invoices in demo mode.",
      });
    }

    const stripe = getStripe();
    if (!stripe || !customerId) {
      return NextResponse.json({ error: "customerId required" }, { status: 400 });
    }

    const list = await stripe.invoices.list({ customer: customerId, limit: 24 });
    const invoices = list.data.map((inv) => ({
      id: inv.id,
      number: inv.number ?? inv.id,
      amount: (inv.amount_paid || inv.amount_due) / 100,
      currency: inv.currency,
      status: inv.status ?? "open",
      createdAt: new Date((inv.created ?? 0) * 1000).toISOString(),
      pdfUrl: inv.invoice_pdf ?? undefined,
      description: inv.lines.data[0]?.description ?? "Subscription",
    }));

    return NextResponse.json({ mode: "live", invoices });
  } catch (error) {
    console.error("[stripe/invoices]", error);
    return NextResponse.json({ error: "Failed to load invoices" }, { status: 500 });
  }
}
