import { NextResponse } from "next/server";
import { isPayPalConfigured, planFromPayPalPlanId } from "@/lib/paypal/config";

export const runtime = "nodejs";

/**
 * PayPal webhook handler for subscription lifecycle events.
 * Configure: POST {APP_URL}/api/paypal/webhook
 * Events: BILLING.SUBSCRIPTION.*, PAYMENT.SALE.*
 */
export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { received: true, mode: "demo", message: "PayPal not configured" },
      { status: 200 }
    );
  }

  try {
    const event = await request.json();
    const eventType = event?.event_type || event?.eventType || "unknown";
    const resource = event?.resource ?? {};

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.CREATED":
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const planId = resource.plan_id as string | undefined;
        const mapped = planId ? planFromPayPalPlanId(planId) : null;
        console.info(`[paypal/webhook] ${eventType}`, {
          id: resource.id,
          status: resource.status,
          plan: mapped?.plan,
          interval: mapped?.interval,
          custom_id: resource.custom_id,
        });
        break;
      }
      case "BILLING.SUBSCRIPTION.UPDATED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        console.info(`[paypal/webhook] ${eventType}`, {
          id: resource.id,
          status: resource.status,
        });
        break;
      }
      case "PAYMENT.SALE.COMPLETED":
      case "PAYMENT.SALE.DENIED": {
        console.info(`[paypal/webhook] ${eventType}`, {
          id: resource.id,
          amount: resource.amount,
          state: resource.state,
        });
        break;
      }
      default:
        console.info(`[paypal/webhook] unhandled event: ${eventType}`);
    }

    // Optional: verify webhook signature with PAYPAL_WEBHOOK_ID via PayPal verify-webhook-signature API

    return NextResponse.json({ received: true, type: eventType });
  } catch (error) {
    console.error("[paypal/webhook] handler error", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
