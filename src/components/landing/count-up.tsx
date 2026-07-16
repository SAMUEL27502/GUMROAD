"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function formatAnimatedValue(
  current: number,
  value: number,
  prefix?: string,
  suffix?: string,
  decimals = 0
) {
  const formatted =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString("en-US");
  return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
}

export function CountUp({
  value,
  display,
  prefix,
  suffix,
  decimals = 0,
  duration = 1.6,
}: {
  value: number;
  display: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(formatAnimatedValue(0, value, prefix, suffix, decimals));

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setShown(formatAnimatedValue(current, value, prefix, suffix, decimals));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setShown(display);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, display, prefix, suffix, decimals, duration]);

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
