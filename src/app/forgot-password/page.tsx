"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </Button>

        <Card className="glass border-border/70">
          {submitted ? (
            <CardContent className="py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold">Check your inbox</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent a password reset link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/login">Return to login</Link>
                </Button>
              </motion.div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reset your password</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
