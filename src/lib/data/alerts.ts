export type EmailAlertCategory = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type TelegramDefaults = {
  botUsername: string;
  connected: boolean;
  chatId: string | null;
};

/** Default email alert preference toggles for the Alerts settings page. */
export const emailAlertPrefs: EmailAlertCategory[] = [
  {
    id: "trade-fills",
    label: "Trade fills",
    description: "Email when a bot opens or closes a position.",
    enabled: true,
  },
  {
    id: "drawdown",
    label: "Drawdown alerts",
    description: "Notify when daily or weekly drawdown exceeds your limit.",
    enabled: true,
  },
  {
    id: "signals",
    label: "New signals",
    description: "Digest of high-confidence signals from your watchlist.",
    enabled: false,
  },
  {
    id: "billing",
    label: "Billing & renewals",
    description: "Invoices, failed payments, and upcoming renewals.",
    enabled: true,
  },
  {
    id: "security",
    label: "Security",
    description: "Login alerts, password changes, and KYC status updates.",
    enabled: true,
  },
];

export const telegramDefaults: TelegramDefaults = {
  botUsername: "@TradeBibAlertsBot",
  connected: false,
  chatId: null,
};
