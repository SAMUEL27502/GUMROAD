"use client";

import { useMemo, useState } from "react";
import { Building2, ExternalLink, Search, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brokerDirectory } from "@/lib/data/brokers";
import { formatCurrency } from "@/lib/utils";

export default function BrokersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brokerDirectory;
    return brokerDirectory.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.regulation.some((r) => r.toLowerCase().includes(q)) ||
        b.regions.some((r) => r.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[100px]"
        aria-hidden
      />

      <Container padY="lg" className="relative">
        <PageHeader
          badge="Brokers"
          icon={Building2}
          title={
            <>
              Broker <span className="gradient-text">Directory</span>
            </>
          }
          description="Regulated venues with MT5 support — compare ratings, minimums, and spreads before you connect."
        />

        <div className="relative mb-8 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brokers, regulators, regions…"
            className="pl-9"
            aria-label="Search brokers"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((broker) => (
            <Card key={broker.id} className="glass border-border/60 bg-card/80">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{broker.name}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap gap-1">
                      {broker.regulation.map((r) => (
                        <Badge key={r} variant="outline" className="text-[10px]">
                          {r}
                        </Badge>
                      ))}
                    </CardDescription>
                  </div>
                  {broker.mt5Ready && <Badge variant="secondary">MT5</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{broker.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Min deposit</p>
                    <p className="font-semibold">
                      {broker.minDeposit === 0 ? "No minimum" : formatCurrency(broker.minDeposit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spreads from</p>
                    <p className="font-semibold">{broker.spreadsFrom} pips</p>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {broker.highlights.slice(0, 3).map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={broker.website} target="_blank" rel="noopener noreferrer">
                    Visit site
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No brokers match your search.</p>
        )}
      </Container>
    </div>
  );
}
