"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Bot } from "@/lib/data/bots";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const riskVariant = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

const chartTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  fontSize: "12px",
};

export function BotDetails({ bot }: { bot: Bot }) {
  const roiData = bot.equityCurve.map((point) => {
    const base = bot.equityCurve[0].equity;
    return {
      date: point.date,
      roi: ((point.equity - base) / base) * 100,
    };
  });

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass overflow-hidden rounded-2xl"
        >
          <div
            className={cn(
              "relative bg-gradient-to-br px-6 py-10 sm:px-10 sm:py-14",
              bot.imageGradient
            )}
          >
            <div className="grid-bg absolute inset-0 opacity-30" />
            <div className="relative">
              <div className="flex flex-wrap gap-2">
                {bot.verified && (
                  <Badge variant="success">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge variant={riskVariant[bot.riskLevel]}>{bot.riskLevel} Risk</Badge>
                <Badge variant="secondary">{bot.category}</Badge>
                <Badge variant="outline">{bot.strategy}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {bot.name}
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">{bot.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {bot.rating.toFixed(1)} rating
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {bot.subscribers.toLocaleString()} subscribers
                </span>
                <span>{bot.tradingPair}</span>
              </div>
            </div>
          </div>

          <div className="border-border/50 flex flex-col gap-4 border-t p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Monthly subscription</p>
              <p className="text-3xl font-bold">
                {formatCurrency(bot.price)}
                <span className="text-muted-foreground text-base font-normal">/mo</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => toast.success(`Subscribed to ${bot.name}`)}>
                Subscribe Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => toast.success(`${bot.name} queued for MT5 deployment`)}
              >
                <Rocket className="h-4 w-4" />
                Deploy to MT5
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              label: "ROI (12M)",
              value: formatPercent(bot.roi),
              icon: TrendingUp,
              color: "text-emerald-400",
            },
            {
              label: "Max Drawdown",
              value: `${bot.drawdown.toFixed(1)}%`,
              icon: TrendingDown,
              color: "text-amber-400",
            },
            {
              label: "Win Rate",
              value: `${bot.winRate.toFixed(1)}%`,
              icon: BarChart3,
              color: "text-sky-400",
            },
            {
              label: "Profit Factor",
              value: bot.profitFactor.toFixed(2),
              icon: CheckCircle2,
              color: "text-blue-400",
            },
          ].map((m) => (
            <Card key={m.label} className="border-border/70 bg-card/80">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="bg-muted/50 flex h-11 w-11 items-center justify-center rounded-xl">
                  <m.icon className={cn("h-5 w-5", m.color)} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">{m.label}</p>
                  <p className={cn("text-xl font-bold", m.color)}>{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8"
        >
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Performance Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="equity">
                <TabsList>
                  <TabsTrigger value="equity">Equity Curve</TabsTrigger>
                  <TabsTrigger value="roi">ROI</TabsTrigger>
                  <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
                </TabsList>

                <TabsContent value="equity" className="mt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bot.equityCurve}>
                        <defs>
                          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(value) => [formatCurrency(Number(value)), "Equity"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="equity"
                          stroke="#0EA5E9"
                          strokeWidth={2}
                          fill="url(#equityGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="roi" className="mt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={roiData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(v) => `${v.toFixed(0)}%`}
                        />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(value) => [`${Number(value).toFixed(2)}%`, "ROI"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="roi"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ fill: "#22C55E", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="drawdown" className="mt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bot.drawdownSeries}>
                        <defs>
                          <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Drawdown"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="drawdown"
                          stroke="#EF4444"
                          strokeWidth={2}
                          fill="url(#ddGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="mt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bot.monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Return"]}
                        />
                        <Bar dataKey="return" radius={[6, 6, 0, 0]} fill="#2563EB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bot.reviews.length > 0 ? (
                  bot.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-border/50 bg-muted/20 rounded-xl border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{review.author}</p>
                            <p className="text-muted-foreground text-xs">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-medium">{review.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">{review.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No reviews yet. Be the first to subscribe and share feedback.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {bot.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tags & bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass mt-8 rounded-2xl p-8 text-center"
        >
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {bot.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold">Ready to automate with {bot.name}?</h3>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
            Subscribe and deploy to your connected MT5 account in one click.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => toast.success(`Subscribed to ${bot.name}`)}>
              Subscribe — {formatCurrency(bot.price)}/mo
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => toast.success(`${bot.name} queued for MT5 deployment`)}
            >
              <Rocket className="h-4 w-4" />
              Deploy to MT5
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
