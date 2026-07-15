"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CandlestickChart,
  Check,
  Gauge,
  LineChart,
  MousePointerClick,
  PieChart,
  Plug,
  Quote,
  Rocket,
  ShieldCheck,
  Star,
  Store,
  UserPlus,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BotCard } from "@/components/bots/bot-card";
import { CountUp } from "@/components/landing/count-up";
import {
  AnimatedGradient,
  AnimatedParticles,
  FloatingCard,
  HoverLift,
  Scale,
  Slide,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { getFeaturedBots } from "@/lib/data/bots";
import {
  features,
  homepageFaq,
  howItWorks,
  platformStats,
  pricingPlans,
  testimonials,
} from "@/lib/data/platform";
import { formatCurrency } from "@/lib/utils";

const featureIcons = {
  ShieldCheck,
  LineChart,
  Gauge,
  Zap,
  Store,
  PieChart,
  MousePointerClick,
  CandlestickChart,
};

const stepIcons = {
  UserPlus,
  Plug,
  Bot,
  Rocket,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export function LandingPage() {
  const featured = getFeaturedBots().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <AnimatedGradient variant="hero" />
        <AnimatedParticles count={12} />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <Slide direction="up" duration={0.6}>
              <p className="mb-6 text-sm font-semibold tracking-[0.2em] text-sky-400 uppercase">
                TradeBib
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Trade Smarter with <span className="gradient-text">Automated MT5 Bots</span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
                Browse, subscribe and deploy verified MetaTrader 5 Expert Advisors using real
                verified trading data.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/marketplace">
                    Browse Bots <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="glass" asChild>
                  <Link href="/marketplace">View Marketplace</Link>
                </Button>
              </div>
            </Slide>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <Scale delay={0.2} duration={0.7} from={0.96}>
              <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Live Equity", value: "$24,850", change: "+8.7%", delay: 0 },
                    { label: "Open Trades", value: "3", change: "Synced", delay: 0.4 },
                    { label: "Active Bots", value: "4", change: "Running", delay: 0.8 },
                  ].map((item) => (
                    <FloatingCard key={item.label} delay={item.delay} amplitude={10} duration={6}>
                      <div className="border-border/60 bg-card/60 rounded-2xl border p-4">
                        <p className="text-muted-foreground text-xs">{item.label}</p>
                        <p className="mt-1 text-2xl font-bold">{item.value}</p>
                        <p className="mt-1 text-xs text-emerald-400">{item.change}</p>
                      </div>
                    </FloatingCard>
                  ))}
                </div>
                <div className="mt-6 h-28 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-transparent">
                  <svg viewBox="0 0 400 100" className="h-full w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroGraph" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,70 C40,65 60,40 100,45 C140,50 160,20 200,28 C240,36 260,55 300,40 C340,25 360,30 400,18 L400,100 L0,100 Z"
                      fill="url(#heroGraph)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    />
                    <motion.path
                      d="M0,70 C40,65 60,40 100,45 C140,50 160,20 200,28 C240,36 260,55 300,40 C340,25 360,30 400,18"
                      fill="none"
                      stroke="#0EA5E9"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>
            </Scale>
          </div>
        </div>
      </section>

      {/* Animated statistics */}
      <section className="border-border/50 bg-card/30 border-y">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {platformStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <CountUp
                value={stat.value}
                display={stat.display}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.label.includes("ROI") || stat.label.includes("Volume") ? 1 : 0}
              />
              <p className="text-muted-foreground mt-2 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why TradeBib</h2>
          <p className="text-muted-foreground mt-4">
            Everything you need to discover, verify, and deploy automated trading strategies.
          </p>
        </motion.div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = featureIcons[feature.icon as keyof typeof featureIcons];
            return (
              <StaggerItem key={feature.title}>
                <HoverLift>
                  <Card className="border-border/70 bg-card/70 h-full transition-colors hover:border-sky-500/40">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Featured Bots */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <motion.div {...fadeUp}>
            <Badge variant="secondary" className="mb-3">
              Marketplace
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Bots</h2>
            <p className="text-muted-foreground mt-3">
              Top verified Expert Advisors with live performance metrics.
            </p>
          </motion.div>
          <Button variant="outline" asChild>
            <Link href="/marketplace">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((bot, i) => (
            <BotCard key={bot.id} bot={bot} index={i} />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="border-border/50 bg-card/20 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
            <Badge variant="secondary" className="mb-4">
              How it Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From signup to live automation
            </h2>
            <p className="text-muted-foreground mt-4">
              Four steps to deploy verified MT5 bots with confidence.
            </p>
          </motion.div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute top-10 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent lg:block" />
            {howItWorks.map((step, i) => {
              const Icon = stepIcons[step.icon as keyof typeof stepIcons];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <Card variant="glass" className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold tracking-widest text-sky-400">
                          {step.step}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by serious traders
          </h2>
          <p className="text-muted-foreground mt-4">
            Operators and retail traders use TradeBib to automate with verified performance.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-border/70 bg-card/80 h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="mb-4 h-8 w-8 text-sky-400/50" />
                  <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                    “{item.quote}”
                  </p>
                  <div className="border-border/60 mt-6 flex items-center gap-3 border-t pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-300">
                      {item.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{item.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-border/50 bg-card/20 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
            <Badge variant="secondary" className="mb-4">
              Pricing Preview
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple plans for every stage
            </h2>
            <p className="text-muted-foreground mt-4">
              Start free, then scale automation as your portfolio grows.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Card
                  className={`border-border/70 bg-card/80 relative h-full ${
                    plan.popular ? "border-sky-500/50 shadow-lg shadow-sky-500/10" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-2">
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground text-sm">/{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/pricing">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" asChild>
              <Link href="/pricing">
                Compare full pricing details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div className="text-center" {...fadeUp}>
          <Badge variant="secondary" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground mt-4">
            Quick answers about verification, security, and subscriptions.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion
            type="single"
            collapsible
            className="border-border/70 bg-card/60 rounded-2xl border px-5"
          >
            {homepageFaq.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent p-10 text-center sm:p-16"
        >
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to automate your edge?</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              Connect MetaTrader 5, subscribe to verified bots, and monitor everything from one
              premium dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/mt5">Connect MT5</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
