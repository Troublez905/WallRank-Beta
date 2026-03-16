import { resolveStoredImageUrl } from "@/lib/supabase/image-urls";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type PendingSpot = {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  city: string;
  artistTag: string;
  submittedBy: string;
};

export type PendingImage = {
  id: string;
  artworkId: string;
  artworkSlug: string;
  artworkTitle: string;
  uploadedBy: string;
  timelineType: string;
  caption: string | null;
  createdAt: string;
  previewUrl: string | null;
};

export type ArtistClaimRequestItem = {
  id: string;
  artistId: string;
  artistTag: string;
  artistSlug: string;
  userId: string;
  requestedBy: string;
  message: string | null;
  createdAt: string;
  status: string;
};

export type ReportItem = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  notes: string | null;
  status: string;
  createdAt: string;
  reportedBy: string;
};

export type FeatureCandidate = {
  artistId: string;
  artistTag: string;
  artistSlug: string;
  city: string | null;
  monthlyPoints: number;
  totalPoints: number;
  featureId: string | null;
  featureType: string;
  headline: string;
  excerpt: string;
  isPublished: boolean;
};

export type AdminUserItem = {
  id: string;
  username: string;
  email: string;
  city: string | null;
  role: "user" | "artist" | "admin" | "moderator";
  supporterPoints: number;
  isBanned: boolean;
};

export type AdminOverview = {
  pendingSpots: number;
  pendingImages: number;
  pendingClaims: number;
  openReports: number;
  publishedFeatures: number;
  mostActiveCity: string;
};

type MaybeRelation<T> = T | T[] | null;

type PendingSpotRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  locations: MaybeRelation<{ city: string | null }>;
  artists: MaybeRelation<{ tag_name: string }>;
  users: MaybeRelation<{ username: string }>;
};

type PendingImageRow = {
  id: string;
  caption: string | null;
  created_at: string;
  image_url: string;
  timeline_type: string;
  artworks: MaybeRelation<{ id: string; slug: string; title: string }>;
  users: MaybeRelation<{ username: string }>;
};

type ClaimRow = {
  id: string;
  artist_id: string;
  user_id: string;
  message: string | null;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  artists: MaybeRelation<{ slug: string; tag_name: string }>;
  users: MaybeRelation<{ username: string }>;
};

type ReportRow = {
  id: string;
  target_type: "artwork" | "image" | "comment" | "artist" | "user";
  target_id: string;
  reason: string;
  notes: string | null;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  created_at: string;
  users: MaybeRelation<{ username: string }>;
};

type ArtistCandidateRow = {
  id: string;
  slug: string;
  tag_name: string;
  city: string | null;
  monthly_points: number;
  total_points: number;
};

type FeatureRow = {
  id: string;
  artist_id: string;
  feature_type: "homepage_top5" | "magazine" | "instore" | "seasonal";
  headline: string | null;
  article_excerpt: string | null;
  is_published: boolean;
};

type AdminUserRow = {
  id: string;
  username: string;
  email: string;
  city: string | null;
  role: "user" | "artist" | "admin" | "moderator";
  supporter_points: number;
  is_banned: boolean;
};

type CityActivityRow = {
  locations: MaybeRelation<{ city: string | null }>;
};

function pickRelation<T>(value: MaybeRelation<T>) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

async function getReadClients() {
  const serverClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  return {
    serverClient,
    readClient: adminClient ?? serverClient,
  };
}

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export async function getPendingSpots(): Promise<PendingSpot[]> {
  const { readClient } = await getReadClients();

  if (!readClient) {
    return [
      {
        id: "demo-pending-1",
        title: "Ottawa Street Burner",
        slug: "ottawa-street-burner",
        status: "pending",
        isFeatured: false,
        createdAt: new Date().toISOString(),
        city: "Hamilton",
        artistTag: "AERO",
        submittedBy: "wallscout",
      },
      {
        id: "demo-pending-2",
        title: "Underpass Character",
        slug: "underpass-character",
        status: "pending",
        isFeatured: false,
        createdAt: new Date().toISOString(),
        city: "Toronto",
        artistTag: "Unknown artist",
        submittedBy: "mayaspray",
      },
    ];
  }

  const { data, error } = await readClient
    .from("artworks")
    .select(
      `
        id,
        title,
        slug,
        status,
        is_featured,
        created_at,
        locations ( city ),
        artists ( tag_name ),
        users ( username )
      `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error || !data) {
    return [];
  }

  return (data as PendingSpotRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    city: pickRelation(row.locations)?.city ?? "Unknown",
    artistTag: pickRelation(row.artists)?.tag_name ?? "Unknown artist",
    submittedBy: pickRelation(row.users)?.username ?? "unknown",
  }));
}

