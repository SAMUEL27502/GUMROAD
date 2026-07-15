export const platformStats = [
  { label: "Active Traders", value: 12400, suffix: "+", display: "12,400+" },
  { label: "Bots Available", value: 340, suffix: "+", display: "340+" },
  { label: "Average Monthly ROI", value: 8.3, suffix: "%", display: "8.3%" },
  { label: "Trading Volume", value: 2.1, prefix: "$", suffix: "B", display: "$2.1B" },
];

export const features = [
  {
    title: "Verified MT5 Bots",
    description: "Every Expert Advisor is validated against live trading performance before listing.",
    icon: "ShieldCheck",
  },
  {
    title: "Real Performance Data",
    description: "Transparent equity curves, drawdowns, and win rates from connected MT5 accounts.",
    icon: "LineChart",
  },
  {
    title: "Risk Grading",
    description: "Clear LOW / MEDIUM / HIGH risk badges so you can match bots to your tolerance.",
    icon: "Gauge",
  },
  {
    title: "Instant Deployment",
    description: "Subscribe and deploy verified EAs to your MetaTrader 5 account in one click.",
    icon: "Zap",
  },
  {
    title: "Bot Marketplace",
    description: "Browse strategies across forex, metals, and crypto with powerful filters.",
    icon: "Store",
  },
  {
    title: "Portfolio Analytics",
    description: "Track allocation, correlation, and monthly profits across all subscribed bots.",
    icon: "PieChart",
  },
  {
    title: "One Click Deployment",
    description: "Push settings, lots, and risk parameters directly to your connected MT5 terminal.",
    icon: "MousePointerClick",
  },
  {
    title: "Live Charts",
    description: "TradingView-powered charts with watchlists and multi-timeframe analysis.",
    icon: "CandlestickChart",
  },
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Get started with verified bots and core analytics.",
    features: ["1 Bot subscription", "Basic analytics", "MT5 connection", "Email support"],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For active traders running a focused bot portfolio.",
    features: [
      "10 Bot subscriptions",
      "Advanced analytics",
      "Priority support",
      "Performance alerts",
      "AI recommendations",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 79,
    period: "month",
    description: "Unlimited automation with dedicated infrastructure.",
    features: [
      "Unlimited bots",
      "Dedicated VPS",
      "AI insights",
      "Priority support",
      "Affiliate dashboard",
      "Custom risk rules",
    ],
    cta: "Go Elite",
    popular: false,
  },
];

export const connectedAccounts = [
  {
    id: "acc1",
    nickname: "IC Markets Live",
    broker: "IC Markets",
    brokerServer: "ICMarkets-Live03",
    accountNumber: "8742931",
    accountType: "INVESTOR",
    balance: 24850.42,
    equity: 25120.18,
    freeMargin: 18440.55,
    marginLevel: 412.6,
    leverage: "1:500",
    connected: true,
  },
  {
    id: "acc2",
    nickname: "Pepperstone Demo",
    broker: "Pepperstone",
    brokerServer: "Pepperstone-Demo",
    accountNumber: "5021844",
    accountType: "DEMO",
    balance: 10000,
    equity: 10125.3,
    freeMargin: 9450.2,
    marginLevel: 680.1,
    leverage: "1:200",
    connected: true,
  },
];

export const recentTrades = [
  { id: "t1", symbol: "XAUUSD", type: "BUY", volume: 0.15, profit: 84.2, status: "CLOSED", time: "2h ago", bot: "GoldScalper Pro" },
  { id: "t2", symbol: "EURUSD", type: "SELL", volume: 0.5, profit: 32.1, status: "CLOSED", time: "5h ago", bot: "EuroTrend AI" },
  { id: "t3", symbol: "GBPUSD", type: "BUY", volume: 0.3, profit: -18.4, status: "CLOSED", time: "8h ago", bot: "BreakoutHunter" },
  { id: "t4", symbol: "USDJPY", type: "BUY", volume: 0.4, profit: 12.6, status: "OPEN", time: "1h ago", bot: "NightOwl Grid" },
  { id: "t5", symbol: "BTCUSD", type: "BUY", volume: 0.05, profit: 126.8, status: "CLOSED", time: "12h ago", bot: "CryptoForex Hybrid" },
];

export const notifications = [
  {
    id: "n1",
    type: "BOT_PERFORMANCE",
    title: "GoldScalper Pro +2.4%",
    message: "Your subscribed bot closed 6 winning trades today.",
    read: false,
    time: "12m ago",
    href: "/dashboard",
  },
  {
    id: "n2",
    type: "MT5_UPDATE",
    title: "Account synced",
    message: "IC Markets Live equity updated to $25,120.18",
    read: false,
    time: "1h ago",
    href: "/mt5",
  },
  {
    id: "n3",
    type: "SUBSCRIPTION",
    title: "Pro plan renews soon",
    message: "Your Pro subscription renews in 3 days.",
    read: true,
    time: "1d ago",
    href: "/profile",
  },
];

