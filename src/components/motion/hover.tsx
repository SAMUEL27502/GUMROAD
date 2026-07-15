"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverProps = HTMLMotionProps<"div"> & {
  scale?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

/** Lift / scale on hover — wrap interactive cards and CTAs. */
export function HoverLift({ children, className, scale = 1.02, y = -4, ...props }: HoverProps) {
  return (
    <motion.div
      whileHover={{ scale, y }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverScale({ children, className, scale = 1.04, ...props }: Omit<HoverProps, "y">) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverGlow({ children, className, ...props }: Omit<HoverProps, "scale" | "y">) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 0 0 1px rgba(14,165,233,0.45), 0 18px 40px rgba(14,165,233,0.12)",
      }}
      transition={{ duration: 0.25 }}
      className={cn("rounded-2xl", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
