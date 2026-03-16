import { NextResponse } from "next/server";

import { getSpots } from "@/server/queries/spots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const artist = searchParams.get("artist") ?? undefined;
  const query = searchParams.get("q") ?? undefined;
  const minRatingParam = searchParams.get("minRating");
  const featuredOnly = searchParams.get("featuredOnly") === "true";
  const sort = searchParams.get("sort") as "recent" | "rating" | "popular" | null;

  const items = await getSpots({
    city,
    category,
    artist,
    query,
    minRating: minRatingParam ? Number(minRatingParam) : undefined,
    featuredOnly,
    sort: sort ?? undefined,
  });

  return NextResponse.json({
    items,
    total: items.length,
  });
}
