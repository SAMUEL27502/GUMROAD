"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Copy, Download, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  filterMt5Samples,
  mt5CodeSamples,
  mt5SampleKinds,
  type Mt5CodeSample,
  type Mt5SampleKind,
} from "@/lib/data/mt5-education";
import { cn } from "@/lib/utils";

const levelVariant: Record<Mt5CodeSample["level"], "outline" | "secondary" | "warning"> = {
  Beginner: "secondary",
  Intermediate: "outline",
  Advanced: "warning",
};

export function Mt5CodeLab() {
  const [kind, setKind] = useState<"ALL" | Mt5SampleKind>("ALL");
  const [activeId, setActiveId] = useState(mt5CodeSamples[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => filterMt5Samples(kind), [kind]);
  const active = filtered.find((s) => s.id === activeId) ?? filtered[0] ?? null;

  async function copyCode() {
    if (!active) return;
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      toast.success("Copied MQL5 source");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy — select the code manually");
    }
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[100px]"
        aria-hidden
      />

      <Container padY="lg" className="relative">
        <PageHeader
          badge="Education"
          icon={BookOpen}
          title={
            <>
              MT5 Code <span className="gradient-text">Lab</span>
            </>
          }
          description="Open MetaTrader 5 (MQL5) samples for education and analysis — Expert Advisors, indicators, scripts, and performance analyzers. Study them in the Strategy Tester; they are not live trading advice."
        />

        <div
          className="border-amber-500/30 bg-amber-500/10 text-amber-100 mb-8 rounded-xl border px-4 py-3 text-sm"
          role="note"
        >
          Educational use only. Past Strategy Tester results do not guarantee future performance.
          Prefer demo accounts, keep <code className="text-amber-50">EnableTrading=false</code> while
          learning, and read the risk disclosure before connecting any live account.
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {mt5SampleKinds.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={kind === f.id ? "default" : "outline"}
              onClick={() => {
                setKind(f.id);
                const next = filterMt5Samples(f.id);
                if (next[0]) setActiveId(next[0].id);
              }}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <div className="space-y-3">
            {filtered.map((sample) => {
              const selected = active?.id === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setActiveId(sample.id)}
                  className={cn(
                    "border-border/60 bg-card/70 w-full rounded-xl border p-4 text-left transition",
                    selected
                      ? "border-sky-500/50 bg-sky-500/10 ring-1 ring-sky-500/30"
                      : "hover:border-sky-500/30 hover:bg-card/90"
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{sample.kind}</Badge>
                    <Badge variant={levelVariant[sample.level]}>{sample.level}</Badge>
                  </div>
                  <p className="text-foreground font-semibold">{sample.title}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                    {sample.summary}
                  </p>
                </button>
              );
            })}
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-sm">No samples in this category.</p>
            ) : null}
          </div>

          {active ? (
            <Card className="glass border-border/60 bg-card/80 overflow-hidden">
              <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-sky-400" aria-hidden />
                    <CardTitle className="text-xl">{active.title}</CardTitle>
                  </div>
                  <CardDescription className="max-w-2xl">{active.summary}</CardDescription>
                  <p className="text-muted-foreground font-mono text-xs">{active.filename}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={copyCode}>
                    {copied ? (
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy code"}
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a href={`/mt5-education/${active.filename}`} download={active.filename}>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download .mq5
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-foreground mb-2 text-sm font-semibold">Learning goals</p>
                    <ul className="text-muted-foreground list-disc space-y-1.5 pl-4 text-sm">
                      {active.learningGoals.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-foreground mb-2 text-sm font-semibold">Analysis tips</p>
                    <ul className="text-muted-foreground list-disc space-y-1.5 pl-4 text-sm">
                      {active.analysisNotes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <pre
                  className="border-border/60 bg-zinc-950/90 max-h-[min(70vh,720px)] overflow-auto rounded-xl border p-4 text-[12px] leading-relaxed text-zinc-200"
                  tabIndex={0}
                  aria-label={`${active.title} MQL5 source`}
                >
                  <code>{active.code}</code>
                </pre>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
