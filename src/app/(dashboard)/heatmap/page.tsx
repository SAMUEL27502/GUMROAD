"use client";

import { LayoutGrid } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { heatColor, portfolioHeatmap } from "@/lib/data/heatmap";
import { cn, formatPercent } from "@/lib/utils";

const riskVariant = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

export default function HeatmapPage() {
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <Container padY="md" className="relative">
        <PageHeader
          badge="Portfolio"
          icon={LayoutGrid}
          eyebrow="Heatmap"
          title={
            <>
              Portfolio <span className="gradient-text">Heatmap</span>
            </>
          }
          description="Weekly PnL intensity by pair and bot. Darker emerald means stronger gains; red marks drawdowns."
        />

        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Legend</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-emerald-500/80" /> Strong gain
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-emerald-500/20" /> Flat / small
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-red-500/70" /> Drawdown
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioHeatmap.map((cell) => (
            <Card
              key={cell.id}
              className={cn(
                "overflow-hidden border-border/60 transition-transform hover:scale-[1.02]",
                heatColor(cell.pnl)
              )}
            >
              <CardContent className="flex min-h-[140px] flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold tracking-tight">{cell.pair}</p>
                    <p className="text-xs opacity-80">{cell.bot}</p>
                  </div>
                  <Badge variant={riskVariant[cell.risk]} className="bg-black/20 text-[10px]">
                    {cell.risk}
                  </Badge>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider opacity-70">PnL (week)</p>
                    <p className="text-2xl font-bold tabular-nums">{formatPercent(cell.pnl)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider opacity-70">Allocation</p>
                    <p className="text-sm font-semibold tabular-nums">{cell.allocation}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
