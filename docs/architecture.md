# WallRank Architecture

## Product Shape

WallRank supports four primary personas:

- guests who browse the map, artists, spots, and leaderboards
- registered users who rate, comment, upload, and earn supporter points
- artists who claim profiles and manage identity and stats
- admins and moderators who approve content and manage features

## MVP Routes

### Public

- `/`
- `/map`
- `/artists`
- `/artists/[slug]`
- `/spots/[slug]`
- `/leaderboard`
- `/magazine`

### Authenticated

- `/upload`
- `/profile`
- `/settings`

### Admin

- `/admin`
- `/admin/spots`
- `/admin/artists`
- `/admin/reports`
- `/admin/features`
- `/admin/users`

## Technical Stack

### Frontend

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- React Server Components for read-heavy pages
- Route handlers or server actions for mutations

### Backend

- Supabase Auth for identity
- Supabase Postgres for relational data
- Supabase Storage for uploaded images

### Maps and Geocoding

- Google Maps JavaScript API
- Geocoding API for address search and pin placement

## Core Domain Rules

### Ratings

- one vote per user per artwork
- no self-rating when the authenticated user owns the artist profile tied to the artwork
- each rating creates artist and supporter point events
- artwork aggregates must be recalculated on insert, update, and delete

### Comments

- only visible comments appear on public pages
- supporter points should be granted only once per qualifying artwork comment action

### Uploads

- new uploads are pending by default
- public pages only display approved content
- sensitive locations may expose approximate coordinates only

### Leaderboards

- monthly ranking is event-driven for the current month
- all-time ranking can use cached totals plus periodic reconciliation
- top 5 snapshots should be persisted monthly

## Delivery Sequence

1. Initialize app shell, auth, schema, and landing page skeleton.
2. Build map page, spot list API, spot detail API, and artist profile API.
3. Build upload flow, storage integration, and admin moderation queue.
4. Add ratings, comments, leaderboards, and homepage top 5.
5. Finish polish, responsiveness, SEO, analytics, and seed import.
