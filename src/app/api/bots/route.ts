import { NextResponse } from "next/server";
import { bots } from "@/lib/data/bots";

/** CDN / edge cache for public bot catalog. */
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    { bots, total: bots.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