export async function getPendingImages(): Promise<PendingImage[]> {
  const { readClient, serverClient } = await getReadClients();

  if (!readClient || !serverClient) {
    return [
      {
        id: "demo-image-1",
        artworkId: "demo-pending-1",
        artworkSlug: "ottawa-street-burner",
        artworkTitle: "Ottawa Street Burner",
        uploadedBy: "wallscout",
        timelineType: "update",
        caption: "Fresh update from the weekend.",
        createdAt: new Date().toISOString(),
        previewUrl: null,
      },
    ];
  }

  const { data, error } = await readClient
    .from("artwork_images")
    .select(
      `
        id,
        caption,
        created_at,
        image_url,
        timeline_type,
        artworks ( id, slug, title ),
        users ( username )
      `,
    )
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data) {
    return [];
  }

  return Promise.all(
    (data as PendingImageRow[]).map(async (row) => ({
      id: row.id,
      artworkId: pickRelation(row.artworks)?.id ?? "",
      artworkSlug: pickRelation(row.artworks)?.slug ?? "",
      artworkTitle: pickRelation(row.artworks)?.title ?? "Unknown artwork",
      uploadedBy: pickRelation(row.users)?.username ?? "unknown",
      timelineType: row.timeline_type,
      caption: row.caption,
      createdAt: row.created_at,
      previewUrl: await resolveStoredImageUrl(serverClient, row.image_url),
    })),
  );
}

export async function getArtistClaimRequests(): Promise<ArtistClaimRequestItem[]> {
  const { readClient } = await getReadClients();

  if (!readClient) {
    return [
      {
        id: "demo-claim-1",
        artistId: "artist-demo-1",
        artistTag: "AERO",
        artistSlug: "aero",
        userId: "user-demo-1",
        requestedBy: "wallscout",
        message: "I can verify ownership through linked socials.",
        createdAt: new Date().toISOString(),
        status: "pending",
      },
    ];
  }

  const { data, error } = await readClient
    .from("artist_claim_requests")
    .select(
      `
        id,
        artist_id,
        user_id,
        message,
        created_at,
        status,
        artists ( slug, tag_name ),
        users ( username )
      `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error || !data) {
    return [];
  }

  return (data as ClaimRow[]).map((row) => ({
    id: row.id,
    artistId: row.artist_id,
    artistTag: pickRelation(row.artists)?.tag_name ?? "Unknown artist",
    artistSlug: pickRelation(row.artists)?.slug ?? "",
    userId: row.user_id,
    requestedBy: pickRelation(row.users)?.username ?? "unknown",
    message: row.message,
    createdAt: row.created_at,
    status: row.status,
  }));
}

