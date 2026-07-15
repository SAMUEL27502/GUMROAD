"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  fontSize: "12px",
};

export default function CalculatorPage() {
  const [capital, setCapital] = useState(10000);
  const [monthlyRoi, setMonthlyRoi] = useState(8);
  const [months, setMonths] = useState(12);

  const { chartData, finalBalance, totalProfit, totalReturn } = useMemo(() => {
    const data: { month: string; balance: number; profit: number }[] = [];
    let balance = capital;

    for (let i = 0; i <= months; i++) {
      data.push({
        month: i === 0 ? "Start" : `M${i}`,
        balance: Math.round(balance * 100) / 100,
        profit: Math.round((balance - capital) * 100) / 100,
      });
      if (i < months) {
        balance *= 1 + monthlyRoi / 100;
      }
    }

    const final = data[data.length - 1]?.balance ?? capital;
    return {
      chartData: data,
      finalBalance: final,
      totalProfit: final - capital,
      totalReturn: ((final - capital) / capital) * 100,
    };
  }, [capital, monthlyRoi, months]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Profit Calculator</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Project compound growth based on starting capital, monthly ROI, and time horizon.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="glass border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>Adjust your assumptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="capital">Starting Capital ($)</Label>
              <Input
                id="capital"
                type="number"
                min={100}
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roi">Monthly ROI (%)</Label>
              <Input
                id="roi"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={monthlyRoi}
                onChange={(e) => setMonthlyRoi(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="months">Time Horizon (months)</Label>
              <Input
                id="months"
                type="number"
                min={1}
                max={120}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-3 rounded-xl bg-muted/40 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Final Balance</span>
                <span className="font-bold text-emerald-400">{formatCurrency(finalBalance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Profit</span>
                <span className="font-bold">{formatCurrency(totalProfit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Return</span>
                <span className="font-bold text-sky-400">+{totalReturn.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Projected Growth</CardTitle>
            <CardDescription>
              Compound growth at {monthlyRoi}% monthly over {months} months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [formatCurrency(Number(value)), "Balance"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#0EA5E9"
                    fill="url(#balanceGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Projections are hypothetical and do not account for drawdowns, fees, or slippage. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
