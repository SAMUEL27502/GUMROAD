"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, OAuthButtons } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/actions/auth";
import { canUseSupabaseAuth } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("remember", remember ? "true" : "false");
    formData.set("next", next);

    const result = await loginAction(formData);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Sign in failed");
      return;
    }

    toast.success(result.message || "Welcome back!");
    router.push(result.redirectTo || next);
    router.refresh();
  }

  return (
    <AuthShell
      title={
        <>
          Welcome to <span className="gradient-text">TradeBib</span>
        </>
      }
      description={
        <>
          Sign in with email or social providers
          {!canUseSupabaseAuth() && " · demo mode (no Supabase keys)"}
        </>
      }
    >
      {errorParam && (
        <p
          className="border-destructive/30 bg-destructive/10 rounded-xl border px-3 py-2 text-sm text-red-300"
          role="alert"
        >
          {decodeURIComponent(errorParam)}
        </p>
      )}

      <OAuthButtons disabled={loading} onBusy={setLoading} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border/50 w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" htmlFor="email" required>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </FormField>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">
              Password
              <span className="sr-only"> (required)</span>
            </Label>
            <Link href="/forgot-password" className="text-xs text-sky-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={8}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(Boolean(v))}
          />
          <Label htmlFor="remember" className="text-muted-foreground font-normal">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-sky-400 hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
