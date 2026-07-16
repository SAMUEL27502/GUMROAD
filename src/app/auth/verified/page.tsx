import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="glass border-border/70 w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
          <CardTitle className="mt-2">Email verified</CardTitle>
          <CardDescription>
            Your TradeBib account is verified. You can continue to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
