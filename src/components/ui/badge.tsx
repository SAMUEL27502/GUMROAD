import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-transparent bg-secondary/20 text-sky-300",
        success: "border-transparent bg-emerald-500/15 text-emerald-400",
        danger: "border-transparent bg-red-500/15 text-red-400",
        warning: "border-transparent bg-amber-500/15 text-amber-400",
        outline: "border-border text-muted-foreground",
        low: "border-transparent bg-emerald-500/15 text-emerald-400",
        medium: "border-transparent bg-sky-500/15 text-sky-400",
        high: "border-transparent bg-red-500/15 text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
