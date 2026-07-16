import { PrismaClient, RiskLevel } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Forex", slug: "forex", description: "Major and minor FX pairs" },
  { name: "Metals", slug: "metals", description: "Gold, silver, and precious metals" },
  { name: "Crypto", slug: "crypto", description: "BTC, ETH, and crypto indices" },
  { name: "Indices", slug: "indices", description: "Equity and volatility indices" },
];

const STRATEGIES = [
  "Scalping",
  "Trend Following",
  "Grid",
  "Mean Reversion",
  "Breakout",
  "Swing",
  "News Trading",
  "AI Hybrid",
];

const PAIRS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "NZDUSD",
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "ETHUSD",
  "NAS100",
  "US30",
  "GER40",
];

const NAME_PREFIX = [
  "Nova",
  "Apex",
  "Quantum",
  "Pulse",
  "Vertex",
  "Orbit",
  "Forge",
  "Signal",
  "Prime",
  "Echo",
  "Atlas",
  "Nexus",
  "Delta",
  "Horizon",
  "Volt",
  "Swift",
  "Iron",
  "Crystal",
  "Shadow",
  "Lumen",
  "Titan",
  "Zenith",
  "Aurora",
  "Cascade",
  "Drift",
];

const NAME_SUFFIX = [
  "Scalper",
  "Trend AI",
  "Grid Pro",
  "Hunter",
  "Edge",
  "Wave",
  "Ranger",
  "Flow",
  "Strike",
  "Pivot",
  "Matrix",
  "Engine",
  "Bot",
  "EA",
  "Trader",
  "Alpha",
  "Omega",
  "Core",
  "Desk",
  "Lab",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function riskForIndex(i: number): RiskLevel {
  if (i % 3 === 0) return "LOW";
  if (i % 3 === 1) return "MEDIUM";
  return "HIGH";
}

function categoryForPair(pair: string) {
  if (pair.startsWith("XAU") || pair.startsWith("XAG")) return "Metals";
  if (pair.includes("BTC") || pair.includes("ETH")) return "Crypto";
  if (["NAS100", "US30", "GER40"].includes(pair)) return "Indices";
  return "Forex";
}

function monthlyReturns(seed: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month, i) => ({
    month,
    return: Number((((seed * (i + 3)) % 90) / 10 - 2).toFixed(1)),
  }));
}

/** Deterministic sample bot factory — produces exactly 50 bots. */
export function buildSampleBots(count = 50) {
  const bots = [];
  for (let i = 0; i < count; i++) {
    const prefix = NAME_PREFIX[i % NAME_PREFIX.length];
    const suffix = NAME_SUFFIX[Math.floor(i / NAME_PREFIX.length) % NAME_SUFFIX.length];
    const name = `${prefix} ${suffix} ${i + 1}`;
    const pair = PAIRS[i % PAIRS.length];
    const strategy = STRATEGIES[i % STRATEGIES.length];
    const riskLevel = riskForIndex(i);
    const seed = (i + 1) * 17;
    const roi = Number((8 + (seed % 280) / 10).toFixed(1));
    const drawdown = Number((4 + (seed % 120) / 10).toFixed(1));
    const winRate = Number((52 + (seed % 300) / 10).toFixed(1));
    const profitFactor = Number((1.1 + (seed % 120) / 100).toFixed(2));
    const category = categoryForPair(pair);

    bots.push({
      slug: slugify(name),
      name,
      description: `${strategy} Expert Advisor for ${pair} with risk-aware money management and session filters.`,
      strategy,
      tradingPair: pair,
      riskLevel,
      roi,
      drawdown,
      winRate,
      profitFactor,
      subscribers: 120 + ((seed * 13) % 4800),
      price: riskLevel === "HIGH" ? 79 : riskLevel === "MEDIUM" ? 49 : 29,
      rating: Number((3.8 + (seed % 12) / 10).toFixed(1)),
      imageUrl: null as string | null,
      verified: i % 4 !== 0,
      category,
      tags: [category, strategy, pair],
      featured: i < 8,
      monthlyReturns,
    });
  }
  return bots;
}

async function main() {
  console.log("🌱 Seeding TradeBib database…");

  // Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  // Clear existing bots + dependent rows for a clean reseed of marketplace data
  await prisma.botPerformance.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.trade.deleteMany({ where: { botId: { not: null } } });
  await prisma.bot.deleteMany();

  const sampleBots = buildSampleBots(50);

  for (const [index, bot] of sampleBots.entries()) {
    const created = await prisma.bot.create({
      data: {
        slug: bot.slug,
        name: bot.name,
        description: bot.description,
        strategy: bot.strategy,
        tradingPair: bot.tradingPair,
        riskLevel: bot.riskLevel,
        roi: bot.roi,
        drawdown: bot.drawdown,
        winRate: bot.winRate,
        profitFactor: bot.profitFactor,
        subscribers: bot.subscribers,
        price: bot.price,
        rating: bot.rating,
        imageUrl: bot.imageUrl,
        verified: bot.verified,
        category: bot.category,
        tags: bot.tags,
        featured: bot.featured,
        monthlyReturns: bot.monthlyReturns(index + 1),
      },
    });

    // Seed 6 months of performance snapshots per bot
    const days = 6;
    for (let d = 0; d < days; d++) {
      const date = new Date(Date.UTC(2026, d, 15));
      await prisma.botPerformance.create({
        data: {
          botId: created.id,
          date,
          equity: 10000 + (index + 1) * 100 + d * ((index % 7) + 3) * 40,
          roi: Number((bot.roi * ((d + 1) / days)).toFixed(2)),
          drawdown: Number((bot.drawdown * (0.4 + d * 0.1)).toFixed(2)),
          trades: 20 + ((index + d) % 40),
          winRate: bot.winRate,
        },
      });
    }
  }

  const botCount = await prisma.bot.count();
  const perfCount = await prisma.botPerformance.count();
  console.log(`✓ ${botCount} bots seeded`);
  console.log(`✓ ${perfCount} bot performance rows`);

  // Demo admin user (idempotent)
  await prisma.user.upsert({
    where: { email: "admin@tradebib.com" },
    update: { role: "ADMIN", plan: "ELITE", name: "TradeBib Admin" },
    create: {
      email: "admin@tradebib.com",
      name: "TradeBib Admin",
      role: "ADMIN",
      plan: "ELITE",
      emailVerified: true,
      referralCode: "TRADEBIB-ADMIN",
    },
  });
  console.log("✓ demo admin user (admin@tradebib.com)");

  console.log("✅ Seed complete");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
