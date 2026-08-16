import { mockSpots } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SpotDetail, SpotListItem } from "@/types/domain";

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
        latitude: location?.location_visibility === "public_approximate" ? Math.round((location?.latitude ?? 0) * 100) / 100 : location?.latitude ?? 0,
        longitude: location?.location_visibility === "public_approximate" ? Math.round((location?.longitude ?? 0) * 100) / 100 : location?.longitude ?? 0,
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

type DetailRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  avg_rating: number;
  ratings_count: number;
  comments_count: number;
  is_featured: boolean;
  style_tags: string[] | null;
  wall_type: string | null;
  date_seen: string | null;
  artists: { id: string; tag_name: string; slug: string | null } | { id: string; tag_name: string; slug: string | null }[] | null;
  locations: { name: string | null; city: string | null; latitude: number; longitude: number; location_visibility: string } | { name: string | null; city: string | null; latitude: number; longitude: number; location_visibility: string }[] | null;
  artwork_images: Array<{ image_url: string; thumbnail_url: string | null; caption: string | null; is_primary: boolean; moderation_status: string }> | null;
  ratings: Array<{ user_id: string; stars: number }> | null;
  comments: Array<{ id: string; body: string; created_at: string; user_id: string; moderation_status: string }> | null;
  favorites: Array<{ user_id: string }> | null;
};

export async function getSpotBySlug(slug: string, viewerId?: string | null): Promise<SpotDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    const spot = mockSpots.find((item) => item.slug === slug);
    if (!spot) return null;
    return { ...spot, description: "A community-documented wall from the WallRank demo archive.", styleTags: [spot.category], wallType: "concrete", dateSeen: null, commentsCount: 0, images: spot.primaryImage ? [{ ...spot.primaryImage, caption: null }] : [], ratingsBreakdown: { 1: 0, 2: 0, 3: 1, 4: 4, 5: Math.max(0, spot.ratingsCount - 5) }, comments: [], viewerRating: null, isFavorite: false };
  }

  const { data, error } = await supabase.from("artworks").select(`
    id, slug, title, description, category, status, avg_rating, ratings_count, comments_count,
    is_featured, style_tags, wall_type, date_seen,
    artists ( id, tag_name, slug ),
    locations ( name, city, latitude, longitude, location_visibility ),
    artwork_images ( image_url, thumbnail_url, caption, is_primary, moderation_status ),
    ratings ( user_id, stars ),
    comments ( id, body, created_at, user_id, moderation_status ),
    favorites ( user_id )
  `).eq("slug", slug).single();

  if (error || !data) return null;
  const row = data as DetailRow;
  const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
  const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;
  const images = (row.artwork_images ?? []).filter((image) => image.moderation_status === "approved");
  const ratings = row.ratings ?? [];
  const breakdown: SpotDetail["ratingsBreakdown"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const rating of ratings) if (rating.stars >= 1 && rating.stars <= 5) breakdown[rating.stars as keyof typeof breakdown] += 1;
  const primaryImage = images.find((image) => image.is_primary) ?? images[0] ?? null;

  return {
    id: row.id, slug: row.slug, title: row.title, category: row.category, status: row.status,
    avgRating: Number(row.avg_rating), ratingsCount: row.ratings_count, commentsCount: row.comments_count,
    isFeatured: row.is_featured, description: row.description, styleTags: row.style_tags ?? [], wallType: row.wall_type,
    dateSeen: row.date_seen, artist: { id: artist?.id ?? null, tagName: artist?.tag_name ?? "Unknown artist", slug: artist?.slug ?? null },
    location: { name: location?.name ?? "Unknown location", city: location?.city ?? "Unknown city", latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0, visibility: location?.location_visibility ?? "public_approximate" },
    primaryImage: primaryImage ? { imageUrl: primaryImage.image_url, thumbnailUrl: primaryImage.thumbnail_url } : null,
    images: images.map((image) => ({ imageUrl: image.image_url, thumbnailUrl: image.thumbnail_url, caption: image.caption })),
    ratingsBreakdown: breakdown,
    comments: (row.comments ?? []).filter((comment) => comment.moderation_status === "visible").sort((a, b) => b.created_at.localeCompare(a.created_at)).map((comment) => ({ id: comment.id, body: comment.body, createdAt: comment.created_at, userId: comment.user_id })),
    viewerRating: viewerId ? ratings.find((rating) => rating.user_id === viewerId)?.stars ?? null : null,
    isFavorite: viewerId ? (row.favorites ?? []).some((favorite) => favorite.user_id === viewerId) : false,
  };
}
