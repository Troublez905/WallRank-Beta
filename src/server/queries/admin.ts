import { createSupabaseServerClient } from "@/lib/supabase/server";

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

type PendingRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  locations:
    | {
        city: string | null;
      }
    | {
        city: string | null;
      }[]
    | null;
  artists:
    | {
        tag_name: string;
      }
    | {
        tag_name: string;
      }[]
    | null;
  users:
    | {
        username: string;
      }
    | {
        username: string;
      }[]
    | null;
};

export async function getPendingSpots(): Promise<PendingSpot[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
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

  const { data, error } = await supabase
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

  const rows = data as PendingRow[];

  return rows.map((row) => {
    const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;
    const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
    const user = Array.isArray(row.users) ? row.users[0] : row.users;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      isFeatured: row.is_featured,
      createdAt: row.created_at,
      city: location?.city ?? "Unknown",
      artistTag: artist?.tag_name ?? "Unknown artist",
      submittedBy: user?.username ?? "unknown",
    };
  });
}
