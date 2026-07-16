import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { text: "text-lg", mark: "h-7 w-7 text-xs" },
    md: { text: "text-xl", mark: "h-8 w-8 text-sm" },
    lg: { text: "text-3xl", mark: "h-10 w-10 text-base" },
  };

  return (
    <Link
      href="/"
      aria-label="TradeBib home"
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-tight focus-visible:ring-ring rounded-lg focus-visible:ring-2 focus-visible:outline-none",
        sizes[size].text,
        className
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30",
          sizes[size].mark
        )}
        aria-hidden
      >
        <span className="font-black text-slate-950">TB</span>
      </span>
      <span>
        Trade<span className="gradient-text">Bib</span>
      </span>
    </Link>
  );
}
