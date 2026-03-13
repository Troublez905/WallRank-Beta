-- Run this manually in Supabase SQL editor after the staff user's
-- `public.users` row exists. This is intentionally outside the app flow.

-- Promote a user by email.
update public.users
set role = 'admin',
    updated_at = now()
where email = 'admin@example.com';

-- Optional moderator example.
-- update public.users
-- set role = 'moderator',
--     updated_at = now()
-- where email = 'moderator@example.com';
