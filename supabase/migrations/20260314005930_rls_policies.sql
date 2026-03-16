alter table public.users enable row level security;
alter table public.artists enable row level security;
alter table public.locations enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_images enable row level security;
alter table public.ratings enable row level security;
alter table public.comments enable row level security;
alter table public.artist_point_events enable row level security;
alter table public.supporter_point_events enable row level security;
alter table public.shares enable row level security;
alter table public.monthly_leaderboards enable row level security;
alter table public.featured_artists enable row level security;
alter table public.reports enable row level security;
alter table public.artist_claim_requests enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select coalesce(
    (
      select u.role in ('admin', 'moderator')
      from public.users u
      where u.id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (
      select u.role = 'admin'
      from public.users u
      where u.id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.can_access_artwork(target_artwork_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.artworks a
    where a.id = target_artwork_id
      and (
        a.status in ('approved', 'active', 'historic', 'buffed', 'removed')
        or a.submitted_by_user_id = auth.uid()
        or public.is_staff()
      )
  );
$$;

create or replace function public.can_rate_artwork(target_artwork_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.artworks a
    where a.id = target_artwork_id
      and a.status in ('approved', 'active', 'historic', 'buffed', 'removed')
      and not exists (
        select 1
        from public.artists ar
        where ar.id = a.artist_id
          and ar.owner_user_id = auth.uid()
      )
  );
$$;

drop policy if exists "public can read approved artists" on public.artists;
drop policy if exists "users can update owned artist profile" on public.artists;
drop policy if exists "public can read safe locations" on public.locations;
drop policy if exists "authenticated users can insert locations" on public.locations;
drop policy if exists "public can read approved artworks" on public.artworks;
drop policy if exists "authenticated users can insert artworks" on public.artworks;
drop policy if exists "submitter and staff can update artworks" on public.artworks;
drop policy if exists "staff can update artworks" on public.artworks;
drop policy if exists "public can read approved artwork images" on public.artwork_images;
drop policy if exists "authenticated users can insert artwork images" on public.artwork_images;
drop policy if exists "public can read ratings for visible artworks" on public.ratings;
drop policy if exists "authenticated users can rate once on their own rows" on public.ratings;
drop policy if exists "users can update their own ratings" on public.ratings;
drop policy if exists "public can read visible comments" on public.comments;
drop policy if exists "authenticated users can insert comments" on public.comments;
drop policy if exists "comment owners and staff can update comments" on public.comments;
drop policy if exists "users can read own profile and staff can read all profiles" on public.users;
drop policy if exists "users can create own profile row" on public.users;
drop policy if exists "users can update own profile" on public.users;
drop policy if exists "staff can manage reports" on public.reports;
drop policy if exists "authenticated users can create reports" on public.reports;
drop policy if exists "users can create artist claim requests" on public.artist_claim_requests;
drop policy if exists "users can read own claim requests and staff can read all" on public.artist_claim_requests;
drop policy if exists "staff can manage artist claim requests" on public.artist_claim_requests;
drop policy if exists "public can read published featured artists" on public.featured_artists;
drop policy if exists "staff can manage featured artists" on public.featured_artists;
drop policy if exists "public can read monthly leaderboards" on public.monthly_leaderboards;
drop policy if exists "staff can manage monthly leaderboards" on public.monthly_leaderboards;
drop policy if exists "users can create shares" on public.shares;
drop policy if exists "users can read own shares and staff can read all" on public.shares;
drop policy if exists "staff can read artist point events" on public.artist_point_events;
drop policy if exists "staff can manage artist point events" on public.artist_point_events;
drop policy if exists "users can read own supporter point events and staff can read all" on public.supporter_point_events;
drop policy if exists "staff can manage supporter point events" on public.supporter_point_events;

create policy "public can read artists"
on public.artists
for select
using (true);

create policy "owners and staff can update artists"
on public.artists
for update
using (owner_user_id = auth.uid() or public.is_staff())
with check (owner_user_id = auth.uid() or public.is_staff());

create policy "public and submitters can read locations"
on public.locations
for select
using (
  location_visibility <> 'hidden_admin_only'
  or public.is_staff()
  or exists (
    select 1
    from public.artworks a
    where a.location_id = locations.id
      and a.submitted_by_user_id = auth.uid()
  )
);

create policy "authenticated users can insert locations"
on public.locations
for insert
to authenticated
with check (true);

create policy "public and submitters can read artworks"
on public.artworks
for select
using (public.can_access_artwork(id));

create policy "authenticated users can insert artworks"
on public.artworks
for insert
to authenticated
with check (
  submitted_by_user_id = auth.uid()
  and exists (
    select 1
    from public.locations l
    where l.id = location_id
  )
);

create policy "staff can update artworks"
on public.artworks
for update
using (public.is_staff())
with check (public.is_staff());

create policy "public, submitters, and staff can read artwork images"
on public.artwork_images
for select
using (
  (moderation_status = 'approved' and public.can_access_artwork(artwork_id))
  or uploaded_by_user_id = auth.uid()
  or public.is_staff()
);

create policy "authenticated users can insert artwork images"
on public.artwork_images
for insert
to authenticated
with check (
  uploaded_by_user_id = auth.uid()
  and exists (
    select 1
    from public.artworks a
    where a.id = artwork_id
      and (
        a.status in ('approved', 'active', 'historic', 'buffed', 'removed')
        or a.submitted_by_user_id = auth.uid()
        or public.is_staff()
      )
  )
);

create policy "public and owners can read ratings"
on public.ratings
for select
using (
  public.can_access_artwork(artwork_id)
  or user_id = auth.uid()
);

create policy "authenticated users can rate visible artworks"
on public.ratings
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.can_rate_artwork(artwork_id)
);

create policy "users and staff can update ratings"
on public.ratings
for update
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

create policy "public, owners, and staff can read comments"
on public.comments
for select
using (
  moderation_status = 'visible'
  or user_id = auth.uid()
  or public.is_staff()
);

create policy "authenticated users can insert comments on visible artworks"
on public.comments
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.artworks a
    where a.id = artwork_id
      and a.status in ('approved', 'active', 'historic', 'buffed', 'removed')
  )
);

