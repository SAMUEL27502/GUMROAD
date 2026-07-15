export const adminStats = {
  totalUsers: 12483,
  activeBots: 340,
  monthlyRevenue: 284650,
  activeSubscriptions: 3892,
  userGrowth: 12.4,
  revenueGrowth: 18.2,
};

export const adminUsers = [
  { id: "u1", name: "Marcus Chen", email: "marcus@trader.io", plan: "PRO", role: "USER", joined: "2026-07-01", status: "ACTIVE" },
  { id: "u2", name: "Elena Kowalski", email: "elena.fx@gmail.com", plan: "ELITE", role: "USER", joined: "2026-06-28", status: "ACTIVE" },
  { id: "u3", name: "James Liu", email: "james.l@outlook.com", plan: "STARTER", role: "USER", joined: "2026-06-25", status: "ACTIVE" },
  { id: "u4", name: "Priya Nair", email: "priya.trades@yahoo.com", plan: "PRO", role: "USER", joined: "2026-06-20", status: "ACTIVE" },
  { id: "u5", name: "Alex Rivera", email: "alex@cryptoedge.io", plan: "ELITE", role: "USER", joined: "2026-06-15", status: "SUSPENDED" },
  { id: "u6", name: "Admin User", email: "admin@tradebib.com", plan: "ELITE", role: "ADMIN", joined: "2025-01-10", status: "ACTIVE" },
  { id: "u7", name: "Yuki Sato", email: "yuki.s@proton.me", plan: "PRO", role: "USER", joined: "2026-06-10", status: "ACTIVE" },
  { id: "u8", name: "David Okonkwo", email: "david.o@fxmail.com", plan: "STARTER", role: "USER", joined: "2026-06-05", status: "ACTIVE" },
];

export const adminSubscriptions = [
  { id: "s1", user: "Marcus Chen", email: "marcus@trader.io", plan: "PRO", amount: 29, status: "ACTIVE", renews: "2026-08-01", bots: 4 },
  { id: "s2", user: "Elena Kowalski", email: "elena.fx@gmail.com", plan: "ELITE", amount: 79, status: "ACTIVE", renews: "2026-07-28", bots: 12 },
  { id: "s3", user: "James Liu", email: "james.l@outlook.com", plan: "STARTER", amount: 0, status: "ACTIVE", renews: "—", bots: 1 },
  { id: "s4", user: "Priya Nair", email: "priya.trades@yahoo.com", plan: "PRO", amount: 29, status: "ACTIVE", renews: "2026-07-20", bots: 6 },
  { id: "s5", user: "Alex Rivera", email: "alex@cryptoedge.io", plan: "ELITE", amount: 79, status: "PAST_DUE", renews: "2026-07-10", bots: 8 },
  { id: "s6", user: "Yuki Sato", email: "yuki.s@proton.me", plan: "PRO", amount: 29, status: "ACTIVE", renews: "2026-07-15", bots: 3 },
  { id: "s7", user: "David Okonkwo", email: "david.o@fxmail.com", plan: "STARTER", amount: 0, status: "CANCELLED", renews: "—", bots: 0 },
];

export const revenueChartData = [
  { month: "Jan", revenue: 142000, users: 8200 },
  { month: "Feb", revenue: 158400, users: 8900 },
  { month: "Mar", revenue: 171200, users: 9400 },
  { month: "Apr", revenue: 189600, users: 10100 },
  { month: "May", revenue: 212800, users: 10800 },
  { month: "Jun", revenue: 248200, users: 11600 },
  { month: "Jul", revenue: 284650, users: 12483 },
];

export const blogPosts = [
  {
    id: "b1",
    slug: "how-to-evaluate-mt5-bots",
    title: "How to Evaluate MT5 Bots Before You Subscribe",
    excerpt: "A practical framework for assessing drawdown, win rate, and live vs. backtested performance.",
    author: "TradeBib Editorial",
    date: "2026-07-10",
    category: "Guides",
    readTime: "6 min",
  },
  {
    id: "b2",
    slug: "risk-management-for-ea-portfolios",
    title: "Risk Management for Multi-Bot EA Portfolios",
    excerpt: "Learn how to allocate capital across correlated strategies and set portfolio-level stop rules.",
    author: "Sarah Mitchell",
    date: "2026-07-05",
    category: "Risk",
    readTime: "8 min",
  },
  {
    id: "b3",
    slug: "gold-scalping-session-guide",
    title: "Gold Scalping: Best Sessions and Broker Conditions",
    excerpt: "When XAUUSD moves best, which spreads to avoid, and how verified bots handle volatility spikes.",
    author: "Marcus Chen",
    date: "2026-06-28",
    category: "Markets",
    readTime: "5 min",
  },
  {
    id: "b4",
    slug: "mt5-vps-deployment-tips",
    title: "MT5 VPS Deployment: 5 Tips for 24/7 Uptime",
    excerpt: "From broker proximity to auto-restart scripts — keep your Expert Advisors running reliably.",
    author: "TradeBib Editorial",
    date: "2026-06-20",
    category: "Infrastructure",
    readTime: "4 min",
  },
  {
    id: "b5",
    slug: "understanding-profit-factor",
    title: "Understanding Profit Factor and Why It Matters",
    excerpt: "Profit factor is more than a vanity metric. Here's how to interpret it across different strategies.",
    author: "Elena Kowalski",
    date: "2026-06-12",
    category: "Analytics",
    readTime: "7 min",
  },
  {
    id: "b6",
    slug: "tradebib-platform-update-july",
    title: "Platform Update: July 2026",
    excerpt: "New bot comparison tools, enhanced economic calendar, and improved MT5 sync reliability.",
    author: "TradeBib Team",
    date: "2026-07-01",
    category: "Product",
    readTime: "3 min",
  },
];

export const careers = [
  {
    id: "c1",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (EU/US)",
    type: "Full-time",
  },
  {
    id: "c2",
    title: "Quantitative Trading Analyst",
    department: "Research",
    location: "London, UK",
    type: "Full-time",
  },
  {
    id: "c3",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: "c4",
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    id: "c5",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote (EU)",
    type: "Contract",
  },
];
