import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { InteractiveSpotMap } from "@/components/map/interactive-spot-map";
import { cities } from "@/lib/site-data";
import { getSpots } from "@/server/queries/spots";
import type { SpotListItem } from "@/types/domain";

type MapPageProps = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    minRating?: string;
    featuredOnly?: string;
    sort?: "recent" | "rating" | "popular";
  }>;
};

type CityCluster = {
  city: string;
  count: number;
  avgRating: number;
  featuredCount: number;
  topSpot: SpotListItem | null;
};

const categories = ["all", "piece", "mural", "graffiti", "throwup", "sticker", "pasteup", "other"];
function buildMapHref(
  current: {
    q?: string;
    city?: string;
    category?: string;
    minRating?: string;
    featuredOnly?: string;
    sort?: string;
  },
  updates: Partial<{
    q: string;
    city: string;
    category: string;
    minRating: string;
    featuredOnly: string;
    sort: string;
  }>,
) {
  const params = new URLSearchParams();
  const next = {
    q: current.q ?? "",
    city: current.city ?? "All cities",
    category: current.category ?? "all",
    minRating: current.minRating ?? "",
    featuredOnly: current.featuredOnly ?? "false",
    sort: current.sort ?? "recent",
    ...updates,
  };

  if (next.q.trim()) {
    params.set("q", next.q.trim());
  }

  if (next.city && next.city !== "All cities") {
    params.set("city", next.city);
  }

  if (next.category && next.category !== "all") {
    params.set("category", next.category);
  }

  if (next.minRating) {
    params.set("minRating", next.minRating);
  }

  if (next.featuredOnly === "true") {
    params.set("featuredOnly", "true");
  }

  if (next.sort && next.sort !== "recent") {
    params.set("sort", next.sort);
  }

  const query = params.toString();
  return query ? `/map?${query}` : "/map";
}

