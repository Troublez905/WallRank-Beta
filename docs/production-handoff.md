# WallRank Production Handoff

This document captures the current live deployment state for WallRank Beta and the minimum information needed to operate it safely.

## Live Services

- Production app: `https://wallrank-beta.vercel.app`
- Vercel project: `djcurv905s-projects/wallrank-beta`
- Supabase project URL: `https://iroixrcarjciynjvoqdy.supabase.co`

## Current Deployment State

- The app is deployed on Vercel with the Next.js auto-detected preset.
- The production environment is connected to Supabase.
- Preview environment variables were added through the Vercel project API because the Vercel CLI preview flow was failing with a branch-selection bug in non-interactive mode.
- The app is no longer in demo mode for live data reads.

## Vercel Configuration

- Framework preset: `Next.js`
- Root directory: `.`
- Install command: default Vercel Node install
- Build command: `npm run build`
- Output directory: Next.js default output

## Environment Variables

Configured in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional but not currently required:

- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
  The app defaults to `artwork-images` if this is unset.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  The current map page is still a styled placeholder and does not require this yet.

## Supabase Setup Applied

These SQL files were intended to be run in this order:

1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/rls.sql`
4. `supabase/seed.sql`

Optional admin promotion:

5. `supabase/admin-bootstrap.sql`

## Verified Live Checks

Verified after wiring Supabase and applying the SQL setup:

- `/api/spots` returns seeded live data
- `/api/leaderboard` returns seeded live data
- `/map` loads
- `/leaderboard` loads
- `/artists` loads
- `/profile` redirects to sign-in when logged out
- `/upload` redirects to sign-in when logged out
- `/admin` redirects to sign-in when logged out, and should allow access for promoted admin users

## Storage and Image Flow

What is confirmed:

- The `artwork-images` bucket setup exists in `supabase/storage.sql`
- Bucket policies are aligned with the app's upload path pattern: authenticated users upload under `<auth.uid()>/...`
- The app upload action uses `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` with a fallback to `artwork-images`

What remains to verify manually:

- Sign in with a real account
- Go to `/upload`
- Submit a test artwork with an image
- Confirm the file appears in the `artwork-images` bucket in Supabase Storage
- Confirm the created artwork and image record appear in the database

Note:

- A live authenticated smoke test from the terminal was attempted, but Supabase blocked temporary-user creation with `email rate limit exceeded`. That prevented a terminal-only upload verification in this session.

## Recommended Smoke Checklist

Run these after any deploy or env change:

- Open `/`
- Open `/map`
- Open `/leaderboard`
- Open `/artists`
- Check `/api/spots`
- Check `/api/leaderboard`
- Sign in and open `/profile`
- Sign in and open `/settings`
- Sign in and test `/upload`
- If using an admin account, open `/admin`

## Operational Notes

- `NEXT_PUBLIC_*` values are intentionally public to the client and are expected to be visible in browser-delivered app code.
- Do not place the Supabase service role key in Vercel unless a server-only feature explicitly needs it.
- If preview deployments stop reading live data, re-check the preview env vars in the Vercel project.
- If auth works but APIs return empty lists, verify the SQL schema, RLS, and seed data were applied to the correct Supabase project.
