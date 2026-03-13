insert into storage.buckets (id, name, public)
values ('artwork-images', 'artwork-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "public can read artwork images bucket" on storage.objects;
drop policy if exists "authenticated users can upload artwork images bucket" on storage.objects;
drop policy if exists "owners can update artwork images bucket" on storage.objects;
drop policy if exists "owners and staff can delete artwork images bucket" on storage.objects;

create policy "public can read artwork images bucket"
on storage.objects
for select
using (bucket_id = 'artwork-images');

create policy "authenticated users can upload artwork images bucket"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'artwork-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owners can update artwork images bucket"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'artwork-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'artwork-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owners and staff can delete artwork images bucket"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'artwork-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role in ('admin', 'moderator')
    )
  )
);
