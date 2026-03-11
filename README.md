# Concrete Culture: WallRank

WallRank is a web-first platform for discovering, mapping, rating, and archiving graffiti, murals, and street art.

This repository currently contains the implementation starter pack derived from the product handoff:

- product summary and MVP scope
- recommended Next.js app structure
- Supabase schema
- starter row-level security policies
- seed data scaffold
- API contract examples

## Stack

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Supabase Auth, Postgres, and Storage
- Google Maps JavaScript API

## Repo Layout

- `docs/architecture.md`: product and technical architecture summary
- `docs/folder-structure.md`: recommended Next.js folder layout
- `docs/api-contracts.md`: example request and response shapes
- `supabase/schema.sql`: database schema starter
- `supabase/rls.sql`: row-level security starter policies
- `supabase/seed.sql`: demo seed data starter

## Suggested Next Steps

1. Initialize a Next.js app in this folder.
2. Apply `supabase/schema.sql` to a Supabase project.
3. Review and tighten `supabase/rls.sql` against the final auth model.
4. Expand `supabase/seed.sql` with enough data for Hamilton, Toronto, and Niagara.
5. Build Sprint 1 pages and shared shell components.
