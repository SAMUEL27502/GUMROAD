"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  className?: string;
}

const sizeClass = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  onChange,
  size = "sm",
  readOnly = false,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${value} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        const star = (
          <Star
            className={cn(
              sizeClass[size],
              filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            )}
          />
        );
        if (readOnly || !onChange) {
          return <span key={i}>{star}</span>;
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="cursor-pointer rounded-sm transition-transform hover:scale-110"
            aria-label={`Rate ${i + 1} stars`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
