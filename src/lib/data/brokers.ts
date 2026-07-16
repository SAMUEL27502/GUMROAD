export type BrokerListing = {
  id: string;
  name: string;
  slug: string;
  regulation: string[];
  minDeposit: number;
  spreadsFrom: number;
  platforms: string[];
  rating: number;
  regions: string[];
  website: string;
  highlights: string[];
  mt5Ready: boolean;
};

export const brokerDirectory: BrokerListing[] = [
  {
    id: "b1",
    name: "IC Markets",
    slug: "ic-markets",
    regulation: ["ASIC", "CySEC"],
    minDeposit: 200,
    spreadsFrom: 0.0,
    platforms: ["MT5", "cTrader"],
    rating: 4.8,
    regions: ["Global", "EU", "AU"],
    website: "https://www.icmarkets.com",
    highlights: ["Raw spreads", "Fast execution", "Deep liquidity"],
    mt5Ready: true,
  },
  {
    id: "b2",
    name: "Pepperstone",
    slug: "pepperstone",
    regulation: ["FCA", "ASIC", "CySEC"],
    minDeposit: 0,
    spreadsFrom: 0.0,
    platforms: ["MT5", "TradingView"],
    rating: 4.7,
    regions: ["UK", "AU", "EU"],
    website: "https://pepperstone.com",
    highlights: ["TradingView charts", "Smart Trader Tools", "Low latency"],
    mt5Ready: true,
  },
  {
    id: "b3",
    name: "Exness",
    slug: "exness",
    regulation: ["FSA", "CySEC"],
    minDeposit: 10,
    spreadsFrom: 0.1,
    platforms: ["MT5", "MT4"],
    rating: 4.5,
    regions: ["Global", "MENA", "ASIA"],
    website: "https://www.exness.com",
    highlights: ["Unlimited leverage options", "Instant withdrawals", "24/7 support"],
    mt5Ready: true,
  },
  {
    id: "b4",
    name: "FTMO",
    slug: "ftmo",
    regulation: ["Prop firm"],
    minDeposit: 155,
    spreadsFrom: 0.1,
    platforms: ["MT5", "cTrader"],
    rating: 4.6,
    regions: ["Global"],
    website: "https://ftmo.com",
    highlights: ["Prop challenges", "Scaling plan", "TradeBib sync friendly"],
    mt5Ready: true,
  },
  {
    id: "b5",
    name: "XM",
    slug: "xm",
    regulation: ["CySEC", "ASIC"],
    minDeposit: 5,
    spreadsFrom: 0.6,
    platforms: ["MT5", "MT4"],
    rating: 4.3,
    regions: ["Global", "EU"],
    website: "https://www.xm.com",
    highlights: ["Low minimums", "Bonus programs", "Multi-asset"],
    mt5Ready: true,
  },
  {
    id: "b6",
    name: "Interactive Brokers",
    slug: "interactive-brokers",
    regulation: ["SEC", "FCA"],
    minDeposit: 0,
    spreadsFrom: 0.1,
    platforms: ["IBKR", "API"],
    rating: 4.9,
    regions: ["US", "UK", "Global"],
    website: "https://www.interactivebrokers.com",
    highlights: ["Institutional access", "Global markets", "API first"],
    mt5Ready: false,
  },
];

export function getBrokerBySlug(slug: string) {
  return brokerDirectory.find((b) => b.slug === slug);
}
