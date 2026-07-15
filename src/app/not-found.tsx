import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold tracking-[0.2em] text-sky-400 uppercase">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mt-3">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/marketplace">Browse bots</Link>
        </Button>
      </div>
    </div>
  );
}
