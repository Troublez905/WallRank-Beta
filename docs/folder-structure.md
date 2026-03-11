# Recommended Next.js Folder Structure

```text
src/
  app/
    (public)/
      page.tsx
      map/page.tsx
      artists/page.tsx
      artists/[slug]/page.tsx
      spots/[slug]/page.tsx
      leaderboard/page.tsx
      magazine/page.tsx
    (auth)/
      sign-in/page.tsx
      sign-up/page.tsx
    (protected)/
      upload/page.tsx
      profile/page.tsx
      settings/page.tsx
    admin/
      page.tsx
      spots/page.tsx
      artists/page.tsx
      reports/page.tsx
      features/page.tsx
      users/page.tsx
    api/
      auth/
      spots/
      artists/
      leaderboard/
      admin/
      report/
      share/
    layout.tsx
    globals.css
  components/
    app-shell/
    map/
    spots/
    artists/
    leaderboard/
    upload/
    comments/
    ratings/
    admin/
    ui/
  lib/
    supabase/
    maps/
    auth/
    db/
    validations/
    utils/
  server/
    queries/
    mutations/
    services/
  types/
    api.ts
    database.ts
    domain.ts
  config/
    site.ts
    navigation.ts
```

## Notes

- Use route groups to separate public, authenticated, and admin experiences.
- Keep server-side data access in `server/` so UI code stays thin.
- Keep Supabase client helpers isolated in `lib/supabase/`.
- Generate database types once the schema is live and place them in `src/types/database.ts`.
