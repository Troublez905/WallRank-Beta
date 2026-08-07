import { mockArtistLeaderboard, mockSupporterLeaderboard } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeaderboardItem } from "@/types/domain";

type LeaderboardType = "artist" | "supporter";
type ArtistRow = {
  id: string;
  tag_name: string;
  slug: string | null;
  city: string | null;
  monthly_points: number;
  total_points: number;
  all_time_avg_rating: number;
};

type SupporterRow = {
  id: string;
  username: string;
  city: string | null;
  supporter_points: number;
};

export async function getLeaderboard(type: LeaderboardType): Promise<LeaderboardItem[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return type === "artist" ? mockArtistLeaderboard : mockSupporterLeaderboard;
  }

  if (type === "artist") {
    const { data, error } = await supabase
      .from("artists")
      .select("id, tag_name, slug, city, monthly_points, total_points, all_time_avg_rating")
      .order("monthly_points", { ascending: false })
      .limit(10);

    if (error || !data) {
      return mockArtistLeaderboard;
    }

    const artists = data as ArtistRow[];

    const liveArtists = artists.map((artist, index) => ({
      rank: index + 1,
      entityId: artist.id,
      name: artist.tag_name,
      slug: artist.slug,
      city: artist.city,
      monthlyPoints: artist.monthly_points,
      totalPoints: artist.total_points,
      avgRating: artist.all_time_avg_rating,
    }));

    const seen = new Set(liveArtists.map((artist) => artist.entityId));
    const fillers = mockArtistLeaderboard.filter((artist) => !seen.has(artist.entityId));
    return [...liveArtists, ...fillers].slice(0, 10).map((artist, index) => ({ ...artist, rank: index + 1 }));
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, username, city, supporter_points")
    .order("supporter_points", { ascending: false })
    .limit(10);

  if (error || !data) {
    return mockSupporterLeaderboard;
  }

  const users = data as SupporterRow[];

  return users.map((user, index) => ({
    rank: index + 1,
    entityId: user.id,
    name: user.username,
    slug: null,
    city: user.city,
    monthlyPoints: user.supporter_points,
    totalPoints: user.supporter_points,
    avgRating: null,
  }));
}