function buildClusters(spots: SpotListItem[]): CityCluster[] {
  const clusters = new Map<string, SpotListItem[]>();

  spots.forEach((spot) => {
    const list = clusters.get(spot.location.city) ?? [];
    list.push(spot);
    clusters.set(spot.location.city, list);
  });

  return [...clusters.entries()]
    .map(([city, citySpots]) => ({
      city,
      count: citySpots.length,
      avgRating:
        citySpots.reduce((sum, spot) => sum + spot.avgRating, 0) / Math.max(citySpots.length, 1),
      featuredCount: citySpots.filter((spot) => spot.isFeatured).length,
      topSpot:
        citySpots.find((spot) => spot.isFeatured) ??
        citySpots.slice().sort((a, b) => b.avgRating - a.avgRating)[0] ??
        null,
    }))
    .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating);
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const city = params.city ?? "All cities";
  const category = params.category ?? "all";
  const minRating = params.minRating ? Number(params.minRating) : undefined;
  const featuredOnly = params.featuredOnly === "true";
  const sort = params.sort ?? "recent";
  const query = params.q ?? "";

  const spots = await getSpots({
    city,
    category,
    query,
    minRating,
    featuredOnly,
    sort,
  });
  const clusters = buildClusters(spots);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Explore map"
        title="Filter the city. Follow the paint."
        description="The map surface now shares the live spots query, carries filter state in the URL, and can render a real Google Map with clustered pins when the API key is available."
      />

      <section className="section-shell grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="panel rounded-[32px] p-6">
          <div className="eyebrow">Filters</div>
          <h2 className="display mt-2 text-4xl">Search the wall</h2>

          <form method="get" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Search title, artist, or city</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="King William, AERO, Toronto..."
                className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-muted">Sort</span>
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
              >
                <option value="recent">Most surfaced</option>
                <option value="rating">Highest rated</option>
                <option value="popular">Most rated</option>
              </select>
            </label>

            <input type="hidden" name="city" value={city === "All cities" ? "" : city} />
            <input type="hidden" name="category" value={category === "all" ? "" : category} />
            <input type="hidden" name="minRating" value={minRating ? String(minRating) : ""} />
            <input type="hidden" name="featuredOnly" value={featuredOnly ? "true" : "false"} />

            <button type="submit" className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-black">
              Apply filters
            </button>
          </form>

          <div className="mt-6">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">City</div>
            <div className="flex flex-wrap gap-2">
              {["All cities", ...cities].map((option) => (
                <Link
                  key={option}
                  href={buildMapHref(params, { city: option })}
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    city === option ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Category</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((option) => (
                <Link
                  key={option}
                  href={buildMapHref(params, { category: option })}
                  className={`rounded-full px-3 py-2 text-sm capitalize transition ${
                    category === option ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href={buildMapHref(params, {
                minRating: minRating === 4 ? "" : "4",
              })}
              className={`rounded-[22px] border px-4 py-4 text-sm ${
                minRating === 4 ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted"
              }`}
            >
              4.0+ rating
            </Link>
            <Link
              href={buildMapHref(params, {
                featuredOnly: featuredOnly ? "false" : "true",
              })}
              className={`rounded-[22px] border px-4 py-4 text-sm ${
                featuredOnly ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted"
              }`}
            >
              Featured only
            </Link>
          </div>

          <div className="mt-6 rounded-[24px] border border-dashed border-line p-4 text-sm leading-6 text-muted">
            {spots.length} spots are visible right now across {clusters.length} city cluster{clusters.length === 1 ? "" : "s"}.
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="eyebrow">Map canvas</div>
                <h2 className="display mt-2 text-4xl">Live city surface</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                <span className="rounded-full border border-line px-3 py-2">
                  {city === "All cities" ? "All cities" : city}
                </span>
                <span className="rounded-full border border-line px-3 py-2">
                  {sort === "rating" ? "Highest rated" : sort === "popular" ? "Most rated" : "Most surfaced"}
                </span>
                {featuredOnly ? <span className="rounded-full bg-accent-soft px-3 py-2 text-sand">Featured only</span> : null}
              </div>
            </div>

            <div className="mt-6">
              <InteractiveSpotMap
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null}
                spots={spots}
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {clusters.map((cluster) => (
                <div key={cluster.city} className="rounded-[24px] border border-line bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-sand">{cluster.city}</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="text-3xl font-semibold">{cluster.count}</div>
                    <div className="text-right text-sm text-muted">
                      <div>{cluster.avgRating.toFixed(1)} avg</div>
                      <div>{cluster.featuredCount} featured</div>
                    </div>
                  </div>
                  {cluster.topSpot ? (
                    <div className="mt-3 text-sm text-muted">
                      Top surface: <span className="text-foreground">{cluster.topSpot.title}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spots.map((spot) => (
              <article key={spot.id} className="panel overflow-hidden rounded-[28px]">
                <div
                  className="h-44 bg-cover bg-center"
                  style={{
                    backgroundImage: spot.primaryImage?.imageUrl
                      ? `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.6)), url(${spot.primaryImage.thumbnailUrl ?? spot.primaryImage.imageUrl})`
                      : "linear-gradient(135deg,#1f2123_0%,#131415_55%,#2d1a0a_100%)",
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-medium">{spot.title}</h3>
                      <div className="mt-1 text-sm text-muted">
                        {spot.artist.tagName} / {spot.location.city}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.16em]">
                      <span className="rounded-full bg-accent-soft px-2 py-1 text-sand">{spot.status}</span>
                      {spot.isFeatured ? (
                        <span className="rounded-full border border-line px-2 py-1 text-muted">Featured</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[20px] border border-line p-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-muted">Rating</div>
                      <div className="mt-2 text-lg font-semibold">{spot.avgRating.toFixed(1)}</div>
                    </div>
                    <div className="rounded-[20px] border border-line p-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-muted">Votes</div>
                      <div className="mt-2 text-lg font-semibold">{spot.ratingsCount}</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-line p-4 text-sm text-muted">
                    <div className="text-xs uppercase tracking-[0.16em] text-muted">Wall context</div>
                    <div className="mt-2 text-foreground">{spot.location.name}</div>
                    <div className="mt-2">
                      {spot.category} / {spot.location.visibility.replaceAll("_", " ")}
                    </div>
                  </div>

                  <Link
                    href={`/spots/${spot.slug}`}
                    className="mt-5 inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground"
                  >
                    View spot
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {spots.length === 0 ? (
            <div className="panel rounded-[32px] border border-dashed border-line p-10 text-center text-sm text-muted">
              No spots matched these filters. Try clearing the search text or removing one of the toggles.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
