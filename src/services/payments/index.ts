import type { PaymentProvider, PaymentProviderId } from "@/services/payments/types";
import { createPayPalProvider } from "@/services/payments/paypal-provider";
import { createStripeProvider } from "@/services/payments/stripe-provider";

export function getPaymentProvider(id: PaymentProviderId = "stripe"): PaymentProvider {
  if (id === "paypal") return createPayPalProvider();
  return createStripeProvider();
}

export function listPaymentProviders(): PaymentProviderId[] {
  return ["stripe", "paypal"];
}

export function providerStatus() {
  const stripe = createStripeProvider();
  const paypal = createPayPalProvider();
  return {
    stripe: { configured: stripe.isConfigured(), mode: stripe.isConfigured() ? "live" : "demo" },
    paypal: { configured: paypal.isConfigured(), mode: paypal.isConfigured() ? "live" : "demo" },
  };
}
