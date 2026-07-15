"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type FloatingCardProps = HTMLMotionProps<"div"> & {
  delay?: number;
  amplitude?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
};

/** Continuously floating card — use for hero panels and decorative UI. */
export function FloatingCard({
  children,
  className,
  delay = 0,
  amplitude = 12,
  duration = 6,
  ...props
}: FloatingCardProps) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Floating with a subtle secondary axis sway. */
export function FloatingCardSway({
  children,
  className,
  delay = 0,
  classNameInner,
  ...props
}: FloatingCardProps & { classNameInner?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      <div className={classNameInner}>{children}</div>
    </motion.div>
  );
}
