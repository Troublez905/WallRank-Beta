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
    (select role in ('admin', 'moderator') from public.users where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (select role = 'admin' from public.users where id = auth.uid()),
    false
  );
$$;

create policy "public can read approved artists"
on public.artists
for select
using (true);

create policy "users can update owned artist profile"
on public.artists
for update
using (owner_user_id = auth.uid() or public.is_staff())
with check (owner_user_id = auth.uid() or public.is_staff());

create policy "public can read safe locations"
on public.locations
for select
using (location_visibility <> 'hidden_admin_only' or public.is_staff());

create policy "public can read approved artworks"
on public.artworks
for select
using (status in ('approved', 'active', 'historic', 'buffed', 'removed') or public.is_staff());

create policy "authenticated users can insert artworks"
on public.artworks
for insert
to authenticated
with check (submitted_by_user_id = auth.uid());

create policy "submitter and staff can update artworks"
on public.artworks
for update
using (submitted_by_user_id = auth.uid() or public.is_staff())
with check (submitted_by_user_id = auth.uid() or public.is_staff());

create policy "public can read approved artwork images"
on public.artwork_images
for select
using (
  moderation_status = 'approved'
  or public.is_staff()
);

create policy "authenticated users can insert artwork images"
on public.artwork_images
for insert
to authenticated
with check (uploaded_by_user_id = auth.uid());

create policy "public can read ratings for visible artworks"
on public.ratings
for select
using (
  exists (
    select 1
    from public.artworks a
    where a.id = artwork_id
      and (a.status in ('approved', 'active', 'historic', 'buffed', 'removed') or public.is_staff())
  )
);

create policy "authenticated users can rate once on their own rows"
on public.ratings
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update their own ratings"
on public.ratings
for update
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

create policy "public can read visible comments"
on public.comments
for select
using (
  moderation_status = 'visible'
  or public.is_staff()
);

create policy "authenticated users can insert comments"
on public.comments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "comment owners and staff can update comments"
on public.comments
for update
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

create policy "users can read own profile and staff can read all profiles"
on public.users
for select
using (id = auth.uid() or public.is_staff());

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
for insert
to authenticated
with check (public.is_staff());

create policy "users can read own supporter point events and staff can read all"
on public.supporter_point_events
for select
using (user_id = auth.uid() or public.is_staff());

create policy "staff can manage supporter point events"
on public.supporter_point_events
for insert
to authenticated
with check (public.is_staff());