create policy "comment owners and staff can update comments"
on public.comments
for update
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

create policy "users can read own profile and staff can read all"
on public.users
for select
using (id = auth.uid() or public.is_staff());

create policy "users can create own profile row"
on public.users
for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'user'
  and supporter_points = 0
  and is_banned = false
);

create policy "users can update own profile"
on public.users
for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "staff can manage reports"
on public.reports
for all
using (public.is_staff())
with check (public.is_staff());

create policy "authenticated users can create reports"
on public.reports
for insert
to authenticated
with check (reported_by_user_id = auth.uid());

create policy "users can create artist claim requests"
on public.artist_claim_requests
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can read own claim requests and staff can read all"
on public.artist_claim_requests
for select
using (user_id = auth.uid() or public.is_staff());

create policy "staff can manage artist claim requests"
on public.artist_claim_requests
for update
using (public.is_staff())
with check (public.is_staff());

create policy "public can read published featured artists"
on public.featured_artists
for select
using (is_published = true or public.is_staff());

create policy "staff can manage featured artists"
on public.featured_artists
for all
using (public.is_staff())
with check (public.is_staff());

create policy "public can read monthly leaderboards"
on public.monthly_leaderboards
for select
using (true);

create policy "staff can manage monthly leaderboards"
on public.monthly_leaderboards
for all
using (public.is_staff())
with check (public.is_staff());

create policy "users can create shares"
on public.shares
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can read own shares and staff can read all"
on public.shares
for select
using (user_id = auth.uid() or public.is_staff());

create policy "staff can read artist point events"
on public.artist_point_events
for select
using (public.is_staff());

create policy "staff can manage artist point events"
on public.artist_point_events
for all
using (public.is_staff())
with check (public.is_staff());

create policy "users can read own supporter point events and staff can read all"
on public.supporter_point_events
for select
using (user_id = auth.uid() or public.is_staff());

create policy "staff can manage supporter point events"
on public.supporter_point_events
for all
using (public.is_staff())
with check (public.is_staff());
