"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pricingComparison, pricingPlans } from "@/lib/data/platform";
import { cn, formatCurrency } from "@/lib/utils";

type Billing = "monthly" | "yearly";

function planPrice(plan: (typeof pricingPlans)[number], billing: Billing) {
  if (plan.price === 0) return { display: "Free", suffix: "", savings: null as string | null };
  if (billing === "yearly") {
    const perMonth = plan.yearlyPrice / 12;
    return {
      display: formatCurrency(perMonth),
      suffix: "/mo",
      savings: `Billed ${formatCurrency(plan.yearlyPrice)}/yr · save ~17%`,
    };
  }
  return {
    display: formatCurrency(plan.price),
    suffix: "/mo",
    savings: null as string | null,
  };
}

function ComparisonCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-emerald-400" aria-label="Included" />;
  }
  if (value === false) {
    return <X className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="Not included" />;
  }
  return <span className="text-sm font-medium">{value}</span>;
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Starter, Pro, and Elite — scale as your bot portfolio grows. No hidden fees on bot
            subscriptions.
          </p>
        </motion.div>

        {/* Monthly / yearly switch */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-2.5">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billing === "monthly" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={billing === "yearly"}
              onCheckedChange={(checked) => setBilling(checked ? "yearly" : "monthly")}
              aria-label="Toggle yearly billing"
            />
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billing === "yearly" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
            </span>
            <Badge variant="success" className="ml-1">
              Save 17%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {billing === "yearly"
              ? "Yearly billing — two months free on Pro & Elite"
              : "Switch to yearly and save ~17%"}
          </p>
        </motion.div>

        {/* Animated pricing cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => {
            const price = planPrice(plan, billing);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, type: "spring", stiffness: 120 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <Card
                  className={cn(
                    "relative h-full overflow-hidden border-border/70 bg-card/80 transition-shadow",
                    plan.popular &&
                      "border-sky-500/50 shadow-lg shadow-sky-500/15 ring-1 ring-sky-500/20"
                  )}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Badge className="border-0 bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-1 text-white">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4 min-h-[4.5rem]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${plan.id}-${billing}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-4xl font-bold">{price.display}</span>
                          {price.suffix && (
                            <span className="text-muted-foreground">{price.suffix}</span>
                          )}
                          {price.savings ? (
                            <p className="mt-1 text-xs text-emerald-400">{price.savings}</p>
                          ) : (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {plan.price === 0 ? "Forever free" : "Billed monthly"}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fi) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.08 + fi * 0.04 }}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link
                        href={
                          plan.price === 0
                            ? "/register"
                            : `/register?plan=${plan.id}&billing=${billing}`
                        }
                        onClick={() =>
                          toast.success(`${plan.cta} — ${plan.name} (${billing}) selected`)
                        }
                      >
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Feature comparison</h2>
            <p className="mt-2 text-muted-foreground">
              See exactly what&apos;s included in Starter, Pro, and Elite
            </p>
          </div>

          <Card className="overflow-hidden border-border/70 bg-card/80">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] pl-6">Feature</TableHead>
                    <TableHead className="text-center">Starter</TableHead>
                    <TableHead className="text-center text-sky-300">Pro</TableHead>
                    <TableHead className="pr-6 text-center">Elite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingComparison.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="pl-6 font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center">
                        <ComparisonCell value={row.starter} />
                      </TableCell>
                      <TableCell className="bg-sky-500/5 text-center">
                        <ComparisonCell value={row.pro} />
                      </TableCell>
                      <TableCell className="pr-6 text-center">
                        <ComparisonCell value={row.elite} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass mt-16 rounded-2xl p-8 text-center sm:p-10"
        >
          <h3 className="text-2xl font-bold">Ready to automate?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create a free Starter account, or jump to Pro / Elite with{" "}
            {billing === "yearly" ? "yearly" : "monthly"} billing.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Start Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/register?plan=pro&billing=${billing}`}>Go Pro</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/register?plan=elite&billing=${billing}`}>Go Elite</Link>
            </Button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Minus className="h-3 w-3" />
            Bot subscription fees are billed separately by each EA provider
          </p>
        </motion.div>
      </div>
    </div>
  );
}
