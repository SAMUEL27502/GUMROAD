"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Loader2,
  Shield,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlanTier } from "@/lib/auth/user";
import { pricingPlans } from "@/lib/data/platform";
import { PLAN_RANK, type BillingInterval, type PaymentProviderId } from "@/lib/payments/types";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBillingStore } from "@/stores/billing-store";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : data.error?.formErrors?.[0] || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export default function BillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user, updateProfile } = useAuthStore();
  const billing = useBillingStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [modes, setModes] = useState<{
    stripe: "demo" | "live";
    paypal: "demo" | "live";
  } | null>(null);

  const provider = billing.provider;
  const subscriptionId =
    provider === "paypal" ? billing.paypalSubscriptionId : billing.stripeSubscriptionId;
  const customerId =
    provider === "paypal" ? billing.paypalSubscriberId : billing.stripeCustomerId;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) =>
        setModes({
          stripe: d.providers?.stripe?.mode ?? "demo",
          paypal: d.providers?.paypal?.mode ?? "demo",
        })
      )
      .catch(() => setModes({ stripe: "demo", paypal: "demo" }));
  }, []);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const plan = searchParams.get("plan") as PlanTier | null;
    const interval = (searchParams.get("interval") as BillingInterval | null) || "monthly";
    const providerParam = (searchParams.get("provider") as PaymentProviderId | null) || provider;
    if (checkout === "success" && plan && (plan === "PRO" || plan === "ELITE")) {
      billing.setFromCheckout(plan, interval, providerParam);
      updateProfile({ plan });
      toast.success(`Subscribed to ${plan} via ${providerParam}`);
      router.replace("/billing");
    }
    if (searchParams.get("portal") === "demo") {
      toast.message("Customer Portal (demo)", {
        description: `Configure ${providerParam} credentials for the live portal.`,
      });
      router.replace("/billing");
    }
    if (searchParams.get("portal") === "paypal") {
      toast.message("PayPal subscription management", {
        description: "Use Upgrade / Downgrade / Cancel below, or manage at paypal.com.",
      });
      router.replace("/billing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const intent = searchParams.get("intent");
    const plan = searchParams.get("plan") as PlanTier | null;
    const interval = (searchParams.get("interval") as BillingInterval | null) || "monthly";
    const providerParam =
      (searchParams.get("provider") as PaymentProviderId | null) || billing.provider;
    if (intent === "checkout" && (plan === "PRO" || plan === "ELITE") && isAuthenticated) {
      void (async () => {
        setBusy(`checkout-${plan}`);
        try {
          if (providerParam !== billing.provider) billing.setProvider(providerParam);
          const data = await postJson<{ url: string }>("/api/billing", {
            provider: providerParam,
            plan,
            interval,
            customerEmail: user?.email,
            userId: user?.id,
            customerId:
              providerParam === "paypal"
                ? billing.paypalSubscriberId ?? undefined
                : billing.stripeCustomerId ?? undefined,
          });
          if (data.url) window.location.href = data.url;
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Checkout failed");
          router.replace("/billing");
        } finally {
          setBusy(null);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated]);

  const startCheckout = useCallback(
    async (plan: "PRO" | "ELITE", interval: BillingInterval = billing.interval) => {
      setBusy(`checkout-${plan}`);
      try {
        const data = await postJson<{ url: string; mode: string }>("/api/billing", {
          provider,
          plan,
          interval,
          customerEmail: user?.email,
          userId: user?.id,
          customerId: customerId ?? undefined,
        });
        if (data.url) window.location.href = data.url;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Checkout failed");
      } finally {
        setBusy(null);
      }
    },
    [billing.interval, customerId, provider, user]
  );

  const openPortal = useCallback(async () => {
    setBusy("portal");
    try {
      const data = await postJson<{ url: string }>("/api/billing?intent=portal", {
        provider,
        customerId: customerId ?? undefined,
        returnUrl: `${window.location.origin}/billing`,
      });
      if (data.url) window.location.href = data.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Portal failed");
    } finally {
      setBusy(null);
    }
  }, [customerId, provider]);

  const changePlan = useCallback(
    async (action: "upgrade" | "downgrade", plan: PlanTier) => {
      setBusy(`${action}-${plan}`);
      try {
        if (
          action === "upgrade" &&
          (billing.status === "NONE" || billing.plan === "STARTER") &&
          (plan === "PRO" || plan === "ELITE")
        ) {
          await startCheckout(plan);
          return;
        }

        const result = await postJson<{ message?: string }>("/api/billing?intent=subscription", {
          provider,
          action,
          plan,
          interval: billing.interval,
          subscriptionId: subscriptionId ?? undefined,
          currentPlan: billing.plan,
        });

        if (result.message?.startsWith("Approval required:")) {
          const url = result.message.replace("Approval required: ", "");
          window.location.href = url;
          return;
        }

        if (action === "upgrade") {
          billing.upgrade(plan);
          updateProfile({ plan });
          toast.success(`Upgraded to ${plan}`);
        } else {
          billing.downgrade(plan);
          updateProfile({ plan });
          toast.success(
            plan === "STARTER"
              ? "Downgrade to Starter scheduled at period end"
              : `Downgraded to ${plan}`
          );
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Plan change failed");
      } finally {
        setBusy(null);
      }
    },
    [billing, provider, startCheckout, subscriptionId, updateProfile]
  );

  const cancelSubscription = useCallback(async () => {
    setBusy("cancel");
    try {
      await postJson("/api/billing?intent=subscription", {
        provider,
        action: "cancel",
        subscriptionId: subscriptionId ?? undefined,
        currentPlan: billing.plan,
      });
      billing.cancel();
      toast.message("Cancellation scheduled", {
        description: "Access continues until the end of the billing period.",
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setBusy(null);
    }
  }, [billing, provider, subscriptionId]);

  const resumeSubscription = useCallback(async () => {
    setBusy("resume");
    try {
      await postJson("/api/billing?intent=subscription", {
        provider,
        action: "resume",
        subscriptionId: subscriptionId ?? undefined,
      });
      billing.resume();
      toast.success("Subscription resumed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resume failed");
    } finally {
      setBusy(null);
    }
  }, [billing, provider, subscriptionId]);

  if (isLoading || !isAuthenticated) return <PageLoader />;

  const currentPlanMeta = pricingPlans.find((p) => p.id === billing.plan.toLowerCase());
  const activeMode = modes?.[provider] ?? "demo";
  const statusVariant =
    billing.status === "ACTIVE" || billing.status === "TRIALING"
      ? "success"
      : billing.status === "PAST_DUE"
        ? "warning"
        : billing.status === "CANCELLED"
          ? "danger"
          : "outline";

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Multi-provider billing</Badge>
            <Badge variant={activeMode === "live" ? "success" : "outline"}>
              {provider} · {activeMode}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Subscription & <span className="gradient-text">Billing</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stripe and PayPal share one reusable payment architecture — checkout, portal, invoices,
            upgrades, and webhooks.
          </p>
        </motion.div>

        {/* Provider selector */}
        <Card className="mb-6 border-border/70 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment provider</CardTitle>
            <CardDescription>Reusable adapter pattern — switch without changing plan logic</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(["stripe", "paypal"] as PaymentProviderId[]).map((id) => (
              <Button
                key={id}
                size="sm"
                variant={provider === id ? "default" : "outline"}
                onClick={() => billing.setProvider(id)}
              >
                {id === "stripe" ? "Stripe" : "PayPal"}
                <Badge variant="outline" className="ml-1 text-[10px]">
                  {modes?.[id] ?? "…"}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6 border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-sky-400" />
              Subscription status
            </CardTitle>
            <CardDescription>
              Current platform plan via {provider === "paypal" ? "PayPal" : "Stripe"} subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xl font-bold">{billing.plan}</p>
                  <Badge variant={statusVariant}>{billing.status}</Badge>
                  <Badge variant="secondary">{provider}</Badge>
                  {billing.cancelAtPeriodEnd && (
                    <Badge variant="warning">Cancels at period end</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{currentPlanMeta?.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Billing · {billing.interval} · Period ends{" "}
                  {new Date(billing.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold">
                  {billing.plan === "STARTER"
                    ? "Free"
                    : formatCurrency(
                        billing.interval === "yearly"
                          ? (currentPlanMeta?.yearlyPrice ?? 0)
                          : (currentPlanMeta?.price ?? 0)
                      )}
                  {billing.plan !== "STARTER" && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{billing.interval === "yearly" ? "yr" : "mo"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={openPortal} disabled={busy === "portal"}>
                {busy === "portal" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {provider === "paypal" ? "Manage PayPal" : "Customer Portal"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">View plans</Link>
              </Button>
              {billing.cancelAtPeriodEnd ? (
                <Button onClick={resumeSubscription} disabled={busy === "resume"}>
                  Resume subscription
                </Button>
              ) : billing.plan !== "STARTER" && billing.status === "ACTIVE" ? (
                <Button
                  variant="outline"
                  className="text-red-400"
                  onClick={cancelSubscription}
                  disabled={busy === "cancel"}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {(["STARTER", "PRO", "ELITE"] as PlanTier[]).map((plan) => {
            const meta = pricingPlans.find((p) => p.id === plan.toLowerCase())!;
            const rank = PLAN_RANK[plan];
            const current = PLAN_RANK[billing.plan];
            const isCurrent = plan === billing.plan;
            return (
              <Card
                key={plan}
                className={cn(
                  "border-border/70 bg-card/80",
                  isCurrent && "border-sky-500/50 ring-1 ring-sky-500/20"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{meta.name}</CardTitle>
                  <CardDescription>
                    {meta.price === 0 ? "Free" : `${formatCurrency(meta.price)}/mo`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isCurrent ? (
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Current
                    </Badge>
                  ) : rank > current ? (
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!!busy}
                      onClick={() => changePlan("upgrade", plan)}
                    >
                      <ArrowUpCircle className="h-4 w-4" />
                      {billing.plan === "STARTER" || billing.status === "NONE"
                        ? `Checkout (${provider})`
                        : "Upgrade"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="sm"
                      variant="outline"
                      disabled={!!busy}
                      onClick={() => changePlan("downgrade", plan)}
                    >
                      <ArrowDownCircle className="h-4 w-4" />
                      Downgrade
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/70 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-sky-400" />
                Invoices
              </CardTitle>
              <CardDescription>Payment history across providers</CardDescription>
            </div>
            <Badge variant="outline">{billing.invoices.length}</Badge>
          </CardHeader>
          <CardContent>
            {billing.invoices.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing.invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                      <TableCell>{inv.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(inv.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === "paid" ? "success" : "warning"}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Webhooks:
          <code className="rounded bg-muted px-1">/api/stripe/webhook</code>
          <code className="rounded bg-muted px-1">/api/paypal/webhook</code>
          · Unified API: <code className="rounded bg-muted px-1">/api/billing</code>
        </p>
      </div>
    </div>
  );
}
