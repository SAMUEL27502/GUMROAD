import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTraderBySlug, topTraders } from "@/lib/data/leaderboard";
import { createMetadata } from "@/lib/seo";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export function generateStaticParams() {
  return topTraders.map((t) => ({ handle: t.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const trader = getTraderBySlug(handle);
  if (!trader) {
    return createMetadata({
      title: "Trader not found",
      description: "This trader profile could not be found.",
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${trader.name} (@${trader.slug})`,
    description:
      trader.bio ??
      `${trader.name} on TradeBib — ${formatPercent(trader.roi)} ROI with ${trader.bots} bots.`,
    path: `/traders/${trader.slug}`,
    keywords: [trader.name, trader.slug, "copy trading", "TradeBib trader"],
  });
}

export default async function TraderProfilePage({ params }: PageProps) {
  const { handle } = await params;
  const trader = getTraderBySlug(handle);
  if (!trader) notFound();

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/15 blur-[110px]"
        aria-hidden
      />

      <Container padY="lg" className="relative">
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Trader</Badge>
            {trader.verified && <Badge variant="success">Verified</Badge>}
            <Badge variant="outline">#{trader.rank}</Badge>
            <Badge variant="outline">{trader.country}</Badge>
          </div>
          <h1 className="tb-h1 text-balance">
            {trader.name}{" "}
            <span className="text-muted-foreground text-2xl font-medium sm:text-3xl">
              {trader.handle}
            </span>
          </h1>
          {trader.bio ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {trader.bio}
            </p>
          ) : null}
          {trader.joinedAt ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Joined {new Date(trader.joinedAt).toLocaleDateString()}
            </p>
          ) : null}
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "ROI", value: formatPercent(trader.roi) },
            { label: "Profit", value: formatCurrency(trader.profit) },
            { label: "Win rate", value: `${trader.winRate.toFixed(1)}%` },
            {
              label: "Followers",
              value: formatNumber(trader.followers),
              icon: true,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
                {stat.icon ? <Users className="h-5 w-5 text-sky-400" aria-hidden /> : null}
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="mb-3 text-lg font-bold">Strategies</h2>
          <div className="flex flex-wrap gap-2">
            {(trader.strategies ?? ["Automation"]).map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
            <Badge variant="secondary">{trader.bots} bots</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/copy">
              Copy this trader
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/leaderboard">Back to leaderboard</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
