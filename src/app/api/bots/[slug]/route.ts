import { NextResponse } from "next/server";
import { getBotBySlug } from "@/lib/data/bots";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = getBotBySlug(slug);

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  return NextResponse.json({ bot });
}
