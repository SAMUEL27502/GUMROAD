"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingPlans } from "@/lib/data/platform";
import { cn, formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as your bot portfolio grows. No hidden fees on bot subscriptions.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={cn(
                  "relative h-full border-border/70 bg-card/80 transition-colors",
                  plan.popular && "border-sky-500/50 shadow-lg shadow-sky-500/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-1 text-white border-0">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => toast.success(`${plan.cta} — ${plan.name} plan selected`)}
                    asChild={plan.price === 0}
                  >
                    {plan.price === 0 ? (
                      <Link href="/register">{plan.cta}</Link>
                    ) : (
                      <span>{plan.cta}</span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          All plans include access to the marketplace. Bot subscription fees are billed separately
          by each EA provider.{" "}
          <Link href="/register" className="text-sky-400 hover:underline">
            Start free today
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
