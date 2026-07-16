import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function VerifiedOwnerBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="success"
      className={cn("gap-1 font-medium", className)}
      title="This reviewer has an active subscription to this bot"
    >
      <BadgeCheck className="h-3 w-3" />
      Verified owner
    </Badge>
  );
}
