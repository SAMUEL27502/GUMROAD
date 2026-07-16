import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card className={cn("border-border/70 bg-card/60", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className={cn("tb-mono text-2xl font-bold tracking-tight", valueClassName)}>
            {value}
          </p>
          {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="bg-sky-500/10 text-sky-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatGrid({
  children,
  className,
  cols = 4,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
