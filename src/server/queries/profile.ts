import { mockSpots } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";
import type { SpotListItem } from "@/types/domain";

export type ViewerProfile = {
  email: string | null;
  username: string;
  displayName: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  instagramHandle: string | null;
  twitterHandle: string | null;
  websiteUrl: string | null;
  supporterPoints: number;
  role: "user" | "artist" | "admin" | "moderator";
  stats: {
    uploads: number;
    comments: number;
    ratings: number;
  };
  favorites: SpotListItem[];
};

type ProfileRow = {
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  website_url: string | null;
  supporter_points: number;
  role: "user" | "artist" | "admin" | "moderator";
};

export async function getViewerProfile(): Promise<ViewerProfile | null> {
  const auth = await getAuthContext();

  if (!auth.isConfigured) {
    return {
      email: "demo@wallrank.local",
      username: "wallscout",
      displayName: "Wall Scout",
      bio: "Documenting murals, burners, and buffed walls across southern Ontario.",
      city: "Hamilton",
      country: "Canada",
      instagramHandle: "wallscout",
      twitterHandle: null,
      websiteUrl: "https://concreteculture.local",
      supporterPoints: 148,
      role: "user",
      stats: {
        uploads: mockSpots.length,
        comments: 11,
        ratings: 42,
      },
      favorites: mockSpots.slice(0, 2),
    };
  }

  if (!auth.user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select(
      "email, username, display_name, bio, city, country, instagram_handle, twitter_handle, website_url, supporter_points, role",
    )
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!profile) {
    return {
      email: auth.user.email,
      username: auth.user.email?.split("@")[0] ?? "member",
      displayName: null,
      bio: null,
      city: null,
      country: null,
      instagramHandle: null,
      twitterHandle: null,
      websiteUrl: null,
      supporterPoints: 0,
      role: "user",
      stats: {
        uploads: 0,
        comments: 0,
        ratings: 0,
      },
      favorites: [],
    };
  }

  const typedProfile = profile as ProfileRow;

  const [{ count: uploads }, { count: comments }, { count: ratings }, { data: favoriteRows }] = await Promise.all([
    supabase
      .from("artworks")
      .select("*", { count: "exact", head: true })
      .eq("submitted_by_user_id", auth.user.id),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", auth.user.id),
    supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", auth.user.id),
    supabase.from("favorites").select(`artworks ( id, slug, title, category, status, avg_rating, ratings_count, is_featured, artists ( id, tag_name, slug ), locations ( name, city, latitude, longitude, location_visibility ), artwork_images ( image_url, thumbnail_url, is_primary, moderation_status ) )`).eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(12),
  ]);

  const favorites = ((favoriteRows ?? []) as Array<{ artworks: Record<string, unknown> | Record<string, unknown>[] | null }>).flatMap(({ artworks }) => {
    const artwork = Array.isArray(artworks) ? artworks[0] : artworks;
    if (!artwork) return [];
    const artistValue = artwork.artists as Record<string, unknown> | Record<string, unknown>[] | null;
    const locationValue = artwork.locations as Record<string, unknown> | Record<string, unknown>[] | null;
    const artist = Array.isArray(artistValue) ? artistValue[0] : artistValue;
    const location = Array.isArray(locationValue) ? locationValue[0] : locationValue;
    const images = (artwork.artwork_images ?? []) as Array<Record<string, unknown>>;
    const image = images.find((item) => item.is_primary && item.moderation_status === "approved") ?? images.find((item) => item.moderation_status === "approved");
    return [{ id: String(artwork.id), slug: String(artwork.slug), title: String(artwork.title), category: String(artwork.category), status: String(artwork.status), avgRating: Number(artwork.avg_rating), ratingsCount: Number(artwork.ratings_count), isFeatured: Boolean(artwork.is_featured), artist: { id: artist?.id ? String(artist.id) : null, tagName: artist?.tag_name ? String(artist.tag_name) : "Unknown artist", slug: artist?.slug ? String(artist.slug) : null }, location: { name: location?.name ? String(location.name) : "Unknown location", city: location?.city ? String(location.city) : "Unknown city", latitude: Number(location?.latitude ?? 0), longitude: Number(location?.longitude ?? 0), visibility: String(location?.location_visibility ?? "public_approximate") }, primaryImage: image ? { imageUrl: String(image.image_url), thumbnailUrl: image.thumbnail_url ? String(image.thumbnail_url) : null } : null } satisfies SpotListItem];
  });

  return {
    email: typedProfile.email,
    username: typedProfile.username,
    displayName: typedProfile.display_name,
    bio: typedProfile.bio,
    city: typedProfile.city,
    country: typedProfile.country,
    instagramHandle: typedProfile.instagram_handle,
    twitterHandle: typedProfile.twitter_handle,
    websiteUrl: typedProfile.website_url,
    supporterPoints: typedProfile.supporter_points,
    role: typedProfile.role,
    stats: {
      uploads: uploads ?? 0,
      comments: comments ?? 0,
      ratings: ratings ?? 0,
    },
    favorites,
  };
}
