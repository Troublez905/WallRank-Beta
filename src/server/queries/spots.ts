import { mockSpotDetails, mockSpots } from "@/lib/mock-data";
import { resolveStoredImageUrl } from "@/lib/supabase/image-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SpotDetailItem, SpotListItem } from "@/types/domain";

type GetSpotsInput = {
  city?: string;
  category?: string;
  artist?: string;
  query?: string;
  minRating?: number;
  featuredOnly?: boolean;
  sort?: "recent" | "rating" | "popular";
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
  created_at: string;
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

type SpotDetailRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: SpotDetailItem["category"];
  status: SpotDetailItem["status"];
  wall_type: string | null;
  date_seen: string | null;
  avg_rating: number;
  ratings_count: number;
  comments_count: number;
  artist_points_total: number;
  is_featured: boolean;
  style_tags: string[] | null;
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
        address_text: string | null;
      }
    | {
        name: string | null;
        city: string | null;
        latitude: number | null;
        longitude: number | null;
        location_visibility: string | null;
        address_text: string | null;
      }[]
    | null;
  artwork_images:
    | {
        image_url: string;
        thumbnail_url: string | null;
        caption: string | null;
        timeline_type: string;
        is_primary: boolean;
        moderation_status: string;
        created_at?: string;
      }[]
    | null;
};

type RatingRow = {
  stars: number;
};

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  helpful_count: number;
};

type ViewerCommentRow = {
  created_at: string;
};

function matchesSpotQuery(spot: SpotListItem, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [spot.title, spot.artist.tagName, spot.location.city, spot.location.name]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

function sortSpots(items: SpotListItem[], sort: GetSpotsInput["sort"]) {
  const sorted = items.slice();

  switch (sort) {
    case "rating":
      sorted.sort((a, b) => b.avgRating - a.avgRating || b.ratingsCount - a.ratingsCount);
      break;
    case "popular":
      sorted.sort((a, b) => b.ratingsCount - a.ratingsCount || b.avgRating - a.avgRating);
      break;
    case "recent":
    default:
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.ratingsCount - a.ratingsCount);
      break;
  }

  return sorted;
}

function filterMockSpots(input: GetSpotsInput) {
  return sortSpots(
    mockSpots.filter((spot) => {
      if (input.city && input.city !== "All cities" && spot.location.city !== input.city) {
        return false;
      }

      if (input.category && input.category !== "all" && spot.category !== input.category) {
        return false;
      }

      if (input.artist && !spot.artist.tagName.toLowerCase().includes(input.artist.toLowerCase())) {
        return false;
      }

      if (input.query && !matchesSpotQuery(spot, input.query)) {
        return false;
      }

      if (typeof input.minRating === "number" && spot.avgRating < input.minRating) {
        return false;
      }

      if (input.featuredOnly && !spot.isFeatured) {
        return false;
      }

      return true;
    }),
    input.sort,
  );
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
        created_at,
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

  const mapped = await Promise.all(rows.map(async (row) => {
    const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
    const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;
    const primaryImage =
      row.artwork_images?.find((image) => image.is_primary && image.moderation_status === "approved") ??
      row.artwork_images?.find((image) => image.moderation_status === "approved") ??
      null;
    const signedImageUrl = primaryImage
      ? await resolveStoredImageUrl(supabase, primaryImage.image_url)
      : null;
    const signedThumbnailUrl = primaryImage
      ? await resolveStoredImageUrl(supabase, primaryImage.thumbnail_url)
      : null;

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
            imageUrl: signedImageUrl ?? signedThumbnailUrl ?? primaryImage.image_url,
            thumbnailUrl: signedThumbnailUrl ?? signedImageUrl ?? primaryImage.thumbnail_url,
          }
        : null,
    } satisfies SpotListItem;
  }));

  const filtered = mapped.filter((spot) => {
    if (input.artist && !spot.artist.tagName.toLowerCase().includes(input.artist.toLowerCase())) {
      return false;
    }

    if (input.query && !matchesSpotQuery(spot, input.query)) {
      return false;
    }

    return true;
  });

  return sortSpots(filtered, input.sort);
}

