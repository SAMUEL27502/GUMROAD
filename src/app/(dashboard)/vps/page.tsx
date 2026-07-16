"use client";

import { Cpu, HardDrive, Server, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { vpsCatalog, vpsInstances, vpsMetrics } from "@/lib/data/vps";
import { cn, formatCurrency } from "@/lib/utils";

const statusVariant = {
  RUNNING: "success" as const,
  STOPPED: "outline" as const,
  PROVISIONING: "warning" as const,
};

export default function VpsPage() {
  const latest = vpsMetrics[vpsMetrics.length - 1];
  const avgCpu = Math.round(vpsMetrics.reduce((s, m) => s + m.cpu, 0) / vpsMetrics.length);
  const avgRam = Math.round(vpsMetrics.reduce((s, m) => s + m.ram, 0) / vpsMetrics.length);

  function provision(name: string) {
    toast.success(`Provisioning ${name}`, {
      description: "Demo request queued — your instance will appear shortly.",
    });
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <Container padY="md" className="relative">
        <PageHeader
          badge="Infrastructure"
          icon={Server}
          eyebrow="VPS"
          title={
            <>
              VPS <span className="gradient-text">Hosting</span>
            </>
          }
          description="Keep MT5 terminals online near broker matching engines with dedicated low-latency nodes."
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Avg CPU (24h)", value: `${avgCpu}%`, icon: Cpu },
            { label: "Avg RAM (24h)", value: `${avgRam}%`, icon: HardDrive },
            { label: "Latest net I/O", value: `${latest?.net ?? 0}%`, icon: Wifi },
          ].map((m) => (
            <Card key={m.label} className="glass border-border/60 bg-card/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
                  <m.icon className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-bold tabular-nums">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-bold">Your instances</h2>
        <div className="mb-10 grid gap-4 lg:grid-cols-3">
          {vpsInstances.map((inst) => (
            <Card key={inst.id} className="glass border-border/60 bg-card/80">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{inst.name}</CardTitle>
                    <CardDescription>{inst.region}</CardDescription>
                  </div>
                  <Badge variant={statusVariant[inst.status]}>{inst.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>{inst.cpu}</span>
                  <span>{inst.ram}</span>
                  <span>{inst.disk}</span>
                  <span className="text-sky-300">{inst.latencyMs} ms latency</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <span className="text-muted-foreground">
                    MT5 slots {inst.usedSlots}/{inst.mt5Slots}
                  </span>
                  <span className="font-semibold">{formatCurrency(inst.price)}/mo</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-bold">Provision a node</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {vpsCatalog.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "glass border-border/60 bg-card/80 transition-colors hover:border-sky-500/40"
              )}
            >
              <CardHeader>
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <CardDescription>{plan.specs}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-xl font-bold">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <Button size="sm" onClick={() => provision(plan.name)}>
                  Provision
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
