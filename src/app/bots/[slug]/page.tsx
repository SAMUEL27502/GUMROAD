import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BotDetails } from "@/components/bots/bot-details";
import { JsonLd } from "@/components/seo/json-ld";
import { getBotBySlug, bots } from "@/lib/data/bots";
import {
  breadcrumbJsonLd,
  createMetadata,
  softwareApplicationJsonLd,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return bots.map((bot) => ({ slug: bot.slug }));
}

/** ISR: refresh bot detail pages hourly. */
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bot = getBotBySlug(slug);
  if (!bot) return createMetadata({ title: "Bot not found", description: "Bot not found", noIndex: true });

  return createMetadata({
    title: `${bot.name} — ${bot.strategy} EA`,
    description: bot.description,
    path: `/bots/${bot.slug}`,
    keywords: [
      bot.name,
      bot.strategy,
      bot.tradingPair,
      bot.category,
      "MT5",
      "Expert Advisor",
      "TradeBib",
    ],
  });
}

export default async function BotPage({ params }: PageProps) {
  const { slug } = await params;
  const bot = getBotBySlug(slug);
  if (!bot) notFound();

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationJsonLd(bot),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Marketplace", path: "/marketplace" },
            { name: bot.name, path: `/bots/${bot.slug}` },
          ]),
        ]}
      />
      <BotDetails bot={bot} />
    </>
  );
}