export async function getSpotBySlug(slug: string, viewerUserId?: string): Promise<SpotDetailItem | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockSpotDetails[slug] ?? null;
  }

  const { data, error } = await supabase
    .from("artworks")
    .select(
      `
        id,
        slug,
        title,
        description,
        category,
        status,
        wall_type,
        date_seen,
        avg_rating,
        ratings_count,
        comments_count,
        artist_points_total,
        is_featured,
        style_tags,
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
          location_visibility,
          address_text
        ),
        artwork_images (
          image_url,
          thumbnail_url,
          caption,
          timeline_type,
          is_primary,
          moderation_status,
          created_at
        )
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return mockSpotDetails[slug] ?? null;
  }

  const row = data as SpotDetailRow;
  const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
  const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;
  const approvedImages = (row.artwork_images ?? []).filter((image) => image.moderation_status === "approved");

  const images = await Promise.all(
    approvedImages.map(async (image) => {
      const signedImageUrl = await resolveStoredImageUrl(supabase, image.image_url);
      const signedThumbnailUrl = await resolveStoredImageUrl(supabase, image.thumbnail_url);

      return {
        imageUrl: signedImageUrl ?? signedThumbnailUrl ?? image.image_url,
        thumbnailUrl: signedThumbnailUrl ?? signedImageUrl ?? image.thumbnail_url,
        caption: image.caption,
        timelineType: image.timeline_type,
        isPrimary: image.is_primary,
      };
    }),
  );

  const viewerQueries = viewerUserId
    ? Promise.all([
        supabase
          .from("ratings")
          .select("stars")
          .eq("artwork_id", row.id)
          .eq("user_id", viewerUserId)
          .maybeSingle(),
        supabase
          .from("comments")
          .select("created_at")
          .eq("artwork_id", row.id)
          .eq("user_id", viewerUserId)
          .order("created_at", { ascending: false }),
      ])
    : Promise.resolve([null, null] as const);

  const [{ data: ratings }, { data: comments }, [viewerRatingResult, viewerCommentsResult]] = await Promise.all([
    supabase.from("ratings").select("stars").eq("artwork_id", row.id),
    supabase
      .from("comments")
      .select("id, body, created_at, helpful_count")
      .eq("artwork_id", row.id)
      .eq("moderation_status", "visible")
      .order("created_at", { ascending: false })
      .limit(12),
    viewerQueries,
  ]);

  const ratingHistogram = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

  (ratings as RatingRow[] | null)?.forEach((rating) => {
    const key = String(rating.stars);
    if (key in ratingHistogram) {
      ratingHistogram[key as keyof typeof ratingHistogram] += 1;
    }
  });

  const viewerRating = viewerRatingResult?.data as RatingRow | null | undefined;
  const viewerComments = (viewerCommentsResult?.data as ViewerCommentRow[] | null | undefined) ?? [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    wallType: row.wall_type,
    dateSeen: row.date_seen,
    avgRating: row.avg_rating,
    ratingsCount: row.ratings_count,
    commentsCount: row.comments_count,
    artistPointsTotal: row.artist_points_total,
    isFeatured: row.is_featured,
    styleTags: row.style_tags ?? [],
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
      addressText: location?.address_text ?? null,
    },
    images,
    ratingHistogram,
    comments: ((comments as CommentRow[] | null) ?? []).map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.created_at,
      helpfulCount: comment.helpful_count,
      authorLabel: "Community member",
    })),
    viewer: viewerUserId
      ? {
          existingRating: viewerRating?.stars ?? null,
          commentCount: viewerComments.length,
          lastCommentAt: viewerComments[0]?.created_at ?? null,
        }
      : null,
  };
}
