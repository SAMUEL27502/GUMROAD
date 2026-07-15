"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, CreditCard, Key, Link2, Shield, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { connectedAccounts, pricingPlans } from "@/lib/data/platform";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({
    botPerformance: true,
    tradeAlerts: true,
    weeklyDigest: false,
    marketing: false,
  });
  const [apiKeys, setApiKeys] = useState([
    { id: "k1", name: "Production", key: "tb_live_••••••••••••4f2a", created: "2026-04-12" },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <PageLoader />;
  }

  const currentPlan = pricingPlans.find((p) => p.id === user.plan.toLowerCase()) ?? pricingPlans[1];

  function handleSaveProfile() {
    updateProfile({ name, email });
    toast.success("Profile updated");
  }

  function handleDeleteAccount() {
    logout();
    toast.success("Account deleted");
    router.push("/");
  }

  function generateApiKey() {
    const newKey = {
      id: `k${Date.now()}`,
      name: "New Key",
      key: `tb_live_••••••••••••${Math.random().toString(36).slice(2, 6)}`,
      created: new Date().toISOString().split("T")[0],
    };
    setApiKeys((prev) => [...prev, newKey]);
    toast.success("API key generated");
  }

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-4"
        >
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-1">
              {user.plan} Plan
            </Badge>
          </div>
        </motion.div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="h-3.5 w-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-1.5">
              <Key className="h-3.5 w-3.5" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-1.5">
              <Link2 className="h-3.5 w-3.5" />
              Connected
            </TabsTrigger>
            <TabsTrigger value="danger" className="gap-1.5 text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
              Danger
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                <Button onClick={() => toast.success("Password updated")}>Update Password</Button>
                <div className="border-border/50 bg-muted/20 mt-6 rounded-xl border p-4">
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Add an extra layer of security to your account
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => toast.info("2FA setup is a demo")}
                  >
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    key: "botPerformance" as const,
                    label: "Bot Performance Alerts",
                    desc: "Get notified when your bots hit performance milestones",
                  },
                  {
                    key: "tradeAlerts" as const,
                    label: "Trade Alerts",
                    desc: "Real-time notifications for open and closed trades",
                  },
                  {
                    key: "weeklyDigest" as const,
                    label: "Weekly Digest",
                    desc: "Summary of your portfolio performance every Monday",
                  },
                  {
                    key: "marketing" as const,
                    label: "Marketing & Updates",
                    desc: "New features, bot launches, and platform news",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="border-border/50 flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
                <Button onClick={() => toast.success("Notification preferences saved")}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for programmatic access</CardDescription>
                </div>
                <Button size="sm" onClick={generateApiKey}>
                  Generate Key
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="border-border/50 bg-muted/20 flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{key.name}</p>
                      <p className="text-muted-foreground font-mono text-xs">{key.key}</p>
                      <p className="text-muted-foreground mt-1 text-[10px]">
                        Created {key.created}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400"
                      onClick={() => {
                        setApiKeys((prev) => prev.filter((k) => k.id !== key.id));
                        toast.success("API key revoked");
                      }}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your plan and payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">{currentPlan.name} Plan</p>
                      <p className="text-muted-foreground text-sm">{currentPlan.description}</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {currentPlan.price === 0 ? "Free" : formatCurrency(currentPlan.price)}
                      {currentPlan.price > 0 && (
                        <span className="text-muted-foreground text-sm font-normal">/mo</span>
                      )}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {currentPlan.features.map((f) => (
                      <li key={f} className="text-muted-foreground text-sm">
                        • {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/pricing">Change Plan</Link>
                  </Button>
                </div>
                <div className="border-border/50 rounded-xl border p-4">
                  <p className="text-sm font-semibold">Payment Method</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Visa ending in 4242 · Expires 08/2027
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => toast.info("Payment update is a demo")}
                  >
                    Update payment method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Your linked MT5 broker accounts</CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href="/mt5">Add Account</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {connectedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="border-border/50 flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-semibold">{acc.nickname}</p>
                      <p className="text-muted-foreground text-xs">
                        {acc.brokerServer} · #{acc.accountNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(acc.equity)}</p>
                      <Badge
                        variant={acc.accountType === "DEMO" ? "warning" : "success"}
                        className="mt-1 text-[10px]"
                      >
                        {acc.accountType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger">
            <Card className="bg-card/80 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account permanently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm font-semibold">Delete Account</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Permanently delete your account, subscriptions, and all associated data. This
                    action cannot be undone.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="mt-3">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This will permanently delete your TradeBib account and remove all your
                          data from our servers. Active bot subscriptions will be cancelled.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Yes, delete my account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button
                  variant="outline"
                  className={cn("w-full sm:w-auto")}
                  onClick={() => {
                    logout();
                    toast.success("Logged out");
                    router.push("/login");
                  }}
                >
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
