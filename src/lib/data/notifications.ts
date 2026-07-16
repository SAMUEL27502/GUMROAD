export type NotificationCategory = "BOT" | "TRADE" | "SUBSCRIPTION" | "SECURITY";

export type NotificationType =
  | "BOT_PERFORMANCE"
  | "MT5_UPDATE"
  | "TRADE_ALERT"
  | "SUBSCRIPTION"
  | "PAYMENT"
  | "SECURITY"
  | "SYSTEM"
  | "REVIEW"
  | "REFERRAL";

export interface AppNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  time: string;
  createdAt: string;
  href: string;
}

export const categoryLabels: Record<NotificationCategory, string> = {
  BOT: "Bot alerts",
  TRADE: "Trade alerts",
  SUBSCRIPTION: "Subscription alerts",
  SECURITY: "Security alerts",
};

export const categoryDescriptions: Record<NotificationCategory, string> = {
  BOT: "Performance updates, EA status, and MT5 sync for your bots",
  TRADE: "Open/close fills, stop-outs, and trade-level events",
  SUBSCRIPTION: "Renewals, billing, plan changes, and payment status",
  SECURITY: "Password, login, and account security events",
};

export function typeToCategory(type: NotificationType): NotificationCategory {
  switch (type) {
    case "BOT_PERFORMANCE":
    case "MT5_UPDATE":
      return "BOT";
    case "TRADE_ALERT":
      return "TRADE";
    case "SUBSCRIPTION":
    case "PAYMENT":
      return "SUBSCRIPTION";
    case "SECURITY":
      return "SECURITY";
    default:
      return "BOT";
  }
}

export const seedNotifications: AppNotification[] = [
  {
    id: "n-bot-1",
    type: "BOT_PERFORMANCE",
    category: "BOT",
    title: "GoldScalper Pro +2.4%",
    message: "Your subscribed bot closed 6 winning trades today.",
    read: false,
    time: "12m ago",
    createdAt: "2026-07-15T23:48:00Z",
    href: "/bots/goldscalper-pro",
  },
  {
    id: "n-bot-2",
    type: "BOT_PERFORMANCE",
    category: "BOT",
    title: "EuroTrend AI drawdown watch",
    message: "Current drawdown reached 4.8% — still within advertised risk.",
    read: false,
    time: "45m ago",
    createdAt: "2026-07-15T23:15:00Z",
    href: "/bots/eurotrend-ai",
  },
  {
    id: "n-bot-3",
    type: "MT5_UPDATE",
    category: "BOT",
    title: "Account synced",
    message: "IC Markets Live equity updated to $25,120.18",
    read: true,
    time: "1h ago",
    createdAt: "2026-07-15T22:50:00Z",
    href: "/mt5",
  },
  {
    id: "n-trade-1",
    type: "TRADE_ALERT",
    category: "TRADE",
    title: "XAUUSD BUY closed +$184.20",
    message: "GoldScalper Pro closed a 0.20 lot winner at 2348.60.",
    read: false,
    time: "18m ago",
    createdAt: "2026-07-15T23:42:00Z",
    href: "/dashboard",
  },
  {
    id: "n-trade-2",
    type: "TRADE_ALERT",
    category: "TRADE",
    title: "EURUSD SELL opened",
    message: "EuroTrend AI opened 0.10 lot on H1 trend continuation.",
    read: false,
    time: "2h ago",
    createdAt: "2026-07-15T22:00:00Z",
    href: "/dashboard",
  },
  {
    id: "n-trade-3",
    type: "TRADE_ALERT",
    category: "TRADE",
    title: "Stop loss hit on GBPUSD",
    message: "BreakoutHunter closed −$42.50 after London fakeout.",
    read: true,
    time: "5h ago",
    createdAt: "2026-07-15T19:00:00Z",
    href: "/bots/breakouthunter",
  },
  {
    id: "n-sub-1",
    type: "SUBSCRIPTION",
    category: "SUBSCRIPTION",
    title: "Pro plan renews soon",
    message: "Your Pro subscription renews in 3 days for $49.",
    read: false,
    time: "3h ago",
    createdAt: "2026-07-15T21:00:00Z",
    href: "/billing",
  },
  {
    id: "n-sub-2",
    type: "PAYMENT",
    category: "SUBSCRIPTION",
    title: "Payment successful",
    message: "Stripe charged $79 for GoldScalper Pro monthly.",
    read: true,
    time: "1d ago",
    createdAt: "2026-07-14T12:00:00Z",
    href: "/billing",
  },
  {
    id: "n-sub-3",
    type: "SUBSCRIPTION",
    category: "SUBSCRIPTION",
    title: "Bot subscription activated",
    message: "NightOwl Grid is now active on your account.",
    read: true,
    time: "2d ago",
    createdAt: "2026-07-13T16:30:00Z",
    href: "/bots/nightowl-grid",
  },
  {
    id: "n-sec-1",
    type: "SECURITY",
    category: "SECURITY",
    title: "New login detected",
    message: "Sign-in from Chrome on Linux · Singapore region.",
    read: false,
    time: "30m ago",
    createdAt: "2026-07-15T23:30:00Z",
    href: "/profile",
  },
  {
    id: "n-sec-2",
    type: "SECURITY",
    category: "SECURITY",
    title: "Password changed",
    message: "Your TradeBib password was updated successfully.",
    read: true,
    time: "3d ago",
    createdAt: "2026-07-12T09:10:00Z",
    href: "/profile",
  },
  {
    id: "n-sec-3",
    type: "SECURITY",
    category: "SECURITY",
    title: "Email verification completed",
    message: "Your account email is verified and secure.",
    read: true,
    time: "1w ago",
    createdAt: "2026-07-08T14:00:00Z",
    href: "/profile",
  },
];

/** Back-compat shape used by older imports */
export const notifications = seedNotifications.map(
  ({ id, type, title, message, read, time, href }) => ({
    id,
    type,
    title,
    message,
    read,
    time,
    href,
  })
);
