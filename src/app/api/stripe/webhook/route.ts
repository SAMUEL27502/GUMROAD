import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isStripeConfigured, planFromPriceId } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/**
 * Stripe webhook handler.
 * Configure endpoint: POST {APP_URL}/api/stripe/webhook
 * Events: checkout.session.completed, customer.subscription.*, invoice.*
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { received: true, mode: "demo", message: "Stripe not configured" },
      { status: 200 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev fallback when secret not set — parse JSON (not for production)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info("[stripe/webhook] checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
        });
        // Persist: map session.metadata.userId → User.plan / stripeCustomerId
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id ?? "";
        const mapped = planFromPriceId(priceId);
        console.info(`[stripe/webhook] ${event.type}`, {
          id: sub.id,
          status: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
          plan: mapped?.plan,
          interval: mapped?.interval,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.info("[stripe/webhook] subscription deleted", { id: sub.id });
        // Persist: set user plan → STARTER
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.info(`[stripe/webhook] ${event.type}`, {
          id: invoice.id,
          customer: invoice.customer,
          amount: invoice.amount_paid,
          status: invoice.status,
        });
        break;
      }
      default:
        console.info(`[stripe/webhook] unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    console.error("[stripe/webhook] handler error", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
