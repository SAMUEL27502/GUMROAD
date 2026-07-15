"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import { resendVerificationAction } from "@/app/actions/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);

  async function resend() {
    if (!email) {
      toast.error("Missing email address");
      return;
    }
    setLoading(true);
    const result = await resendVerificationAction(email);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error || "Could not resend");
      return;
    }
    toast.success(result.message || "Verification email sent");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="glass border-border/70 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
            <Mail className="h-5 w-5" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We sent a verification link{email ? ` to ${email}` : ""}. Open it to activate your
            account and unlock the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            variant="outline"
            onClick={resend}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </Button>
          <Button className="w-full" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
