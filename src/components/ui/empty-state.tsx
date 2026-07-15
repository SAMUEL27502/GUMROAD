import * as React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border/80 bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
        <Icon className="h-6 w-6" />
      </div>
      <Typography variant="h4">{title}</Typography>
      {description && (
        <Typography variant="bodySm" className="mt-2 max-w-sm">
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
