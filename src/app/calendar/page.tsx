"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { economicEvents } from "@/lib/data/platform";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const impactVariant = {
  HIGH: "danger" as const,
  MEDIUM: "warning" as const,
  LOW: "low" as const,
};

const currencyColors: Record<string, string> = {
  USD: "text-emerald-400",
  EUR: "text-sky-400",
  GBP: "text-violet-400",
  JPY: "text-rose-400",
};

export default function CalendarPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 text-sky-400">
          <Calendar className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wider">Economic Calendar</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          <span className="gradient-text">Today&apos;s Events</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{today}</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>Scheduled Releases</CardTitle>
          <CardDescription>
            High-impact events that may affect your subscribed bots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {economicEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <span
                    className={`text-sm font-bold ${currencyColors[event.currency] ?? "text-foreground"}`}
                  >
                    {event.currency}
                  </span>
                  <p className="font-medium">{event.event}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={impactVariant[event.impact as keyof typeof impactVariant]}>
                    {event.impact}
                  </Badge>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Forecast: <span className="text-foreground">{event.forecast}</span>
                    </span>
                    <span>
                      Previous: <span className="text-foreground">{event.previous}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "High Impact", count: economicEvents.filter((e) => e.impact === "HIGH").length, color: "text-red-400" },
          { label: "Medium Impact", count: economicEvents.filter((e) => e.impact === "MEDIUM").length, color: "text-amber-400" },
          { label: "Low Impact", count: economicEvents.filter((e) => e.impact === "LOW").length, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <Card className="glass border-border/60">
              <CardContent className="flex items-center justify-between p-5">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.count}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