export const dashboardMetrics = {
  activeBots: 4,
  monthlyRoi: 8.7,
  averageDrawdown: 9.2,
  totalTrades: 1284,
  balance: 24850.42,
  profit: 3840.18,
  openTrades: 3,
};

export const portfolioPerformance = [
  { month: "Jan", value: 21000 },
  { month: "Feb", value: 21840 },
  { month: "Mar", value: 22410 },
  { month: "Apr", value: 23120 },
  { month: "May", value: 23890 },
  { month: "Jun", value: 24200 },
  { month: "Jul", value: 24850 },
];

export const riskDistribution = [
  { name: "Low", value: 25, color: "#22C55E" },
  { name: "Medium", value: 45, color: "#0EA5E9" },
  { name: "High", value: 30, color: "#EF4444" },
];

export const botAllocation = [
  { name: "GoldScalper Pro", value: 30 },
  { name: "EuroTrend AI", value: 25 },
  { name: "NightOwl Grid", value: 20 },
  { name: "BreakoutHunter", value: 25 },
];

export const activities = [
  { id: "a1", text: "Subscribed to BreakoutHunter", time: "2h ago" },
  { id: "a2", text: "Connected Pepperstone Demo account", time: "1d ago" },
  { id: "a3", text: "Favorited EuroTrend AI", time: "2d ago" },
  { id: "a4", text: "Deployed GoldScalper Pro to MT5", time: "3d ago" },
];

export const watchlistSymbols = [
  { symbol: "EURUSD", name: "Euro / US Dollar", category: "Forex", change: 0.24 },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "Forex", change: -0.12 },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "Forex", change: 0.08 },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", category: "Forex", change: 0.15 },
  { symbol: "XAUUSD", name: "Gold / US Dollar", category: "Metals", change: 0.62 },
  { symbol: "XAGUSD", name: "Silver / US Dollar", category: "Metals", change: -0.31 },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", category: "Crypto", change: 1.84 },
  { symbol: "ETHUSD", name: "Ethereum / US Dollar", category: "Crypto", change: 1.12 },
];

export const economicEvents = [
  { id: "e1", time: "12:30", currency: "USD", impact: "HIGH", event: "CPI m/m", forecast: "0.2%", previous: "0.1%" },
  { id: "e2", time: "14:00", currency: "USD", impact: "MEDIUM", event: "FOMC Member Speaks", forecast: "—", previous: "—" },
  { id: "e3", time: "09:00", currency: "EUR", impact: "HIGH", event: "ECB Press Conference", forecast: "—", previous: "—" },
  { id: "e4", time: "07:00", currency: "GBP", impact: "MEDIUM", event: "GDP m/m", forecast: "0.1%", previous: "0.0%" },
  { id: "e5", time: "23:50", currency: "JPY", impact: "LOW", event: "Trade Balance", forecast: "0.45T", previous: "0.38T" },
];

export const forexNews = [
  {
    id: "news1",
    title: "Dollar softens ahead of CPI as traders price softer inflation",
    source: "TradeBib Wire",
    time: "1h ago",
    tag: "USD",
  },
  {
    id: "news2",
    title: "Gold holds near session highs on geopolitical risk premium",
    source: "Metals Desk",
    time: "3h ago",
    tag: "XAU",
  },
  {
    id: "news3",
    title: "EURUSD consolidates as ECB speakers stay data-dependent",
    source: "FX Briefing",
    time: "5h ago",
    tag: "EUR",
  },
  {
    id: "news4",
    title: "Bitcoin volatility compresses — breakout bots on watch",
    source: "Crypto Desk",
    time: "7h ago",
    tag: "BTC",
  },
];

export const leaderboard = [
  { rank: 1, name: "NovaCapital", roi: 42.8, bots: 6, followers: 1820 },
  { rank: 2, name: "TokyoRange", roi: 36.2, bots: 4, followers: 1240 },
  { rank: 3, name: "GoldEdge", roi: 31.5, bots: 3, followers: 980 },
  { rank: 4, name: "LondonBreak", roi: 28.1, bots: 5, followers: 760 },
  { rank: 5, name: "QuietGrid", roi: 24.4, bots: 2, followers: 640 },
];

export const mt5Steps = [
  {
    step: 1,
    title: "Open investor access",
    description: "Enable investor (read-only) password in your MT5 account settings.",
  },
  {
    step: 2,
    title: "Enter broker details",
    description: "Provide broker server, account number, and investor password.",
  },
  {
    step: 3,
    title: "Verify connection",
    description: "TradeBib syncs balance, equity, and open trades securely.",
  },
  {
    step: 4,
    title: "Deploy bots",
    description: "Subscribe and push verified EAs to your connected terminal.",
  },
];
