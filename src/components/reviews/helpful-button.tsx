"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HelpfulButtonProps {
  count: number;
  voted: boolean;
  disabled?: boolean;
  onToggle: () => void;
  className?: string;
}

export function HelpfulButton({
  count,
  voted,
  disabled,
  onToggle,
  className,
}: HelpfulButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "gap-1.5",
        voted && "border-sky-500/50 bg-sky-500/10 text-sky-300",
        className
      )}
      aria-pressed={voted}
    >
      <ThumbsUp className={cn("h-3.5 w-3.5", voted && "fill-sky-400")} />
      Helpful{count > 0 ? ` (${count})` : ""}
    </Button>
  );
}
