"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  Bot,
  CheckCheck,
  CreditCard,
  Filter,
  Shield,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  categoryDescriptions,
  categoryLabels,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/data/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications-store";

type FilterKey = NotificationCategory | "ALL";
type ReadFilter = "all" | "unread" | "read";

const categoryMeta: Record<
  NotificationCategory,
  { icon: typeof Bot; tone: string; badge: string }
> = {
  BOT: {
    icon: Bot,
    tone: "bg-sky-500/15 text-sky-400",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },
  TRADE: {
    icon: TrendingUp,
    tone: "bg-emerald-500/15 text-emerald-400",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  SUBSCRIPTION: {
    icon: CreditCard,
    tone: "bg-amber-500/15 text-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  SECURITY: {
    icon: Shield,
    tone: "bg-rose-500/15 text-rose-400",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
};

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: AppNotification;
  onOpen: (n: AppNotification) => void;
}) {
  const { markRead, markUnread, remove } = useNotificationsStore();
  const meta = categoryMeta[notification.category];
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4 transition-colors",
        notification.read
          ? "border-border/60 bg-card/40"
          : "border-sky-500/30 bg-sky-500/5"
      )}
    >
      <div className="flex gap-3">
        <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{notification.title}</p>
                {!notification.read ? <Badge variant="default">New</Badge> : null}
              </div>
              <Badge className={cn("mt-1", meta.badge)} variant="outline">
                {categoryLabels[notification.category]}
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs">{notification.time}</span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">{notification.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => onOpen(notification)}>
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (notification.read) {
                  markUnread(notification.id);
                  toast.message("Marked unread");
                } else {
                  markRead(notification.id);
                  toast.success("Marked as read");
                }
              }}
            >
              {notification.read ? "Mark unread" : "Mark read"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
              onClick={() => {
                remove(notification.id);
                toast.message("Notification removed");
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationCenter() {
  const router = useRouter();
  const { byCategory, unreadCount, markAllRead, markRead } = useNotificationsStore();
  const [category, setCategory] = useState<FilterKey>("ALL");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");

  const items = useMemo(() => {
    let list = byCategory(category);
    if (readFilter === "unread") list = list.filter((n) => !n.read);
    if (readFilter === "read") list = list.filter((n) => n.read);
    return list;
  }, [byCategory, category, readFilter]);

  const counts = {
    ALL: unreadCount("ALL"),
    BOT: unreadCount("BOT"),
    TRADE: unreadCount("TRADE"),
    SUBSCRIPTION: unreadCount("SUBSCRIPTION"),
    SECURITY: unreadCount("SECURITY"),
  };

  function openNotification(n: AppNotification) {
    markRead(n.id);
    router.push(n.href);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Badge className="mb-4 border-sky-500/30 bg-sky-500/10 text-sky-300">
          <BellRing className="mr-1.5 h-3.5 w-3.5" />
          Notification Center
        </Badge>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Alerts</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Bot, trade, subscription, and security alerts in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                markAllRead(category);
                toast.success(
                  category === "ALL"
                    ? "All notifications marked read"
                    : `${categoryLabels[category]} marked read`
                );
              }}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">Manage prefs</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(categoryLabels) as NotificationCategory[]).map((key) => {
          const meta = categoryMeta[key];
          const Icon = meta.icon;
          const active = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                  : "border-border/70 bg-card/60 hover:border-sky-500/30"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon className={cn("h-5 w-5", active ? "text-sky-400" : "text-muted-foreground")} />
                {counts[key] > 0 ? (
                  <Badge variant="default">{counts[key]}</Badge>
                ) : null}
              </div>
              <p className="mt-2 font-semibold">{categoryLabels[key]}</p>
              <p className="text-muted-foreground mt-1 text-xs line-clamp-2">
                {categoryDescriptions[key]}
              </p>
            </button>
          );
        })}
      </div>

      <Card className="border-border/70 bg-card/80 mb-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-sky-400" />
              {category === "ALL" ? "All notifications" : categoryLabels[category]}
            </CardTitle>
            <CardDescription>
              {counts.ALL} unread total
              {category !== "ALL" ? ` · ${counts[category]} in this category` : ""}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={category === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory("ALL")}
            >
              All
            </Button>
            <Select value={readFilter} onValueChange={(v) => setReadFilter(v as ReadFilter)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={category} onValueChange={(v) => setCategory(v as FilterKey)}>
            <TabsList className="mb-4 flex h-auto flex-wrap">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="BOT">Bot</TabsTrigger>
              <TabsTrigger value="TRADE">Trade</TabsTrigger>
              <TabsTrigger value="SUBSCRIPTION">Subscription</TabsTrigger>
              <TabsTrigger value="SECURITY">Security</TabsTrigger>
            </TabsList>

            {(["ALL", "BOT", "TRADE", "SUBSCRIPTION", "SECURITY"] as FilterKey[]).map((key) => (
              <TabsContent key={key} value={key} className="mt-0 space-y-3">
                {items.length === 0 ? (
                  <EmptyState
                    title="No notifications"
                    description="You're caught up for this filter."
                  />
                ) : (
                  items.map((n) => (
                    <NotificationItem key={n.id} notification={n} onOpen={openNotification} />
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
