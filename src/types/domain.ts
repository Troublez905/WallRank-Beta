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

export type SpotViewerState = {
  existingRating: number | null;
  commentCount: number;
  lastCommentAt: string | null;
};

export type SpotDetailItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  wallType: string | null;
  dateSeen: string | null;
  avgRating: number;
  ratingsCount: number;
  commentsCount: number;
  artistPointsTotal: number;
  isFeatured: boolean;
  styleTags: string[];
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
    addressText?: string | null;
  };
  images: Array<{
    imageUrl: string;
    thumbnailUrl: string | null;
    caption: string | null;
    timelineType: string;
    isPrimary: boolean;
  }>;
  ratingHistogram: Record<string, number>;
  comments: Array<{
    id: string;
    body: string;
    createdAt: string;
    helpfulCount: number;
    authorLabel: string;
  }>;
  viewer: SpotViewerState | null;
};

export type ArtistListItem = {
  id: string;
  slug: string;
  tagName: string;
  displayName: string | null;
  city: string | null;
  country: string | null;
  isVerified: boolean;
  isClaimed: boolean;
  totalPoints: number;
  monthlyPoints: number;
  avgRating: number;
  artworkCount: number;
  spotCount: number;
  topArtwork: {
    id: string;
    slug: string;
    title: string;
    city: string | null;
    avgRating: number;
    imageUrl: string | null;
    thumbnailUrl: string | null;
  } | null;
};

export type ArtistDetailItem = {
  id: string;
  slug: string;
  tagName: string;
  displayName: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  instagramHandle: string | null;
  twitterHandle: string | null;
  websiteUrl: string | null;
  isVerified: boolean;
  isClaimed: boolean;
  totalPoints: number;
  monthlyPoints: number;
  avgRating: number;
  artworkCount: number;
  spotCount: number;
  monthlyRank: number | null;
  allTimeRank: number | null;
  gallery: Array<{
    id: string;
    slug: string;
    title: string;
    city: string;
    avgRating: number;
    status: string;
    imageUrl: string | null;
    thumbnailUrl: string | null;
  }>;
  topPieces: Array<{
    id: string;
    slug: string;
    title: string;
    avgRating: number;
    ratingsCount: number;
    imageUrl: string | null;
  }>;
  features: Array<{
    id: string;
    featureType: string;
    featureMonth: string;
    headline: string | null;
    excerpt: string | null;
  }>;
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
