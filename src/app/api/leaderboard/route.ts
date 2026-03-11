import { NextResponse } from "next/server";

import { getLeaderboard } from "@/server/queries/leaderboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") === "supporter" ? "supporter" : "artist";
  const items = await getLeaderboard(type);

  return NextResponse.json({
    type,
    generatedAt: new Date().toISOString(),
    items,
  });
}
