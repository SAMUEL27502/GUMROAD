import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-shimmer bg-muted/60 rounded-xl", className)} {...props} />;
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border-border/70 bg-card space-y-4 rounded-2xl border p-6", className)}>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border-border/70 space-y-3 rounded-xl border p-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="border-border/70 bg-card rounded-2xl border p-5">
      <Skeleton className="mb-3 h-3 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStat };
