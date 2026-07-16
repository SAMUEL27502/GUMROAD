export const platformStats = [
  { label: "Active Traders", value: 12400, suffix: "+", display: "12,400+" },
  { label: "Bots Available", value: 340, suffix: "+", display: "340+" },
  { label: "Average Monthly ROI", value: 8.3, suffix: "%", display: "8.3%" },
  { label: "Trading Volume", value: 2.1, prefix: "$", suffix: "B", display: "$2.1B" },
];

export const features = [
  {
    title: "Verified MT5 Bots",
    description:
      "Every Expert Advisor is validated against live trading performance before listing.",
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
    description:
      "Push settings, lots, and risk parameters directly to your connected MT5 terminal.",
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
    yearlyPrice: 0,
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
    yearlyPrice: 290,
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
    yearlyPrice: 790,
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

/** Feature comparison matrix for Starter / Pro / Elite. */
export const pricingComparison = [
  { feature: "Bot subscriptions", starter: "1", pro: "10", elite: "Unlimited" },
  { feature: "MT5 connections", starter: "1", pro: "3", elite: "Unlimited" },
  { feature: "Marketplace access", starter: true, pro: true, elite: true },
  { feature: "Basic analytics", starter: true, pro: true, elite: true },
  { feature: "Advanced analytics", starter: false, pro: true, elite: true },
  { feature: "Performance alerts", starter: false, pro: true, elite: true },
  { feature: "AI recommendations", starter: false, pro: true, elite: true },
  { feature: "Dedicated VPS", starter: false, pro: false, elite: true },
  { feature: "Affiliate dashboard", starter: false, pro: false, elite: true },
  { feature: "Custom risk rules", starter: false, pro: false, elite: true },
  { feature: "Priority support", starter: "Email", pro: "Priority", elite: "Dedicated" },
];

export const howItWorks = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up in seconds and choose a plan that matches your automation goals.",
    icon: "UserPlus",
  },
  {
    step: "02",
    title: "Connect MetaTrader 5",
    description: "Link your broker with a read-only investor password for secure live syncing.",
    icon: "Plug",
  },
  {
    step: "03",
    title: "Subscribe to verified bots",
    description: "Browse risk-graded Expert Advisors with transparent equity and drawdown data.",
    icon: "Bot",
  },
  {
    step: "04",
    title: "Deploy and monitor",
    description: "One-click deploy to MT5, then track performance from your TradeBib dashboard.",
    icon: "Rocket",
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Marcus Chen",
    role: "Prop trader · Singapore",
    quote:
      "TradeBib replaced three spreadsheets and a messy VPS setup. The verified badges actually mean something — equity curves match my live accounts.",
    rating: 5,
    avatar: "MC",
  },
  {
    id: "t2",
    name: "Elena Vargas",
    role: "Retail forex · Madrid",
    quote:
      "I subscribed to EuroTrend AI and NightOwl Grid in one afternoon. Risk grading made it easy to size positions without guessing.",
    rating: 5,
    avatar: "EV",
  },
  {
    id: "t3",
    name: "James Okonkwo",
    role: "Algo desk · London",
    quote:
      "The MT5 investor sync is clean. We monitor drawdowns and ROI in real time — feels like a proper SaaS, not another EA marketplace.",
    rating: 5,
    avatar: "JO",
  },
];

export const homepageFaq = [
  {
    question: "What is TradeBib?",
    answer:
      "TradeBib is a Forex & MT5 automation platform where traders discover verified Expert Advisors, connect MetaTrader 5 accounts, monitor performance, and subscribe to trading bots.",
  },
  {
    question: "Are the bots verified with real data?",
    answer:
      "Yes. Listed EAs go through performance validation against live trading metrics before receiving a Verified badge. You can review equity curves, drawdown, win rate, and profit factor on each bot page.",
  },
  {
    question: "Is my MT5 password safe?",
    answer:
      "TradeBib connects using investor (read-only) access. We never require your master trading password for account syncing.",
  },
  {
    question: "Can I cancel a bot subscription anytime?",
    answer:
      "Yes. Manage platform plans and individual bot subscriptions from your profile. Cancellations take effect at the end of the current billing period.",
  },
  {
    question: "Does past performance guarantee future results?",
    answer:
      "No. Trading involves risk. Past performance does not guarantee future results. Always size positions according to your risk tolerance and capital.",
  },
];

export type Mt5Order = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  profit: number;
  status: "OPEN" | "CLOSED";
  time: string;
};

export const connectedAccounts = [
  {
    id: "acc1",
    nickname: "IC Markets Live",
    broker: "IC Markets",
    brokerServer: "ICMarkets-Live03",
    accountNumber: "8742931",
    accountType: "INVESTOR" as const,
    balance: 24850.42,
    equity: 25120.18,
    freeMargin: 18440.55,
    marginLevel: 412.6,
    leverage: "1:500",
    connected: true,
    openTrades: 3,
    recentOrders: [
      {
        id: "o1",
        symbol: "XAUUSD",
        type: "BUY" as const,
        volume: 0.15,
        profit: 84.2,
        status: "CLOSED" as const,
        time: "2h ago",
      },
      {
        id: "o2",
        symbol: "USDJPY",
        type: "BUY" as const,
        volume: 0.4,
        profit: 12.6,
        status: "OPEN" as const,
        time: "1h ago",
      },
      {
        id: "o3",
        symbol: "EURUSD",
        type: "SELL" as const,
        volume: 0.5,
        profit: 32.1,
        status: "CLOSED" as const,
        time: "5h ago",
      },
    ] satisfies Mt5Order[],
  },
  {
    id: "acc2",
    nickname: "Pepperstone Demo",
    broker: "Pepperstone",
    brokerServer: "Pepperstone-Demo",
    accountNumber: "5021844",
    accountType: "DEMO" as const,
    balance: 10000,
    equity: 10125.3,
    freeMargin: 9450.2,
    marginLevel: 680.1,
    leverage: "1:200",
    connected: true,
    openTrades: 1,
    recentOrders: [
      {
        id: "o4",
        symbol: "GBPUSD",
        type: "BUY" as const,
        volume: 0.3,
        profit: -18.4,
        status: "CLOSED" as const,
        time: "8h ago",
      },
      {
        id: "o5",
        symbol: "AUDUSD",
        type: "SELL" as const,
        volume: 0.2,
        profit: 8.5,
        status: "OPEN" as const,
        time: "3h ago",
      },
    ] satisfies Mt5Order[],
  },
];

