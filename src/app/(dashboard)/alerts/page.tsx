"use client";

import { useState } from "react";
import { Bell, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { emailAlertPrefs, telegramDefaults } from "@/lib/data/alerts";

export default function AlertsPage() {
  const [emailPrefs, setEmailPrefs] = useState(emailAlertPrefs);
  const [telegramConnected, setTelegramConnected] = useState(telegramDefaults.connected);

  function toggleEmail(id: string, enabled: boolean) {
    setEmailPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
    const label = emailPrefs.find((p) => p.id === id)?.label ?? "Alert";
    toast.success(enabled ? `${label} enabled` : `${label} disabled`);
  }

  function connectTelegram() {
    setTelegramConnected(true);
    toast.success("Telegram connected", {
      description: `Messages will come from ${telegramDefaults.botUsername}`,
    });
  }

  function disconnectTelegram() {
    setTelegramConnected(false);
    toast.message("Telegram disconnected");
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <Container padY="md" className="relative">
        <PageHeader
          badge="Settings"
          icon={Bell}
          eyebrow="Alerts"
          title={
            <>
              Telegram &amp; Email <span className="gradient-text">Alerts</span>
            </>
          }
          description="Choose which events reach your inbox and connect Telegram for instant bot notifications."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-sky-400" />
                Email categories
              </CardTitle>
              <CardDescription>Toggle which email digests you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {emailPrefs.map((pref) => (
                <div key={pref.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={pref.id} className="text-sm font-medium">
                      {pref.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={(checked) => toggleEmail(pref.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-border/60 bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-5 w-5 text-sky-400" />
                  Telegram
                </CardTitle>
                <Badge variant={telegramConnected ? "success" : "outline"}>
                  {telegramConnected ? "Connected" : "Not connected"}
                </Badge>
              </div>
              <CardDescription>
                Link your chat to receive push-style alerts from{" "}
                <span className="font-mono text-sky-300">{telegramDefaults.botUsername}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {telegramConnected ? (
                <>
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-sm">
                    <p className="text-muted-foreground">Bot</p>
                    <p className="font-semibold text-sky-300">{telegramDefaults.botUsername}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Demo mode — connection is stored in this session only.
                    </p>
                  </div>
                  <Button variant="outline" onClick={disconnectTelegram}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>
                      Open Telegram and search for{" "}
                      <span className="font-mono text-sky-300">
                        {telegramDefaults.botUsername}
                      </span>
                    </li>
                    <li>Tap Start and allow TradeBib alerts</li>
                    <li>Return here and confirm the connection</li>
                  </ol>
                  <Button onClick={connectTelegram}>Connect Telegram</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
