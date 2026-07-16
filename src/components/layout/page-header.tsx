"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  badge?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** When false, skip entrance animation (SSR-friendly wrappers can omit client fade). */
  animate?: boolean;
}

/** Consistent page title block: badge/eyebrow + h1 + description + actions. */
export function PageHeader({
  badge,
  eyebrow,
  icon: Icon,
  title,
  description,
  actions,
  align = "left",
  className,
  animate = true,
}: PageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const centered = align === "center";

  const content = (
    <div
      className={cn(
        "mb-8 sm:mb-10",
        centered && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {badge ? (
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
      ) : null}

      {(eyebrow || Icon) && (
        <p
          className={cn(
            "text-muted-foreground mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase",
            centered && "justify-center"
          )}
        >
          {Icon ? <Icon className="h-3.5 w-3.5 text-sky-400" aria-hidden /> : null}
          {eyebrow}
        </p>
      )}

      <h1 className="tb-h1 text-balance">{title}</h1>

      {description ? (
        <p
          className={cn(
            "text-muted-foreground mt-3 text-base leading-relaxed sm:text-lg",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}

      {actions ? (
        <div
          className={cn(
            "mt-5 flex flex-wrap items-center gap-3",
            centered && "justify-center"
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );

  if (!animate || reduceMotion) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}
