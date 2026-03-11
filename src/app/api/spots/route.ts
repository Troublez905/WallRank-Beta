import { NextResponse } from "next/server";

import { getSpots } from "@/server/queries/spots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const artist = searchParams.get("artist") ?? undefined;
  const minRatingParam = searchParams.get("minRating");
  const featuredOnly = searchParams.get("featuredOnly") === "true";

  const items = await getSpots({
    city,
    category,
    artist,
    minRating: minRatingParam ? Number(minRatingParam) : undefined,
    featuredOnly,
  });

  return NextResponse.json({
    items,
    total: items.length,
  });
}
