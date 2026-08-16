export type SpotListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  avgRating: number;
  ratingsCount: number;
  isFeatured: boolean;
  artist: {
    id: string | null;
    tagName: string;
    slug: string | null;
  };
  location: {
    name: string;
    city: string;
    latitude: number;
    longitude: number;
    visibility: string;
  };
  primaryImage: {
    imageUrl: string;
    thumbnailUrl: string | null;
  } | null;
};

export type LeaderboardItem = {
  rank: number;
  entityId: string;
  name: string;
  slug: string | null;
  city: string | null;
  monthlyPoints: number;
  totalPoints: number;
  avgRating: number | null;
};

export type SpotDetail = SpotListItem & {
  description: string | null;
  styleTags: string[];
  wallType: string | null;
  dateSeen: string | null;
  commentsCount: number;
  images: Array<{ imageUrl: string; thumbnailUrl: string | null; caption: string | null }>;
  ratingsBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  comments: Array<{ id: string; body: string; createdAt: string; userId: string }>;
  viewerRating: number | null;
  isFavorite: boolean;
};
