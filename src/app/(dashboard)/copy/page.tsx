"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { copyLeaders, myCopyAllocations, type CopyAllocation } from "@/lib/data/copy-trading";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const riskVariant = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

export default function CopyTradingPage() {
  const [allocations, setAllocations] = useState<CopyAllocation[]>(myCopyAllocations);

  const leadersById = useMemo(
    () => Object.fromEntries(copyLeaders.map((l) => [l.id, l])),
    []
  );

  function startCopy(leaderId: string, name: string) {
    const existing = allocations.find((a) => a.leaderId === leaderId);
    if (existing) {
      setAllocations((prev) =>
        prev.map((a) => (a.leaderId === leaderId ? { ...a, status: "ACTIVE" } : a))
      );
      toast.success(`Resumed copying ${name}`);
      return;
    }
    const leader = leadersById[leaderId];
    setAllocations((prev) => [
      ...prev,
      {
        id: `ca-${Date.now()}`,
        leaderId,
        allocation: leader?.minAllocation ?? 500,
        pnl: 0,
        status: "ACTIVE",
      },
    ]);
    toast.success(`Started copying ${name}`, {
      description: `Initial allocation ${formatCurrency(leader?.minAllocation ?? 500)}`,
    });
  }

  function pauseCopy(leaderId: string, name: string) {
    setAllocations((prev) =>
      prev.map((a) => (a.leaderId === leaderId ? { ...a, status: "PAUSED" } : a))
    );
    toast.message(`Paused copying ${name}`);
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <Container padY="md" className="relative">
        <PageHeader
          badge="Social"
          icon={Copy}
          eyebrow="Copy trading"
          title={
            <>
              Copy <span className="gradient-text">Trading</span>
            </>
          }
          description="Mirror verified leaders with transparent fees, risk labels, and live allocation controls."
        />

        <Card className="mb-8 glass border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Leaders</CardTitle>
            <CardDescription>Open strategies accepting new copiers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead>30d ROI</TableHead>
                  <TableHead>Max DD</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {copyLeaders.map((leader) => {
                  const mine = allocations.find((a) => a.leaderId === leader.id);
                  const isActive = mine?.status === "ACTIVE";
                  return (
                    <TableRow key={leader.id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/traders/${leader.handle}`}
                            className="font-semibold hover:text-sky-300"
                          >
                            {leader.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{leader.strategy}</p>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-semibold tabular-nums",
                          leader.roi30d >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {formatPercent(leader.roi30d)}
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {leader.maxDd.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={riskVariant[leader.risk]}>{leader.risk}</Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">{leader.feePercent}%</TableCell>
                      <TableCell className="text-right">
                        {!leader.open ? (
                          <Badge variant="outline">Closed</Badge>
                        ) : isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pauseCopy(leader.id, leader.name)}
                          >
                            <Pause className="mr-1.5 h-3.5 w-3.5" />
                            Pause
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => startCopy(leader.id, leader.name)}>
                            <Play className="mr-1.5 h-3.5 w-3.5" />
                            {mine ? "Resume" : "Copy"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-lg font-bold">My allocations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {allocations.map((alloc) => {
            const leader = leadersById[alloc.leaderId];
            if (!leader) return null;
            return (
              <Card key={alloc.id} className="glass border-border/60 bg-card/80">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{leader.name}</CardTitle>
                    <Badge variant={alloc.status === "ACTIVE" ? "success" : "outline"}>
                      {alloc.status}
                    </Badge>
                  </div>
                  <CardDescription>{leader.strategy}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Allocation</p>
                    <p className="text-lg font-bold tabular-nums">
                      {formatCurrency(alloc.allocation)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">PnL</p>
                    <p
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        alloc.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {alloc.pnl >= 0 ? "+" : ""}
                      {formatCurrency(alloc.pnl)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