export async function getModerationReports(): Promise<ReportItem[]> {
  const { readClient } = await getReadClients();

  if (!readClient) {
    return [
      {
        id: "demo-report-1",
        targetType: "artwork",
        targetId: "demo-pending-1",
        reason: "Duplicate upload",
        notes: "Looks like the same wall was submitted twice.",
        status: "open",
        createdAt: new Date().toISOString(),
        reportedBy: "mayaspray",
      },
    ];
  }

  const { data, error } = await readClient
    .from("reports")
    .select(
      `
        id,
        target_type,
        target_id,
        reason,
        notes,
        status,
        created_at,
        users ( username )
      `,
    )
    .in("status", ["open", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return (data as ReportRow[]).map((row) => ({
    id: row.id,
    targetType: row.target_type,
    targetId: row.target_id,
    reason: row.reason,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    reportedBy: pickRelation(row.users)?.username ?? "unknown",
  }));
}

export async function getFeatureCandidates(): Promise<FeatureCandidate[]> {
  const { readClient } = await getReadClients();
  const currentMonth = `${getCurrentMonthKey()}-01`;

  if (!readClient) {
    return [
      {
        artistId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        artistTag: "AERO",
        artistSlug: "aero",
        city: "Hamilton",
        monthlyPoints: 28,
        totalPoints: 931,
        featureId: null,
        featureType: "homepage_top5",
        headline: "Hamilton color control",
        excerpt: "Aero leads the month with strong community ratings and a standout warehouse burner.",
        isPublished: false,
      },
    ];
  }

  const [{ data: artists }, { data: features }] = await Promise.all([
    readClient
      .from("artists")
      .select("id, slug, tag_name, city, monthly_points, total_points")
      .order("monthly_points", { ascending: false })
      .limit(5),
    readClient
      .from("featured_artists")
      .select("id, artist_id, feature_type, headline, article_excerpt, is_published")
      .eq("feature_month", currentMonth),
  ]);

  const featureByArtist = new Map<string, FeatureRow>();
  ((features as FeatureRow[] | null) ?? []).forEach((feature) => {
    featureByArtist.set(feature.artist_id, feature);
  });

  return ((artists as ArtistCandidateRow[] | null) ?? []).map((artist) => {
    const existingFeature = featureByArtist.get(artist.id);

    return {
      artistId: artist.id,
      artistTag: artist.tag_name,
      artistSlug: artist.slug,
      city: artist.city,
      monthlyPoints: artist.monthly_points,
      totalPoints: artist.total_points,
      featureId: existingFeature?.id ?? null,
      featureType: existingFeature?.feature_type ?? "homepage_top5",
      headline: existingFeature?.headline ?? `${artist.tag_name} is climbing this month`,
      excerpt:
        existingFeature?.article_excerpt ??
        `${artist.tag_name} is trending in ${artist.city ?? "the city feed"} with strong monthly community support.`,
      isPublished: existingFeature?.is_published ?? false,
    };
  });
}

export async function getAdminUsers(): Promise<AdminUserItem[]> {
  const { readClient } = await getReadClients();

  if (!readClient) {
    return [
      {
        id: "user-demo-1",
        username: "wallscout",
        email: "wallscout@example.com",
        city: "Hamilton",
        role: "user",
        supporterPoints: 92,
        isBanned: false,
      },
    ];
  }

  const { data, error } = await readClient
    .from("users")
    .select("id, username, email, city, role, supporter_points, is_banned")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return (data as AdminUserRow[]).map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    city: row.city,
    role: row.role,
    supporterPoints: row.supporter_points,
    isBanned: row.is_banned,
  }));
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const { readClient } = await getReadClients();

  if (!readClient) {
    return {
      pendingSpots: 2,
      pendingImages: 1,
      pendingClaims: 1,
      openReports: 1,
      publishedFeatures: 0,
      mostActiveCity: "Hamilton",
    };
  }

  const currentMonth = `${getCurrentMonthKey()}-01`;
  const [
    pendingSpotsResult,
    pendingImagesResult,
    pendingClaimsResult,
    reportsResult,
    featuresResult,
    cityRowsResult,
  ] = await Promise.all([
    readClient.from("artworks").select("*", { count: "exact", head: true }).eq("status", "pending"),
    readClient.from("artwork_images").select("*", { count: "exact", head: true }).eq("moderation_status", "pending"),
    readClient.from("artist_claim_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    readClient.from("reports").select("*", { count: "exact", head: true }).in("status", ["open", "reviewing"]),
    readClient
      .from("featured_artists")
      .select("*", { count: "exact", head: true })
      .eq("feature_month", currentMonth)
      .eq("is_published", true),
    readClient.from("artworks").select("locations ( city )").limit(200),
  ]);

  const cityCounts = new Map<string, number>();
  ((cityRowsResult.data as CityActivityRow[] | null) ?? []).forEach((row) => {
    const city = pickRelation(row.locations)?.city;

    if (!city) {
      return;
    }

    cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
  });

  const mostActiveCity =
    [...cityCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";

  return {
    pendingSpots: pendingSpotsResult.count ?? 0,
    pendingImages: pendingImagesResult.count ?? 0,
    pendingClaims: pendingClaimsResult.count ?? 0,
    openReports: reportsResult.count ?? 0,
    publishedFeatures: featuresResult.count ?? 0,
    mostActiveCity,
  };
}