export const recentTrades = [
  {
    id: "t1",
    symbol: "XAUUSD",
    type: "BUY",
    volume: 0.15,
    profit: 84.2,
    status: "CLOSED",
    time: "2h ago",
    bot: "GoldScalper Pro",
  },
  {
    id: "t2",
    symbol: "EURUSD",
    type: "SELL",
    volume: 0.5,
    profit: 32.1,
    status: "CLOSED",
    time: "5h ago",
    bot: "EuroTrend AI",
  },
  {
    id: "t3",
    symbol: "GBPUSD",
    type: "BUY",
    volume: 0.3,
    profit: -18.4,
    status: "CLOSED",
    time: "8h ago",
    bot: "BreakoutHunter",
  },
  {
    id: "t4",
    symbol: "USDJPY",
    type: "BUY",
    volume: 0.4,
    profit: 12.6,
    status: "OPEN",
    time: "1h ago",
    bot: "NightOwl Grid",
  },
  {
    id: "t5",
    symbol: "BTCUSD",
    type: "BUY",
    volume: 0.05,
    profit: 126.8,
    status: "CLOSED",
    time: "12h ago",
    bot: "CryptoForex Hybrid",
  },
];

export { notifications } from "@/lib/data/notifications";

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

/** Monthly net profit derived for dashboard bar chart. */
export const monthlyProfitSeries = portfolioPerformance.slice(1).map((point, i) => ({
  month: point.month,
  profit: point.value - portfolioPerformance[i].value,
}));

/** Cumulative ROI % vs January starting equity. */
export const roiSeries = portfolioPerformance.map((point) => ({
  month: point.month,
  roi: Number(
    (((point.value - portfolioPerformance[0].value) / portfolioPerformance[0].value) * 100).toFixed(
      2
    )
  ),
}));

/** Account balance vs equity for balance chart. */
export const balanceSeries = [
  { month: "Jan", balance: 21000, equity: 21120 },
  { month: "Feb", balance: 21840, equity: 21910 },
  { month: "Mar", balance: 22410, equity: 22340 },
  { month: "Apr", balance: 23120, equity: 23280 },
  { month: "May", balance: 23890, equity: 23750 },
  { month: "Jun", balance: 24200, equity: 24340 },
  { month: "Jul", balance: 24850, equity: 25120 },
];

/** Portfolio drawdown % over time. */
export const drawdownSeries = [
  { month: "Jan", drawdown: 2.1 },
  { month: "Feb", drawdown: 3.4 },
  { month: "Mar", drawdown: 5.8 },
  { month: "Apr", drawdown: 4.2 },
  { month: "May", drawdown: 7.1 },
  { month: "Jun", drawdown: 6.4 },
  { month: "Jul", drawdown: 4.9 },
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
  {
    id: "e1",
    time: "12:30",
    currency: "USD",
    impact: "HIGH",
    event: "CPI m/m",
    forecast: "0.2%",
    previous: "0.1%",
  },
  {
    id: "e2",
    time: "14:00",
    currency: "USD",
    impact: "MEDIUM",
    event: "FOMC Member Speaks",
    forecast: "—",
    previous: "—",
  },
  {
    id: "e3",
    time: "09:00",
    currency: "EUR",
    impact: "HIGH",
    event: "ECB Press Conference",
    forecast: "—",
    previous: "—",
  },
  {
    id: "e4",
    time: "07:00",
    currency: "GBP",
    impact: "MEDIUM",
    event: "GDP m/m",
    forecast: "0.1%",
    previous: "0.0%",
  },
  {
    id: "e5",
    time: "23:50",
    currency: "JPY",
    impact: "LOW",
    event: "Trade Balance",
    forecast: "0.45T",
    previous: "0.38T",
  },
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

export { leaderboard, topTraders } from "@/lib/data/leaderboard";

export const mt5Steps = [
  {
    step: 1,
    title: "Open investor access",
    description: "Enable investor (read-only) password in your MT5 account settings.",
  },
  {
    step: 2,
    title: "Enter broker details",
    description: "Provide broker, server, login, investor password, and a nickname.",
  },
  {
    step: 3,
    title: "Verify connection",
    description: "TradeBib syncs balance, equity, margin, and open trades securely.",
  },
  {
    step: 4,
    title: "Deploy bots",
    description: "Subscribe and push verified EAs to your connected terminal.",
  },
];

export const mt5Brokers = [
  { name: "IC Markets", servers: ["ICMarkets-Live01", "ICMarkets-Live03", "ICMarketsSC-Demo"] },
  { name: "Pepperstone", servers: ["Pepperstone-Live", "Pepperstone-Demo"] },
  { name: "Exness", servers: ["Exness-MT5Real", "Exness-MT5Trial"] },
  { name: "FTMO", servers: ["FTMO-Server", "FTMO-Demo"] },
  { name: "XM", servers: ["XMGlobal-MT5", "XMGlobal-Demo"] },
  { name: "Other", servers: [] },
];
