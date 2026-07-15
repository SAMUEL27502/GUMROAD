import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-blue-600/20 hover:bg-blue-500",
        outline: "border border-border bg-transparent hover:bg-muted/60 text-foreground",
        ghost: "hover:bg-muted/60 text-foreground",
        success:
          "bg-accent text-accent-foreground shadow-lg shadow-emerald-500/20 hover:bg-emerald-400",
        destructive: "bg-destructive text-white shadow-lg shadow-red-500/20 hover:bg-red-500",
        glass: "glass text-foreground hover:border-sky-500/40 hover:bg-sky-500/10",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
