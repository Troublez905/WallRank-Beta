create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  city text,
  country text,
  instagram_handle text,
  twitter_handle text,
  website_url text,
  role text not null default 'user' check (role in ('user','artist','admin','moderator')),
  supporter_points integer not null default 0,
  is_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.users(id) on delete set null,
  tag_name text unique not null,
  display_name text,
  slug text unique not null,
  avatar_url text,
  banner_url text,
  bio text,
  city text,
  country text,
  instagram_handle text,
  twitter_handle text,
  website_url text,
  is_verified boolean not null default false,
  is_claimed boolean not null default false,
  total_points integer not null default 0,
  monthly_points integer not null default 0,
  all_time_avg_rating numeric(3,2) not null default 0,
  artwork_count integer not null default 0,
  spot_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text,
  address_text text,
  city text,
  province_state text,
  country text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  geohash text,
  location_visibility text not null default 'public_exact' check (location_visibility in ('public_exact','public_approximate','hidden_admin_only')),
  is_sensitive boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artists(id) on delete set null,
  location_id uuid not null references public.locations(id) on delete cascade,
  submitted_by_user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  slug text unique not null,
  description text,
  category text not null check (category in ('graffiti','mural','sticker','pasteup','throwup','piece','other')),
  style_tags text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected','active','historic','buffed','removed')),
  wall_type text,
  date_created_by_artist date,
  date_seen date,
  avg_rating numeric(3,2) not null default 0,
  ratings_count integer not null default 0,
  comments_count integer not null default 0,
  artist_points_total integer not null default 0,
  is_featured boolean not null default false,
  featured_month date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artwork_images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  uploaded_by_user_id uuid not null references public.users(id) on delete cascade,
  image_url text not null,
  thumbnail_url text,
  caption text,
  taken_at timestamptz,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  timeline_type text not null default 'standard' check (timeline_type in ('standard','before','after','update','historic')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  artist_id uuid references public.artists(id) on delete set null,
  user_id uuid not null references public.users(id) on delete cascade,
  stars integer not null check (stars between 1 and 5),
  artist_points_awarded integer not null,
  supporter_points_awarded integer not null default 1,
  is_verified_vote boolean not null default false,
  created_at timestamptz not null default now(),
  unique (artwork_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  body text not null,
  helpful_count integer not null default 0,
  moderation_status text not null default 'visible' check (moderation_status in ('visible','hidden','flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artist_point_events (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  artwork_id uuid references public.artworks(id) on delete cascade,
  source_type text not null check (source_type in ('rating','comment_bonus','share_bonus','feature_bonus','admin_adjustment')),
  source_id uuid,
  points integer not null,
  created_at timestamptz not null default now()
);

create table public.supporter_point_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_type text not null check (source_type in ('rating','comment','upload_approved','share','invite','admin_adjustment')),
  source_id uuid,
  points integer not null,
  created_at timestamptz not null default now()
);

create table public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  artwork_id uuid references public.artworks(id) on delete cascade,
  artist_id uuid references public.artists(id) on delete cascade,
  platform text not null check (platform in ('instagram','twitter','facebook','tiktok','copy_link')),
  share_url text,
  reward_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.monthly_leaderboards (
  id uuid primary key default gen_random_uuid(),
  leaderboard_month date not null,
  leaderboard_type text not null check (leaderboard_type in ('artist','supporter')),
  entity_id uuid not null,
  rank_position integer not null,
  points_total integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.featured_artists (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  feature_type text not null check (feature_type in ('homepage_top5','magazine','instore','seasonal')),
  feature_month date not null,
  headline text,
  article_excerpt text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reported_by_user_id uuid not null references public.users(id) on delete cascade,
  target_type text not null check (target_type in ('artwork','image','comment','artist','user')),
  target_id uuid not null,
  reason text not null,
  notes text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.artist_claim_requests (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index idx_artworks_artist_id on public.artworks(artist_id);
create index idx_artworks_location_id on public.artworks(location_id);
create index idx_artworks_status on public.artworks(status);
create index idx_ratings_artwork_id on public.ratings(artwork_id);
create index idx_comments_artwork_id on public.comments(artwork_id);
create index idx_locations_city on public.locations(city);
