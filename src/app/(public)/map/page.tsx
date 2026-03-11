import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { cities } from "@/lib/site-data";
import { getSpots } from "@/server/queries/spots";

type MapPageProps = {
  searchParams: Promise<{
    city?: string;
    category?: string;
    minRating?: string;
    featuredOnly?: string;
  }>;
};

const categories = ["all", "piece", "mural", "graffiti", "throwup", "sticker", "pasteup", "other"];

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const city = params.city ?? "All cities";
  const category = params.category ?? "all";
  const minRating = params.minRating ? Number(params.minRating) : undefined;
  const featuredOnly = params.featuredOnly === "true";

  const spots = await getSpots({
    city,
    category,
    minRating,
    featuredOnly,
  });

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Explore map"
        title="Filter the city. Follow the paint."
        description="This page is now wired to the shared spots query. Add Supabase env vars and it will read from your database; until then it serves the seeded demo dataset."
      />

      <section className="section-shell grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="panel rounded-[32px] p-6">
          <div className="eyebrow">Filters</div>
          <h2 className="display mt-2 text-4xl">Search the wall</h2>
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">City</div>
              <div className="flex flex-wrap gap-2">
                {["All cities", ...cities].map((option) => (
                  <Link
                    key={option}
                    href={option === "All cities" ? "/map" : `/map?city=${encodeURIComponent(option)}`}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      city === option ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"
                    }`}
                  >
                    {option}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Category</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((option) => (
                  <Link
                    key={option}
                    href={`/map?category=${encodeURIComponent(option)}${city !== "All cities" ? `&city=${encodeURIComponent(city)}` : ""}`}
                    className={`rounded-full px-3 py-2 text-sm capitalize transition ${
                      category === option ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"
                    }`}
                  >
                    {option}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/map?minRating=4${city !== "All cities" ? `&city=${encodeURIComponent(city)}` : ""}`}
                className={`rounded-[22px] border px-4 py-4 text-sm ${minRating === 4 ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted"}`}
              >
                4.0+ rating
              </Link>
              <Link
                href={`/map?featuredOnly=true${city !== "All cities" ? `&city=${encodeURIComponent(city)}` : ""}`}
                className={`rounded-[22px] border px-4 py-4 text-sm ${featuredOnly ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted"}`}
              >
                Featured only
              </Link>
            </div>

            <div className="rounded-[24px] border border-dashed border-line p-4 text-sm leading-6 text-muted">
              The right-hand canvas is currently a styled preview panel. Once Google Maps is added, this left rail can drive clustered pins and mini spot previews without changing the data contract.
            </div>
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="eyebrow">Map canvas</div>
                <h2 className="display mt-2 text-4xl">Pinned activity</h2>
              </div>
              <div className="rounded-full bg-accent-soft px-4 py-2 text-sm text-sand">{spots.length} visible spots</div>
            </div>
            <div className="mt-6 h-[320px] rounded-[28px] border border-line bg-[radial-gradient(circle_at_25%_25%,rgba(255,106,0,0.26),transparent_14%),radial-gradient(circle_at_64%_50%,rgba(212,179,139,0.22),transparent_14%),radial-gradient(circle_at_80%_30%,rgba(255,106,0,0.18),transparent_10%),linear-gradient(180deg,#17191a_0%,#101112_100%)] p-6">
              <div className="grid h-full grid-cols-5 gap-4">
                {spots.map((spot) => (
                  <div key={spot.id} className="self-center justify-self-center">
                    <div className="rounded-full bg-accent p-1 shadow-[0_0_20px_rgba(255,106,0,0.5)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-black" />
                    </div>
                    <div className="mt-2 max-w-24 text-center text-xs text-muted">{spot.location.city}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {spots.map((spot) => (
              <article key={spot.id} className="panel overflow-hidden rounded-[28px]">
                <div
                  className="h-44 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.6)), url(${spot.primaryImage?.thumbnailUrl ?? spot.primaryImage?.imageUrl ?? ""})`,
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-medium">{spot.title}</h3>
                      <div className="mt-1 text-sm text-muted">
                        {spot.artist.tagName} • {spot.location.city}
                      </div>
                    </div>
                    <span className="rounded-full bg-accent-soft px-2 py-1 text-xs uppercase tracking-[0.2em] text-sand">
                      {spot.status}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm text-muted">
                    <span>{spot.category}</span>
                    <span>
                      {spot.avgRating.toFixed(1)} avg • {spot.ratingsCount} ratings
                    </span>
                  </div>
                  <Link href={`/spots/${spot.slug}`} className="mt-5 inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground">
                    View spot
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
