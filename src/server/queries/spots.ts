import { mockSpots } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SpotListItem } from "@/types/domain";

type GetSpotsInput = {
  city?: string;
  category?: string;
  artist?: string;
  minRating?: number;
  featuredOnly?: boolean;
};

type SpotQueryRow = {
  id: string;
  slug: string;
  title: string;
  category: SpotListItem["category"];
  status: SpotListItem["status"];
  avg_rating: number;
  ratings_count: number;
  is_featured: boolean;
  artists:
    | {
        id: string;
        tag_name: string;
        slug: string | null;
      }
    | {
        id: string;
        tag_name: string;
        slug: string | null;
      }[]
    | null;
  locations:
    | {
        name: string | null;
        city: string | null;
        latitude: number | null;
        longitude: number | null;
        location_visibility: string | null;
      }
    | {
        name: string | null;
        city: string | null;
        latitude: number | null;
        longitude: number | null;
        location_visibility: string | null;
      }[]
    | null;
  artwork_images:
    | {
        image_url: string;
        thumbnail_url: string | null;
        is_primary: boolean;
        moderation_status: string;
      }[]
    | null;
};

function filterMockSpots(input: GetSpotsInput) {
  return mockSpots.filter((spot) => {
    if (input.city && input.city !== "All cities" && spot.location.city !== input.city) {
      return false;
    }

    if (input.category && input.category !== "all" && spot.category !== input.category) {
      return false;
    }

    if (input.artist && !spot.artist.tagName.toLowerCase().includes(input.artist.toLowerCase())) {
      return false;
    }

    if (typeof input.minRating === "number" && spot.avgRating < input.minRating) {
      return false;
    }

    if (input.featuredOnly && !spot.isFeatured) {
      return false;
    }

    return true;
  });
}

export async function getSpots(input: GetSpotsInput = {}): Promise<SpotListItem[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return filterMockSpots(input);
  }

  let query = supabase
    .from("artworks")
    .select(
      `
        id,
        slug,
        title,
        category,
        status,
        avg_rating,
        ratings_count,
        is_featured,
        artists (
          id,
          tag_name,
          slug
        ),
        locations (
          name,
          city,
          latitude,
          longitude,
          location_visibility
        ),
        artwork_images (
          image_url,
          thumbnail_url,
          is_primary,
          moderation_status
        )
      `,
    )
    .in("status", ["approved", "active", "historic", "buffed", "removed"])
    .order("created_at", { ascending: false })
    .limit(24);

  if (input.city && input.city !== "All cities") {
    query = query.eq("locations.city", input.city);
  }

  if (input.category && input.category !== "all") {
    query = query.eq("category", input.category);
  }

  if (typeof input.minRating === "number") {
    query = query.gte("avg_rating", input.minRating);
  }

  if (input.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    return filterMockSpots(input);
  }

  const rows = data as SpotQueryRow[];

  const mapped = rows.map((row) => {
    const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
    const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;
    const primaryImage =
      row.artwork_images?.find((image) => image.is_primary && image.moderation_status === "approved") ??
      row.artwork_images?.find((image) => image.moderation_status === "approved") ??
      null;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      status: row.status,
      avgRating: row.avg_rating,
      ratingsCount: row.ratings_count,
      isFeatured: row.is_featured,
      artist: {
        id: artist?.id ?? null,
        tagName: artist?.tag_name ?? "Unknown artist",
        slug: artist?.slug ?? null,
      },
      location: {
        name: location?.name ?? "Unknown location",
        city: location?.city ?? "Unknown city",
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        visibility: location?.location_visibility ?? "public_approximate",
      },
      primaryImage: primaryImage
        ? {
            imageUrl: primaryImage.image_url,
            thumbnailUrl: primaryImage.thumbnail_url,
          }
        : null,
    } satisfies SpotListItem;
  });

  if (input.artist) {
    return mapped.filter((spot) =>
      spot.artist.tagName.toLowerCase().includes(input.artist!.toLowerCase()),
    );
  }

  return mapped;
}
