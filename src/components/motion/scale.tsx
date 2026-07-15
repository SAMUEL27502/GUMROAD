"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ScaleProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  from?: number;
  className?: string;
  children: React.ReactNode;
};

/** Scale + fade in on mount. */
export function Scale({
  children,
  className,
  delay = 0,
  duration = 0.5,
  from = 0.94,
  ...props
}: ScaleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Scale + fade when scrolled into view. */
export function ScaleInView({
  children,
  className,
  delay = 0,
  duration = 0.5,
  from = 0.94,
  ...props
}: ScaleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
