create policy "authenticated users can insert artists"
on public.artists
for insert
to authenticated
with check (owner_user_id = auth.uid());
