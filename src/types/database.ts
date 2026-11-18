export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          all_time_avg_rating: number;
          artwork_count: number;
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          instagram_handle: string | null;
          is_claimed: boolean;
          is_verified: boolean;
          monthly_points: number;
          owner_user_id: string | null;
          slug: string;
          spot_count: number;
          tag_name: string;
          total_points: number;
          twitter_handle: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["artists"]["Row"]> & {
          tag_name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["artists"]["Row"]>;
      };
      artwork_images: {
        Row: {
          artwork_id: string;
          caption: string | null;
          created_at: string;
          id: string;
          image_url: string;
          is_primary: boolean;
          moderation_status: "pending" | "approved" | "rejected";
          sort_order: number;
          taken_at: string | null;
          thumbnail_url: string | null;
          timeline_type: "standard" | "before" | "after" | "update" | "historic";
          uploaded_by_user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["artwork_images"]["Row"]> & {
          artwork_id: string;
          image_url: string;
          uploaded_by_user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["artwork_images"]["Row"]>;
      };
      artworks: {
        Row: {
          artist_id: string | null;
          artist_points_total: number;
          avg_rating: number;
          category: "graffiti" | "mural" | "sticker" | "pasteup" | "throwup" | "piece" | "other";
          comments_count: number;
          created_at: string;
          date_created_by_artist: string | null;
          date_seen: string | null;
          description: string | null;
          featured_month: string | null;
          id: string;
          is_featured: boolean;
          location_id: string;
          ratings_count: number;
          slug: string;
          status: "pending" | "approved" | "rejected" | "active" | "historic" | "buffed" | "removed";
          style_tags: string[] | null;
          submitted_by_user_id: string;
          title: string;
          updated_at: string;
          wall_type: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["artworks"]["Row"]> & {
          category: Database["public"]["Tables"]["artworks"]["Row"]["category"];
          location_id: string;
          slug: string;
          submitted_by_user_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["artworks"]["Row"]>;
      };
      comments: {
        Row: {
          artwork_id: string;
          body: string;
          created_at: string;
          helpful_count: number;
          id: string;
          moderation_status: "visible" | "hidden" | "flagged";
          parent_comment_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["comments"]["Row"]> & {
          artwork_id: string;
          body: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
      };
      favorites: {
        Row: {
          artwork_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          artwork_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
      };
      locations: {
        Row: {
          address_text: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          geohash: string | null;
          id: string;
          is_sensitive: boolean;
          latitude: number;
          location_visibility: "public_exact" | "public_approximate" | "hidden_admin_only";
          longitude: number;
          name: string | null;
          province_state: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["locations"]["Row"]> & {
          latitude: number;
          longitude: number;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Row"]>;
      };
      monthly_leaderboards: {
        Row: {
          created_at: string;
          entity_id: string;
          id: string;
          leaderboard_month: string;
          leaderboard_type: "artist" | "supporter";
          metadata: Json;
          points_total: number;
          rank_position: number;
        };
        Insert: Partial<Database["public"]["Tables"]["monthly_leaderboards"]["Row"]> & {
          entity_id: string;
          leaderboard_month: string;
          leaderboard_type: "artist" | "supporter";
          points_total: number;
          rank_position: number;
        };
        Update: Partial<Database["public"]["Tables"]["monthly_leaderboards"]["Row"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string;
          status: "active" | "unsubscribed";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          status?: "active" | "unsubscribed";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Row"]>;
      };
      ratings: {
        Row: {
          artist_id: string | null;
          artist_points_awarded: number;
          artwork_id: string;
          created_at: string;
          id: string;
          is_verified_vote: boolean;
          stars: number;
          supporter_points_awarded: number;
          user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ratings"]["Row"]> & {
          artist_points_awarded: number;
          artwork_id: string;
          stars: number;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["ratings"]["Row"]>;
      };
      users: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          display_name: string | null;
          email: string;
          id: string;
          instagram_handle: string | null;
          is_banned: boolean;
          role: "user" | "artist" | "admin" | "moderator";
          supporter_points: number;
          twitter_handle: string | null;
          updated_at: string;
          username: string;
          website_url: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          email: string;
          username: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
    };
  };
};
