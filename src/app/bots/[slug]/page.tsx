import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BotDetails } from "@/components/bots/bot-details";
import { getBotBySlug } from "@/lib/data/bots";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bot = getBotBySlug(slug);
  if (!bot) return { title: "Bot Not Found" };
  return {
    title: bot.name,
    description: bot.description,
  };
}

export default async function BotPage({ params }: PageProps) {
  const { slug } = await params;
  const bot = getBotBySlug(slug);
  if (!bot) notFound();
  return <BotDetails bot={bot} />;
}
