"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 32 },
  right: { x: -32 },
};

type SlideProps = HTMLMotionProps<"div"> & {
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  children: React.ReactNode;
};

function offsetFor(direction: Direction, distance: number) {
  const base = offsets[direction];
  if (base.x !== undefined) return { x: Math.sign(base.x) * distance, y: 0 };
  return { x: 0, y: Math.sign(base.y!) * distance };
}

/** Slide + fade in on mount. */
export function Slide({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.55,
  distance = 28,
  ...props
}: SlideProps) {
  const from = offsetFor(direction, distance);
  return (
    <motion.div
      initial={{ opacity: 0, ...from }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Slide + fade when scrolled into view. */
export function SlideInView({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.55,
  distance = 28,
  ...props
}: SlideProps) {
  const from = offsetFor(direction, distance);
  return (
    <motion.div
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
