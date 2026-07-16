"use client";

import { useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tradingSignals, type SignalStatus } from "@/lib/data/signals";
import { cn } from "@/lib/utils";

const filters: Array<{ id: "ALL" | SignalStatus; label: string }> = [
  { id: "ALL", label: "All" },
  { id: "ACTIVE", label: "Active" },
  { id: "HIT_TP", label: "Hit TP" },
  { id: "HIT_SL", label: "Hit SL" },
  { id: "EXPIRED", label: "Expired" },
];

const statusVariant: Record<SignalStatus, "success" | "danger" | "warning" | "outline"> = {
  ACTIVE: "success",
  HIT_TP: "success",
  HIT_SL: "danger",
  EXPIRED: "outline",
};

export default function SignalsPage() {
  const [status, setStatus] = useState<"ALL" | SignalStatus>("ALL");

  const filtered = useMemo(
    () => (status === "ALL" ? tradingSignals : tradingSignals.filter((s) => s.status === status)),
    [status]
  );

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[100px]"
        aria-hidden
      />

      <Container padY="lg" className="relative">
        <PageHeader
          badge="Signals"
          icon={Radio}
          title={
            <>
              Trading <span className="gradient-text">Signals</span>
            </>
          }
          description="Curated entries from verified TradeBib bots with confidence scores and clear risk levels."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={status === f.id ? "default" : "outline"}
              onClick={() => setStatus(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((sig) => (
            <Card key={sig.id} className="glass border-border/60 bg-card/80">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">{sig.pair}</CardTitle>
                  <Badge variant={sig.side === "BUY" ? "success" : "danger"}>{sig.side}</Badge>
                  <Badge variant={statusVariant[sig.status]}>{sig.status.replace("_", " ")}</Badge>
                  <Badge variant="outline">{sig.timeframe}</Badge>
                </div>
                <CardDescription>
                  {sig.source} · {new Date(sig.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Entry</p>
                    <p className="font-semibold tabular-nums">{sig.entry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Take profit</p>
                    <p className="font-semibold tabular-nums text-emerald-400">{sig.tp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stop loss</p>
                    <p className="font-semibold tabular-nums text-red-400">{sig.sl}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-sky-300">{sig.confidence}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn("h-full rounded-full bg-sky-500")}
                      style={{ width: `${sig.confidence}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{sig.rationale}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No signals for this filter.</p>
        )}
      </Container>
    </div>
  );
}
