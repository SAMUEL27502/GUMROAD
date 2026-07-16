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
  /** Heading level — use "p" inside cards to avoid broken outline */
  titleAs?: "h2" | "h3" | "h4" | "p";
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
  titleAs = "p",
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border/80 bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed text-center",
        compact ? "px-4 py-8" : "px-6 py-12 sm:py-16",
        className
      )}
      role="status"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
      </div>
      <Typography variant="h4" as={titleAs}>
        {title}
      </Typography>
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
