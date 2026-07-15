"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function CountUp({
  value,
  display,
  duration = 1.6,
}: {
  value: number;
  display: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(display);

  useEffect(() => {
    if (!inView) return;
    // Prefer the crafted display string for branded stats
    setShown(display);
  }, [inView, display, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="block text-3xl font-bold tracking-tight sm:text-4xl"
    >
      {shown}
    </motion.span>
  );
}
