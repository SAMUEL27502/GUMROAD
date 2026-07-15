import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-500",
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader />
    </div>
  );
}
