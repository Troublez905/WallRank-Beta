create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, artwork_id)
);

create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_artwork_id on public.favorites(artwork_id);

alter table public.favorites enable row level security;

grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update on public.ratings to authenticated;
grant select, insert, update on public.comments to authenticated;

create policy "users can read own favorites"
on public.favorites for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users can save visible artworks"
on public.favorites for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and public.can_access_artwork(artwork_id)
);

create policy "users can remove own favorites"
on public.favorites for delete
to authenticated
using ((select auth.uid()) = user_id);

create schema if not exists private;

create or replace function private.refresh_artwork_rating_totals()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_artwork_id uuid := coalesce(new.artwork_id, old.artwork_id);
begin
  update public.artworks
  set avg_rating = coalesce((select round(avg(stars)::numeric, 2) from public.ratings where artwork_id = target_artwork_id), 0),
      ratings_count = (select count(*) from public.ratings where artwork_id = target_artwork_id),
      updated_at = now()
  where id = target_artwork_id;
  return coalesce(new, old);
end;
$$;

create or replace function private.refresh_artwork_comment_totals()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_artwork_id uuid := coalesce(new.artwork_id, old.artwork_id);
begin
  update public.artworks
  set comments_count = (
        select count(*) from public.comments
        where artwork_id = target_artwork_id and moderation_status = 'visible'
      ),
      updated_at = now()
  where id = target_artwork_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists ratings_refresh_artwork_totals on public.ratings;
create trigger ratings_refresh_artwork_totals
after insert or update or delete on public.ratings
for each row execute function private.refresh_artwork_rating_totals();

drop trigger if exists comments_refresh_artwork_totals on public.comments;
create trigger comments_refresh_artwork_totals
after insert or update or delete on public.comments
for each row execute function private.refresh_artwork_comment_totals();

revoke all on function private.refresh_artwork_rating_totals() from public, anon, authenticated;
revoke all on function private.refresh_artwork_comment_totals() from public, anon, authenticated;
