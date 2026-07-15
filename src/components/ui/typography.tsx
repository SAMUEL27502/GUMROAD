import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "tb-display",
      h1: "tb-h1",
      h2: "tb-h2",
      h3: "tb-h3",
      h4: "tb-h4",
      body: "tb-body",
      bodySm: "tb-body-sm text-muted-foreground",
      caption: "tb-caption text-muted-foreground uppercase",
      label: "tb-label",
      mono: "tb-mono text-sm",
      gradient: "tb-h1 gradient-text",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div" | "label";
  };

export function Typography({ className, variant, as, ...props }: TypographyProps) {
  const Comp =
    as ||
    (variant === "display" || variant === "h1" || variant === "gradient"
      ? "h1"
      : variant === "h2"
        ? "h2"
        : variant === "h3"
          ? "h3"
          : variant === "h4"
            ? "h4"
            : variant === "label"
              ? "label"
              : "p");

  return <Comp className={cn(typographyVariants({ variant }), className)} {...props} />;
}

export { typographyVariants };
