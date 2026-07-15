"use client";

import { LineChart, PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  AreaPerformanceChart,
  BalanceChart,
  BarPerformanceChart,
  DonutChart,
  DrawdownChart,
  LinePerformanceChart,
} from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  balanceSeries,
  dashboardMetrics,
  drawdownSeries,
  monthlyProfitSeries,
  portfolioPerformance,
  riskDistribution,
  roiSeries,
} from "@/lib/data/platform";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function DashboardCharts() {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-sky-400" />
            Performance Charts
          </CardTitle>
          <CardDescription>
            Portfolio, monthly profit, ROI, risk, balance, and drawdown — hover for details
          </CardDescription>
        </div>
        <Badge variant="secondary">{formatPercent(dashboardMetrics.monthlyRoi)} MTD</Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="portfolio">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Profit</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <AreaPerformanceChart
              data={portfolioPerformance}
              dataKey="value"
              xKey="month"
              name="Portfolio"
              color="#0EA5E9"
              valueFormatter={(v) => formatCurrency(v)}
            />
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <BarPerformanceChart
              data={monthlyProfitSeries}
              dataKey="profit"
              xKey="month"
              name="Profit"
              valueFormatter={(v) => `${v >= 0 ? "+" : ""}${formatCurrency(v)}`}
            />
          </TabsContent>

          <TabsContent value="roi" className="mt-6">
            <LinePerformanceChart
              data={roiSeries}
              dataKey="roi"
              xKey="month"
              name="ROI"
              color="#22C55E"
              valueFormatter={(v) => formatPercent(v)}
            />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <PieChart className="h-4 w-4 text-amber-400" />
                  Risk allocation
                </p>
                <DonutChart data={riskDistribution} />
                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
                  {riskDistribution.map((r) => (
                    <span key={r.name} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      {r.name} {r.value}%
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg drawdown</span>
                  <span className="font-semibold text-amber-400">
                    {dashboardMetrics.averageDrawdown.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Open trades</span>
                  <span className="font-semibold">{dashboardMetrics.openTrades}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active bots</span>
                  <span className="font-semibold">{dashboardMetrics.activeBots}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly ROI</span>
                  <span className="font-semibold text-emerald-400">
                    {formatPercent(dashboardMetrics.monthlyRoi)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="balance" className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 text-sky-400" />
              Balance vs equity
            </p>
            <BalanceChart data={balanceSeries} />
          </TabsContent>

          <TabsContent value="drawdown" className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Peak-to-trough drawdown
            </p>
            <DrawdownChart data={drawdownSeries} />
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Hover any point for interactive tooltips
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
