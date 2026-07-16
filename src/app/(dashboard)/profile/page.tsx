"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Camera,
  CreditCard,
  Key,
  Link2,
  Pencil,
  RefreshCw,
  Shield,
  Trash2,
  Unplug,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logoutAction } from "@/app/actions/auth";
import {
  changePasswordAction,
  deleteAccountAction,
  removeAvatarAction,
  saveNotificationPrefsAction,
  updateAvatarAction,
  updateProfileAction,
} from "@/app/actions/profile";
import { pricingPlans } from "@/lib/data/platform";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useMt5AccountsStore } from "@/store/mt5-accounts-store";
import { useNotificationPrefsStore } from "@/store/notification-prefs-store";
import { useSubscriptionsStore } from "@/store/subscriptions-store";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, isLoading, user, updateProfile, clear } = useAuthStore();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [apiKeys, setApiKeys] = useState([
    { id: "k1", name: "Production", key: "tb_live_••••••••••••4f2a", created: "2026-04-12" },
  ]);

  const { prefs, updatePref, setPrefs } = useNotificationPrefsStore();
  const { accounts, disconnect, reconnect, rename, sync, remove } = useMt5AccountsStore();
  const { subscriptions, cancel, reactivate } = useSubscriptionsStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user) setName(user.name);
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated || !user) {
    return <PageLoader />;
  }

  const currentPlan = pricingPlans.find((p) => p.id === user.plan.toLowerCase()) ?? pricingPlans[1];
  const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE");
  const monthlyBotSpend = activeSubs.reduce((sum, s) => sum + s.price, 0);

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("plan", user.plan);
    const result = await updateProfileAction(formData);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error || "Update failed");
      return;
    }
    updateProfile({ name });
    toast.success(result.message || "Profile updated");
  }

  async function handleAvatarChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 500_000) {
      toast.error("Image must be under 500KB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const formData = new FormData();
      formData.set("avatarUrl", dataUrl);
      const result = await updateAvatarAction(formData);
      if (!result.success) {
        toast.error(result.error || "Avatar upload failed");
        return;
      }
      updateProfile({ avatarUrl: result.avatarUrl || dataUrl });
      toast.success(result.message || "Avatar updated");
    } catch {
      toast.error("Could not process image");
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemoveAvatar() {
    setUploadingAvatar(true);
    const result = await removeAvatarAction();
    setUploadingAvatar(false);
    if (!result.success) {
      toast.error(result.error || "Failed to remove avatar");
      return;
    }
    updateProfile({ avatarUrl: undefined });
    toast.success("Avatar removed");
  }

  async function handleChangePassword() {
    setChangingPassword(true);
    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);
    const result = await changePasswordAction(formData);
    setChangingPassword(false);
    if (!result.success) {
      toast.error(result.error || "Password update failed");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(result.message || "Password updated");
  }

  async function handleSaveNotifications() {
    const formData = new FormData();
    Object.entries(prefs).forEach(([key, value]) => {
      formData.set(key, String(value));
    });
    const result = await saveNotificationPrefsAction(formData);
    if (!result.success) {
      toast.error(result.error || "Failed to save preferences");
      return;
    }
    setPrefs(prefs);
    toast.success(result.message || "Preferences saved");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const formData = new FormData();
    formData.set("confirmation", deleteConfirm);
    try {
      clear();
      const result = await deleteAccountAction(formData);
      if (result && !result.success) {
        setDeleting(false);
        toast.error(result.error || "Delete failed");
      }
    } catch {
      router.push("/");
      router.refresh();
    }
  }

  async function handleLogout() {
    clear();
    try {
      await logoutAction();
    } catch {
      router.push("/");
      router.refresh();
    }
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
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative">
            <Avatar className="h-20 w-20">
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
              <AvatarFallback className="text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="border-border bg-card absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-sky-400 shadow-lg transition hover:bg-sky-500/10"
              aria-label="Upload avatar"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge variant="secondary">{user.plan} Plan</Badge>
              <Badge variant={user.emailVerified ? "success" : "warning"}>
                {user.emailVerified ? "Email verified" : "Email unverified"}
              </Badge>
              {user.provider && <Badge variant="outline">{user.provider}</Badge>}
            </div>
          </div>
          {user.avatarUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={uploadingAvatar}
            >
              Remove avatar
            </Button>
          )}
        </motion.div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="h-3.5 w-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Subscription
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> MT5 Accounts
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-1.5">
              <Key className="h-3.5 w-3.5" /> API Keys
            </TabsTrigger>
            <TabsTrigger value="danger" className="gap-1.5 text-red-400">
              <Trash2 className="h-3.5 w-3.5" /> Danger
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Update profile</CardTitle>
                <CardDescription>Your public name and account email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" type="email" value={user.email} disabled />
                  <p className="text-muted-foreground text-xs">
                    Email changes require verification. Contact support to update your address.
                  </p>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving || name.trim().length < 2}>
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                  Use a strong password with at least 8 characters, one uppercase letter, and one
                  number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? "Updating..." : "Update password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Manage notifications</CardTitle>
                <CardDescription>Choose email and in-app alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {(
                  [
                    {
                      key: "botPerformance" as const,
                      label: "Bot performance alerts",
                      desc: "Milestones, drawdown warnings, and ROI spikes",
                    },
                    {
                      key: "tradeAlerts" as const,
                      label: "Trade alerts",
                      desc: "Open and closed trades from subscribed bots",
                    },
                    {
                      key: "mt5Sync" as const,
                      label: "MT5 sync updates",
                      desc: "Balance, equity, and connection status changes",
                    },
                    {
                      key: "subscriptionBilling" as const,
                      label: "Subscription & billing",
                      desc: "Renewals, invoices, and payment failures",
                    },
                    {
                      key: "securityAlerts" as const,
                      label: "Security alerts",
                      desc: "Logins, password changes, and account security",
                    },
                    {
                      key: "weeklyDigest" as const,
                      label: "Weekly digest",
                      desc: "Portfolio summary every Monday",
                    },
                    {
                      key: "marketing" as const,
                      label: "Product updates",
                      desc: "New bots, features, and platform news",
                    },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="border-border/50 flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <Switch
                      checked={prefs[item.key]}
                      onCheckedChange={(checked) => updatePref(item.key, checked)}
                    />
                  </div>
                ))}
                <Button onClick={handleSaveNotifications}>Save preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>View subscription</CardTitle>
                <CardDescription>Platform plan and bot subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold">{currentPlan.name} plan</p>
                      <p className="text-muted-foreground text-sm">{currentPlan.description}</p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        Next renewal · Aug 15, 2026 · {activeSubs.length} active bot
                        {activeSubs.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold">
                        {currentPlan.price === 0 ? "Free" : formatCurrency(currentPlan.price)}
                        {currentPlan.price > 0 && (
                          <span className="text-muted-foreground text-sm font-normal">/mo</span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Bots: {formatCurrency(monthlyBotSpend)}/mo
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {currentPlan.features.map((f) => (
                      <li key={f} className="text-muted-foreground text-sm">
                        • {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/billing">Manage billing</Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Bot subscriptions</h3>
                  {subscriptions.length === 0 ? (
                    <EmptyState
                      title="No bot subscriptions"
                      description="Browse the marketplace to subscribe to verified Expert Advisors."
                      actionLabel="View marketplace"
                      onAction={() => router.push("/marketplace")}
                    />
                  ) : (
                    subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="border-border/50 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold">{sub.botName}</p>
                          <p className="text-muted-foreground text-xs">
                            {formatCurrency(sub.price)}/mo · Started {sub.startedAt}
                            {sub.status === "ACTIVE" ? ` · Renews ${sub.renewsAt}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              sub.status === "ACTIVE"
                                ? "success"
                                : sub.status === "PAST_DUE"
                                  ? "warning"
                                  : "outline"
                            }
                          >
                            {sub.status}
                          </Badge>
                          {sub.status === "ACTIVE" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                cancel(sub.id);
                                toast.success(`Cancelled ${sub.botName}`);
                              }}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                reactivate(sub.id);
                                toast.success(`Reactivated ${sub.botName}`);
                              }}
                            >
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle>Manage connected MT5 accounts</CardTitle>
                  <CardDescription>
                    Rename, sync, disconnect, or remove broker links
                  </CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href="/mt5">Add account</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {accounts.length === 0 ? (
                  <EmptyState
                    title="No MT5 accounts connected"
                    description="Connect an investor account to sync balance, equity, and trades."
                    actionLabel="Connect MT5"
                    onAction={() => router.push("/mt5")}
                  />
                ) : (
                  accounts.map((acc) => (
                    <div key={acc.id} className="border-border/50 rounded-xl border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          {editingAccountId === acc.id ? (
                            <div className="flex flex-wrap gap-2">
                              <Input
                                value={nicknameDraft}
                                onChange={(e) => setNicknameDraft(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (nicknameDraft.trim().length < 2) {
                                    toast.error("Nickname too short");
                                    return;
                                  }
                                  rename(acc.id, nicknameDraft.trim());
                                  setEditingAccountId(null);
                                  toast.success("Nickname updated");
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingAccountId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{acc.nickname}</p>
                              <button
                                type="button"
                                className="text-muted-foreground cursor-pointer hover:text-sky-400"
                                onClick={() => {
                                  setEditingAccountId(acc.id);
                                  setNicknameDraft(acc.nickname);
                                }}
                                aria-label="Rename account"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          <p className="text-muted-foreground text-xs">
                            {acc.broker} · {acc.brokerServer} · #{acc.accountNumber} ·{" "}
                            {acc.leverage}
                          </p>
                          <p className="text-muted-foreground mt-1 text-[11px]">
                            Last sync:{" "}
                            {acc.lastSyncAt ? new Date(acc.lastSyncAt).toLocaleString() : "Never"}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold">{formatCurrency(acc.equity)}</p>
                          <p className="text-muted-foreground text-xs">
                            Balance {formatCurrency(acc.balance)}
                          </p>
                          <Badge
                            variant={
                              !acc.connected
                                ? "danger"
                                : acc.accountType === "DEMO"
                                  ? "warning"
                                  : "success"
                            }
                            className="mt-1 text-[10px]"
                          >
                            {!acc.connected ? "DISCONNECTED" : acc.accountType}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            sync(acc.id);
                            toast.success(`Synced ${acc.nickname}`);
                          }}
                          disabled={!acc.connected}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Sync
                        </Button>
                        {acc.connected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              disconnect(acc.id);
                              toast.message("Account disconnected");
                            }}
                          >
                            <Unplug className="h-3.5 w-3.5" /> Disconnect
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              reconnect(acc.id);
                              toast.success("Account reconnected");
                            }}
                          >
                            Reconnect
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => {
                            remove(acc.id);
                            toast.success("Account removed");
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API keys</CardTitle>
                  <CardDescription>Programmatic access to your TradeBib data</CardDescription>
                </div>
                <Button size="sm" onClick={generateApiKey}>
                  Generate key
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

          <TabsContent value="danger">
            <Card className="bg-card/80 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Danger zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that permanently affect your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm font-semibold">Delete account</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Permanently delete your account, cancel subscriptions, disconnect MT5 accounts,
                    and remove associated data.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="mt-3">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete your TradeBib account?</DialogTitle>
                        <DialogDescription>
                          Type <strong>DELETE</strong> to confirm. This cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="DELETE"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteConfirm("")}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={deleteConfirm !== "DELETE" || deleting}
                          onClick={handleDeleteAccount}
                        >
                          {deleting ? "Deleting..." : "Yes, delete my account"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button variant="outline" className={cn("w-full sm:w-auto")} onClick={handleLogout}>
                  Log out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
