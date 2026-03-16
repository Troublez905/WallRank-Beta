import { mockArtistDetails, mockArtists } from "@/lib/mock-data";
import { resolveStoredImageUrl } from "@/lib/supabase/image-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ArtistDetailItem, ArtistListItem } from "@/types/domain";

type GetArtistsInput = {
  query?: string;
  city?: string;
  verifiedOnly?: boolean;
  sort?: "monthly" | "all-time" | "rating" | "recent";
};

type ArtistListRow = {
  id: string;
  slug: string;
  tag_name: string;
  display_name: string | null;
  city: string | null;
  country: string | null;
  is_verified: boolean;
  is_claimed: boolean;
  total_points: number;
  monthly_points: number;
  all_time_avg_rating: number;
  artwork_count: number;
  spot_count: number;
  created_at: string;
};

type ArtistRow = {
  id: string;
  slug: string;
  tag_name: string;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  website_url: string | null;
  is_verified: boolean;
  is_claimed: boolean;
  total_points: number;
  monthly_points: number;
  all_time_avg_rating: number;
  artwork_count: number;
  spot_count: number;
};

type ArtistArtworkRow = {
  artist_id?: string;
  id: string;
  slug: string;
  title: string;
  avg_rating: number;
  ratings_count: number;
  status: string;
  locations:
    | {
        city: string | null;
      }
    | {
        city: string | null;
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

type FeaturedRow = {
  id: string;
  feature_type: string;
  feature_month: string;
  headline: string | null;
  article_excerpt: string | null;
};

const publicArtworkStatuses = ["approved", "active", "historic", "buffed", "removed"];

function matchesArtistQuery(artist: ArtistListItem, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    artist.tagName,
    artist.displayName ?? "",
    artist.city ?? "",
    artist.country ?? "",
    artist.topArtwork?.title ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

function sortArtists(items: ArtistListItem[], sort: GetArtistsInput["sort"]) {
  const sorted = items.slice();

  switch (sort) {
    case "all-time":
      sorted.sort((a, b) => b.totalPoints - a.totalPoints);
      break;
    case "rating":
      sorted.sort((a, b) => b.avgRating - a.avgRating || b.monthlyPoints - a.monthlyPoints);
      break;
    case "recent":
      sorted.sort((a, b) => (b.topArtwork?.avgRating ?? 0) - (a.topArtwork?.avgRating ?? 0));
      break;
    case "monthly":
    default:
      sorted.sort((a, b) => b.monthlyPoints - a.monthlyPoints || b.totalPoints - a.totalPoints);
      break;
  }

  return sorted;
}

function filterMockArtists(input: GetArtistsInput) {
  const city = input.city && input.city !== "All cities" ? input.city : null;

  return sortArtists(
    mockArtists.filter((artist) => {
      if (city && artist.city !== city) {
        return false;
      }

      if (input.verifiedOnly && !artist.isVerified) {
        return false;
      }

      if (input.query && !matchesArtistQuery(artist, input.query)) {
        return false;
      }

      return true;
    }),
    input.sort,
  );
}

function rankArtistsByValue(
  artists: Array<{ id: string; value: number }>,
  targetId: string,
) {
  const index = artists.findIndex((artist) => artist.id === targetId);
  return index >= 0 ? index + 1 : null;
}

export async function getArtists(input: GetArtistsInput = {}): Promise<ArtistListItem[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return filterMockArtists(input);
  }

  let query = supabase
    .from("artists")
    .select(
      "id, slug, tag_name, display_name, city, country, is_verified, is_claimed, total_points, monthly_points, all_time_avg_rating, artwork_count, spot_count, created_at",
    )
    .limit(48);

  if (input.city && input.city !== "All cities") {
    query = query.eq("city", input.city);
  }

  if (input.verifiedOnly) {
    query = query.eq("is_verified", true);
  }

  if (input.query?.trim()) {
    const escaped = input.query.trim().replaceAll(",", " ");
    query = query.or(
      `tag_name.ilike.%${escaped}%,display_name.ilike.%${escaped}%,city.ilike.%${escaped}%`,
    );
  }

  const { data, error } = await query;

  if (error || !data) {
    return filterMockArtists(input);
  }

  const artistRows = data as ArtistListRow[];

  if (artistRows.length === 0) {
    return [];
  }

  const artistIds = artistRows.map((artist) => artist.id);
  const { data: artworkData } = await supabase
    .from("artworks")
    .select(
      `
        artist_id,
        id,
        slug,
        title,
        avg_rating,
        ratings_count,
        status,
        locations ( city ),
        artwork_images ( image_url, thumbnail_url, is_primary, moderation_status )
      `,
    )
    .in("artist_id", artistIds)
    .in("status", publicArtworkStatuses)
    .order("avg_rating", { ascending: false })
    .limit(200);

  const artworksByArtist = new Map<string, ArtistArtworkRow[]>();

  ((artworkData as ArtistArtworkRow[] | null) ?? []).forEach((artwork) => {
    const artistId = artwork.artist_id;

    if (!artistId) {
      return;
    }

    const existing = artworksByArtist.get(artistId) ?? [];
    existing.push(artwork);
    artworksByArtist.set(artistId, existing);
  });

  const items = await Promise.all(
    artistRows.map(async (artist) => {
      const candidateArtworks = artworksByArtist.get(artist.id) ?? [];
      const topArtworkSource = candidateArtworks[0] ?? null;
      const location = Array.isArray(topArtworkSource?.locations)
        ? topArtworkSource.locations[0]
        : topArtworkSource?.locations;
      const primaryImage =
        topArtworkSource?.artwork_images?.find(
          (image) => image.is_primary && image.moderation_status === "approved",
        ) ??
        topArtworkSource?.artwork_images?.find((image) => image.moderation_status === "approved") ??
        null;
      const imageUrl = primaryImage
        ? await resolveStoredImageUrl(supabase, primaryImage.image_url)
        : null;
      const thumbnailUrl = primaryImage
        ? await resolveStoredImageUrl(supabase, primaryImage.thumbnail_url)
        : null;

      return {
        id: artist.id,
        slug: artist.slug,
        tagName: artist.tag_name,
        displayName: artist.display_name,
        city: artist.city,
        country: artist.country,
        isVerified: artist.is_verified,
        isClaimed: artist.is_claimed,
        totalPoints: artist.total_points,
        monthlyPoints: artist.monthly_points,
        avgRating: artist.all_time_avg_rating,
        artworkCount: artist.artwork_count,
        spotCount: artist.spot_count,
        topArtwork: topArtworkSource
          ? {
              id: topArtworkSource.id,
              slug: topArtworkSource.slug,
              title: topArtworkSource.title,
              city: location?.city ?? artist.city,
              avgRating: topArtworkSource.avg_rating,
              imageUrl: imageUrl ?? thumbnailUrl ?? primaryImage?.image_url ?? null,
              thumbnailUrl: thumbnailUrl ?? imageUrl ?? primaryImage?.thumbnail_url ?? null,
            }
          : null,
      } satisfies ArtistListItem;
    }),
  );

  return sortArtists(items, input.sort).filter((artist) =>
    input.query?.trim() ? matchesArtistQuery(artist, input.query) : true,
  );
}

export async function getArtistBySlug(slug: string): Promise<ArtistDetailItem | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return mockArtistDetails[slug] ?? null;
  }

  const { data: artistData, error: artistError } = await supabase
    .from("artists")
    .select(
      "id, slug, tag_name, display_name, bio, city, country, avatar_url, banner_url, instagram_handle, twitter_handle, website_url, is_verified, is_claimed, total_points, monthly_points, all_time_avg_rating, artwork_count, spot_count",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (artistError || !artistData) {
    return mockArtistDetails[slug] ?? null;
  }

  const artist = artistData as ArtistRow;

  const [{ data: artworks }, { data: features }, { data: monthlyRanks }, { data: allTimeRanks }] =
    await Promise.all([
      supabase
        .from("artworks")
        .select(
          `
            id,
            slug,
            title,
            avg_rating,
            ratings_count,
            status,
            locations ( city ),
            artwork_images ( image_url, thumbnail_url, is_primary, moderation_status )
          `,
        )
        .eq("artist_id", artist.id)
        .in("status", publicArtworkStatuses)
        .order("avg_rating", { ascending: false })
        .limit(24),
      supabase
        .from("featured_artists")
        .select("id, feature_type, feature_month, headline, article_excerpt")
        .eq("artist_id", artist.id)
        .eq("is_published", true)
        .order("feature_month", { ascending: false })
        .limit(12),
      supabase
        .from("artists")
        .select("id, monthly_points")
        .order("monthly_points", { ascending: false })
        .limit(100),
      supabase
        .from("artists")
        .select("id, total_points")
        .order("total_points", { ascending: false })
        .limit(100),
    ]);

  const artworkRows = (artworks as ArtistArtworkRow[] | null) ?? [];
  const gallery = await Promise.all(
    artworkRows.map(async (artwork) => {
      const location = Array.isArray(artwork.locations) ? artwork.locations[0] : artwork.locations;
      const primaryImage =
        artwork.artwork_images?.find((image) => image.is_primary && image.moderation_status === "approved") ??
        artwork.artwork_images?.find((image) => image.moderation_status === "approved") ??
        null;
      const imageUrl = primaryImage
        ? await resolveStoredImageUrl(supabase, primaryImage.image_url)
        : null;
      const thumbnailUrl = primaryImage
        ? await resolveStoredImageUrl(supabase, primaryImage.thumbnail_url)
        : null;

      return {
        id: artwork.id,
        slug: artwork.slug,
        title: artwork.title,
        city: location?.city ?? "Unknown city",
        avgRating: artwork.avg_rating,
        status: artwork.status,
        imageUrl: imageUrl ?? thumbnailUrl ?? primaryImage?.image_url ?? null,
        thumbnailUrl: thumbnailUrl ?? imageUrl ?? primaryImage?.thumbnail_url ?? null,
      };
    }),
  );

  const topPieces = gallery
    .slice()
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5)
    .map((piece) => {
      const source = artworkRows.find((artwork) => artwork.id === piece.id);

      return {
        id: piece.id,
        slug: piece.slug,
        title: piece.title,
        avgRating: piece.avgRating,
        ratingsCount: source?.ratings_count ?? 0,
        imageUrl: piece.thumbnailUrl ?? piece.imageUrl,
      };
    });

  const monthlyRank = rankArtistsByValue(
    ((monthlyRanks as Array<{ id: string; monthly_points: number }> | null) ?? []).map((row) => ({
      id: row.id,
      value: row.monthly_points,
    })),
    artist.id,
  );

  const allTimeRank = rankArtistsByValue(
    ((allTimeRanks as Array<{ id: string; total_points: number }> | null) ?? []).map((row) => ({
      id: row.id,
      value: row.total_points,
    })),
    artist.id,
  );

  return {
    id: artist.id,
    slug: artist.slug,
    tagName: artist.tag_name,
    displayName: artist.display_name,
    bio: artist.bio,
    city: artist.city,
    country: artist.country,
    avatarUrl: artist.avatar_url,
    bannerUrl: artist.banner_url,
    instagramHandle: artist.instagram_handle,
    twitterHandle: artist.twitter_handle,
    websiteUrl: artist.website_url,
    isVerified: artist.is_verified,
    isClaimed: artist.is_claimed,
    totalPoints: artist.total_points,
    monthlyPoints: artist.monthly_points,
    avgRating: artist.all_time_avg_rating,
    artworkCount: artist.artwork_count,
    spotCount: artist.spot_count,
    monthlyRank,
    allTimeRank,
    gallery,
    topPieces,
    features: ((features as FeaturedRow[] | null) ?? []).map((feature) => ({
      id: feature.id,
      featureType: feature.feature_type,
      featureMonth: feature.feature_month,
      headline: feature.headline,
      excerpt: feature.article_excerpt,
    })),
  };
}
