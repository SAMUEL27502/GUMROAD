"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signInWithOAuth } from "@/lib/auth/oauth";
import { toast } from "sonner";

export function AuthShell({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const card = (
    <Card className={cn("glass border-border/70", className)}>
      <CardHeader className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <span className="sr-only">TradeBib — </span>
          {title}
        </h1>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:py-16">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[100px]"
        aria-hidden
      />
      {reduceMotion ? (
        <div className="relative w-full max-w-md">{card}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-md"
        >
          {card}
        </motion.div>
      )}
    </div>
  );
}

export function OAuthButtons({
  disabled,
  onBusy,
}: {
  disabled?: boolean;
  onBusy?: (busy: boolean) => void;
}) {
  async function handleSocial(provider: "google" | "github") {
    try {
      onBusy?.(true);
      await signInWithOAuth(provider);
    } catch (err) {
      onBusy?.(false);
      toast.error(err instanceof Error ? err.message : "OAuth failed");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-label="Continue with Google"
        onClick={() => handleSocial("google")}
      >
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-label="Continue with GitHub"
        onClick={() => handleSocial("github")}
      >
        GitHub
      </Button>
    </div>
  );
}
