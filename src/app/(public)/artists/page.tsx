import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { cities } from "@/lib/site-data";
import { getArtists } from "@/server/queries/artists";

type ArtistsPageProps = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    verifiedOnly?: string;
    sort?: "monthly" | "all-time" | "rating" | "recent";
  }>;
};

function buildArtistsHref(
  current: { q?: string; city?: string; verifiedOnly?: string; sort?: string },
  updates: Partial<{ q: string; city: string; verifiedOnly: string; sort: string }>,
) {
  const params = new URLSearchParams();
  const next = {
    q: current.q ?? "",
    city: current.city ?? "All cities",
    verifiedOnly: current.verifiedOnly ?? "false",
    sort: current.sort ?? "monthly",
    ...updates,
  };

  if (next.q.trim()) {
    params.set("q", next.q.trim());
  }

  if (next.city && next.city !== "All cities") {
    params.set("city", next.city);
  }

  if (next.verifiedOnly === "true") {
    params.set("verifiedOnly", "true");
  }

  if (next.sort && next.sort !== "monthly") {
    params.set("sort", next.sort);
  }

  const query = params.toString();
  return query ? `/artists?${query}` : "/artists";
}

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const params = await searchParams;
  const city = params.city ?? "All cities";
  const verifiedOnly = params.verifiedOnly === "true";
  const sort = params.sort ?? "monthly";
  const query = params.q ?? "";

  const artists = await getArtists({
    query,
    city,
    verifiedOnly,
    sort,
  });

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Artists"
        title="Tags, city scenes, and who is rising this month."
        description="The directory now reads from the live artist query, with monthly momentum, verification filters, and a featured public wall on each card."
      />

      <section className="section-shell grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="panel rounded-[32px] p-6">
          <div className="eyebrow">Directory filters</div>
          <h2 className="display mt-2 text-4xl">Find a tag</h2>

          <form method="get" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Search tag, display name, or city</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="AERO, Hamilton, mural..."
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
                <option value="monthly">Monthly points</option>
                <option value="all-time">All-time points</option>
                <option value="rating">Highest rating</option>
                <option value="recent">Most active cards</option>
              </select>
            </label>

            <input type="hidden" name="city" value={city === "All cities" ? "" : city} />
            <input type="hidden" name="verifiedOnly" value={verifiedOnly ? "true" : "false"} />

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
                  href={buildArtistsHref(params, { city: option })}
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    city === option ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href={buildArtistsHref(params, { verifiedOnly: verifiedOnly ? "false" : "true" })}
              className={`rounded-[22px] border px-4 py-4 text-sm ${
                verifiedOnly ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted"
              }`}
            >
              Verified only
            </Link>
            <div className="rounded-[24px] border border-dashed border-line p-4 text-sm leading-6 text-muted">
              {artists.length} artist{artists.length === 1 ? "" : "s"} visible in the current filter set.
            </div>
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="eyebrow">Current slice</div>
                <h2 className="display mt-2 text-4xl">Directory board</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                <span className="rounded-full border border-line px-3 py-2">
                  {city === "All cities" ? "All cities" : city}
                </span>
                <span className="rounded-full border border-line px-3 py-2">
                  {sort === "all-time"
                    ? "All-time"
                    : sort === "rating"
                      ? "Highest rated"
                      : sort === "recent"
                        ? "Most active"
                        : "This month"}
                </span>
                {verifiedOnly ? <span className="rounded-full bg-accent-soft px-3 py-2 text-sand">Verified</span> : null}
              </div>
            </div>
          </div>

          {artists.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {artists.map((artist, index) => (
                <article key={artist.id} className="panel overflow-hidden rounded-[28px]">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: artist.topArtwork?.imageUrl
                        ? `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.68)), url(${artist.topArtwork.imageUrl})`
                        : "linear-gradient(135deg,#1f2123_0%,#131415_55%,#2d1a0a_100%)",
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-sand">
                          #{String(index + 1).padStart(2, "0")} / {artist.city ?? "Unknown city"}
                        </div>
                        <h3 className="display mt-3 text-4xl">{artist.tagName}</h3>
                        <div className="mt-2 text-sm text-muted">
                          {artist.displayName ?? "Unclaimed tag"} / {artist.country ?? "Unknown country"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.16em]">
                        {artist.isVerified ? (
                          <span className="rounded-full bg-accent px-3 py-1 text-black">Verified</span>
                        ) : null}
                        {artist.isClaimed ? (
                          <span className="rounded-full border border-line px-3 py-1 text-muted">Claimed</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-[20px] border border-line p-3">
                        <div className="text-xs uppercase tracking-[0.16em] text-muted">Month</div>
                        <div className="mt-2 text-lg font-semibold">{artist.monthlyPoints}</div>
                      </div>
                      <div className="rounded-[20px] border border-line p-3">
                        <div className="text-xs uppercase tracking-[0.16em] text-muted">All time</div>
                        <div className="mt-2 text-lg font-semibold">{artist.totalPoints}</div>
                      </div>
                      <div className="rounded-[20px] border border-line p-3">
                        <div className="text-xs uppercase tracking-[0.16em] text-muted">Avg</div>
                        <div className="mt-2 text-lg font-semibold">{artist.avgRating.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-line p-4 text-sm text-muted">
                      <div className="text-xs uppercase tracking-[0.16em] text-muted">Top public work</div>
                      <div className="mt-2 text-base text-foreground">
                        {artist.topArtwork?.title ?? "No approved work surfaced yet"}
                      </div>
                      <div className="mt-2">
                        {artist.topArtwork
                          ? `${artist.topArtwork.city ?? artist.city ?? "Unknown city"} / ${artist.topArtwork.avgRating.toFixed(1)} avg`
                          : `${artist.artworkCount} artworks / ${artist.spotCount} tracked spots`}
                      </div>
                    </div>

                    <Link
                      href={`/artists/${artist.slug}`}
                      className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-black"
                    >
                      View profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="panel rounded-[32px] border border-dashed border-line p-10 text-center text-sm text-muted">
              No artists matched this combination yet. Try clearing the search or widening the city filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
