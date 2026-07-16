"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultKycSteps, type KycStatus, type KycStep } from "@/lib/data/kyc";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  KycStatus,
  { label: string; variant: "outline" | "warning" | "success" | "danger" }
> = {
  NOT_STARTED: { label: "Not started", variant: "outline" },
  PENDING: { label: "Pending review", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
};

export default function KycPage() {
  const [steps, setSteps] = useState<KycStep[]>(defaultKycSteps);
  const [status, setStatus] = useState<KycStatus>("NOT_STARTED");

  const uploadable = steps.filter((s) => s.id !== "review");
  const allUploaded = uploadable.every((s) => s.done);
  const progress = useMemo(
    () => Math.round((steps.filter((s) => s.done).length / steps.length) * 100),
    [steps]
  );

  function markUploaded(id: string) {
    if (status === "PENDING" || status === "APPROVED") return;
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, done: true } : s)));
    const title = steps.find((s) => s.id === id)?.title ?? "Document";
    toast.success(`${title} uploaded`, { description: "Demo file accepted — not sent to a server." });
  }

  function submitForReview() {
    if (!allUploaded) {
      toast.error("Upload all required documents first");
      return;
    }
    setSteps((prev) => prev.map((s) => (s.id === "review" ? { ...s, done: true } : s)));
    setStatus("PENDING");
    toast.success("Submitted for review", {
      description: "Compliance usually responds within 1 business day.",
    });
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <Container size="3xl" padY="md" className="relative">
        <PageHeader
          badge="Compliance"
          icon={ShieldCheck}
          eyebrow="KYC"
          title={
            <>
              Identity <span className="gradient-text">Verification</span>
            </>
          }
          description="Complete the steps below to unlock higher limits and compliance-ready withdrawals."
          actions={
            <Badge variant={statusMeta[status].variant}>{statusMeta[status].label}</Badge>
          }
        />

        <Card className="mb-6 glass border-border/60 bg-card/80">
          <CardContent className="p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-sky-300">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isUpload = step.id !== "review";
            return (
              <Card key={step.id} className="glass border-border/60 bg-card/80">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        step.done ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/15 text-sky-400"
                      )}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        Step {index + 1}: {step.title}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                    {step.done && <Badge variant="success">Done</Badge>}
                  </div>
                </CardHeader>
                {isUpload && status !== "APPROVED" && status !== "PENDING" && (
                  <CardContent>
                    <Button
                      size="sm"
                      variant={step.done ? "outline" : "default"}
                      onClick={() => markUploaded(step.id)}
                      disabled={step.done}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      {step.done ? "Uploaded" : "Upload (demo)"}
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Button
            className="w-full sm:w-auto"
            onClick={submitForReview}
            disabled={status === "PENDING" || status === "APPROVED" || !allUploaded}
          >
            {status === "PENDING" ? "Awaiting review" : "Submit for review"}
          </Button>
        </div>
      </Container>
    </div>
  );
}
