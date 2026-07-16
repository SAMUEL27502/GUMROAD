import { cn } from "@/lib/utils";

export function Loader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-500 motion-reduce:animate-none",
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader({ label = "Loading page" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <Loader label={label} />
    </div>
  );
}
