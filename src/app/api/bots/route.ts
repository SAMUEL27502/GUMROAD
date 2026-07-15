import { NextResponse } from "next/server";
import { bots } from "@/lib/data/bots";

export async function GET() {
  return NextResponse.json({ bots, total: bots.length });
}
