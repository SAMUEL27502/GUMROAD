"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, OAuthButtons } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/app/actions/auth";
import { canUseSupabaseAuth } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    const result = await registerAction(formData);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Registration failed");
      return;
    }

    toast.success(result.message || "Account created");
    router.push(result.redirectTo || "/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Create your account"
      description={
        <>
          Start automating with verified MT5 bots
          {!canUseSupabaseAuth() && " · demo mode"}
        </>
      }
    >
      <OAuthButtons disabled={loading} onBusy={setLoading} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full name" htmlFor="name" required>
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
              minLength={2}
              autoComplete="name"
            />
          </div>
        </FormField>
        <FormField label="Email" htmlFor="email" required>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              autoComplete="email"
            />
          </div>
        </FormField>
        <FormField
          label="Password"
          htmlFor="password"
          required
          description="8+ characters, one uppercase letter, one number"
        >
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={8}
              autoComplete="new-password"
              aria-describedby="password-description"
            />
          </div>
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" required>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </FormField>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-sky-400 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
