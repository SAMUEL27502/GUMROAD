"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  type: "BUY" | "SELL";
  profit: number;
  notes: string;
  bot?: string;
}

const initialEntries: JournalEntry[] = [
  {
    id: "j1",
    date: "2026-07-14",
    symbol: "XAUUSD",
    type: "BUY",
    profit: 84.2,
    notes: "GoldScalper caught London open momentum. Tight stop held.",
    bot: "GoldScalper Pro",
  },
  {
    id: "j2",
    date: "2026-07-13",
    symbol: "EURUSD",
    type: "SELL",
    profit: 32.1,
    notes: "EuroTrend AI trend continuation. Held through minor pullback.",
    bot: "EuroTrend AI",
  },
  {
    id: "j3",
    date: "2026-07-12",
    symbol: "GBPUSD",
    type: "BUY",
    profit: -18.4,
    notes: "False breakout at London open. Reduced lot size next session.",
    bot: "BreakoutHunter",
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [profit, setProfit] = useState("");
  const [notes, setNotes] = useState("");
  const [bot, setBot] = useState("");

  const totalProfit = entries.reduce((sum, e) => sum + e.profit, 0);
  const wins = entries.filter((e) => e.profit > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) {
      toast.error("Symbol is required");
      return;
    }

    const entry: JournalEntry = {
      id: `j${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      symbol: symbol.toUpperCase(),
      type,
      profit: Number(profit) || 0,
      notes: notes.trim(),
      bot: bot.trim() || undefined,
    };

    setEntries((prev) => [entry, ...prev]);
    setSymbol("");
    setProfit("");
    setNotes("");
    setBot("");
    toast.success("Journal entry added");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry removed");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 text-sky-400">
          <BookOpen className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-wider uppercase">Trading Journal</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          <span className="gradient-text">Your Trade Log</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Document trades, review decisions, and track performance over time.
        </p>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Entries", value: entries.length.toString() },
          {
            label: "Net P/L",
            value: formatCurrency(totalProfit),
            color: totalProfit >= 0 ? "text-emerald-400" : "text-red-400",
          },
          {
            label: "Win Rate",
            value: entries.length ? `${((wins / entries.length) * 100).toFixed(0)}%` : "—",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass border-border/60">
              <CardContent className="p-5">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color ?? ""}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="glass border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-sky-400" />
              Add Entry
            </CardTitle>
            <CardDescription>Log a new trade or session note</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g. XAUUSD"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    {(["BUY", "SELL"] as const).map((t) => (
                      <Button
                        key={t}
                        type="button"
                        size="sm"
                        variant={type === t ? "default" : "outline"}
                        onClick={() => setType(t)}
                        className="flex-1"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profit">P/L ($)</Label>
                  <Input
                    id="profit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot">Bot (optional)</Label>
                <Input
                  id="bot"
                  placeholder="Bot name"
                  value={bot}
                  onChange={(e) => setBot(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="What happened? Lessons learned?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-xl border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="glass border-border/60">
                  <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{entry.symbol}</span>
                        <Badge variant={entry.type === "BUY" ? "success" : "danger"}>
                          {entry.type}
                        </Badge>
                        {entry.bot && <Badge variant="outline">{entry.bot}</Badge>}
                        <span className="text-muted-foreground text-xs">{entry.date}</span>
                      </div>
                      {entry.notes && (
                        <p className="text-muted-foreground text-sm">{entry.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-lg font-bold ${entry.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {entry.profit >= 0 ? "+" : ""}
                        {formatCurrency(entry.profit)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(entry.id)}
                        aria-label="Delete entry"
                      >
                        <Trash2 className="text-muted-foreground h-4 w-4 hover:text-red-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
