"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedGradientProps = {
  className?: string;
  variant?: "hero" | "subtle" | "orb";
};

/** Animated gradient mesh / orbs for premium SaaS backgrounds. */
export function AnimatedGradient({ className, variant = "hero" }: AnimatedGradientProps) {
  if (variant === "orb") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <motion.div
          className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-sky-500/25 blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 -right-16 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]"
          animate={{ x: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-blue-600/10"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute top-0 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[120px]"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-0 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]"
        animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-[90px]"
        animate={{ x: [0, 18, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid-bg absolute inset-0" />
    </div>
  );
}

/** Soft drifting particles over a section. */
export function AnimatedParticles({
  count = 12,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-sky-400/40"
          style={{
            left: `${8 + ((i * 7) % 84)}%`,
            top: `${12 + ((i * 11) % 70)}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
