import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-bold tracking-tight", sizes[size], className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
        <span className="text-sm font-black text-slate-950">TB</span>
      </span>
      <span>
        Trade<span className="gradient-text">Bib</span>
      </span>
    </Link>
  );
}
