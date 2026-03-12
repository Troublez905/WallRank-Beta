import { mockSpots } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";

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
    };
  }

  const typedProfile = profile as ProfileRow;

  const [{ count: uploads }, { count: comments }, { count: ratings }] = await Promise.all([
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
  ]);

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
  };
}
