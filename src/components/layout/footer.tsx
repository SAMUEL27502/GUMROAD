import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./container";

/** Routes with large client bundles skip prefetch. */
const HEAVY = new Set([
  "/dashboard",
  "/charts",
  "/compare",
  "/mt5",
  "/recommend",
  "/notifications",
  "/referrals",
  "/copy",
  "/vps",
  "/heatmap",
  "/journal",
  "/alerts",
  "/animations",
  "/design-system",
]);

const columns = [
  {
    title: "Product",
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/signals", label: "Trading Signals" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/copy", label: "Copy Trading" },
      { href: "/vps", label: "VPS Hosting" },
      { href: "/pricing", label: "Pricing" },
      { href: "/mt5", label: "MT5 Connect" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/brokers", label: "Broker Directory" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/calendar", label: "Economic Calendar" },
      { href: "/news", label: "Forex News" },
      { href: "/journal", label: "AI Trade Journal" },
      { href: "/heatmap", label: "Portfolio Heatmap" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/alerts", label: "Telegram & Email Alerts" },
      { href: "/kyc", label: "KYC Verification" },
      { href: "/recommend", label: "AI Recommendations" },
      { href: "/compare", label: "Bot Comparison" },
      { href: "/learn", label: "MT5 Code Lab" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/risk-disclosure", label: "Risk Disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border/60 bg-background/80 border-t">
      <Container padY="lg">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              Discover verified MetaTrader 5 Expert Advisors, connect accounts, and automate with
              confidence.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-foreground mb-4 text-sm font-semibold">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      prefetch={!HEAVY.has(link.href)}
                      className="text-muted-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors hover:text-sky-400 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-border/60 mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} TradeBib. All rights reserved.
          </p>
          <p className="text-muted-foreground max-w-xl text-xs leading-relaxed">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </Container>
    </footer>
  );
}
