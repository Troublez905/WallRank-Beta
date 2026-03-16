import Link from "next/link";
import { notFound } from "next/navigation";

import { getArtistBySlug } from "@/server/queries/artists";

function formatMonth(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <div className="pb-16">
      <section className="section-shell py-12">
        <div className="panel overflow-hidden rounded-[36px]">
          <div className="h-48 bg-[radial-gradient(circle_at_20%_20%,rgba(255,106,0,0.32),transparent_20%),radial-gradient(circle_at_75%_35%,rgba(212,179,139,0.18),transparent_16%),linear-gradient(135deg,#1f2224_0%,#131516_50%,#29180c_100%)]" />
          <div className="grid gap-6 px-6 pb-6 pt-0 lg:grid-cols-[160px_1fr_auto] lg:items-end">
            <div className="-mt-14 flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-accent text-4xl font-semibold text-black">
              {artist.tagName.slice(0, 2)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="display text-6xl leading-none">{artist.tagName}</h1>
                {artist.isVerified ? <span className="rounded-full bg-accent-soft px-3 py-1 text-xs uppercase tracking-[0.18em] text-sand">verified</span> : null}
                {artist.isClaimed ? <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">claimed</span> : null}
              </div>
              <div className="mt-3 text-base text-muted">
                {artist.displayName ? `${artist.displayName} • ` : ""}
                {[artist.city, artist.country].filter(Boolean).join(", ") || "Location not listed"}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {artist.bio ?? "No artist bio yet."}
              </p>
            </div>
            <div className="grid gap-2 text-sm text-muted">
              {artist.instagramHandle ? <div>Instagram: @{artist.instagramHandle}</div> : null}
              {artist.twitterHandle ? <div>Twitter: @{artist.twitterHandle}</div> : null}
              {artist.websiteUrl ? (
                <Link href={artist.websiteUrl} className="text-foreground underline-offset-4 hover:underline">
                  Website
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-4 md:grid-cols-3 xl:grid-cols-7">
        {[
          { label: "Total points", value: artist.totalPoints },
          { label: "Monthly points", value: artist.monthlyPoints },
          { label: "Avg rating", value: artist.avgRating.toFixed(2) },
          { label: "Artwork count", value: artist.artworkCount },
          { label: "Spot count", value: artist.spotCount },
          { label: "Monthly rank", value: artist.monthlyRank ?? "-" },
          { label: "All-time rank", value: artist.allTimeRank ?? "-" },
        ].map((item) => (
          <div key={item.label} className="panel rounded-[28px] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</div>
            <div className="display mt-3 text-4xl">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="section-shell grid gap-6 py-10 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Gallery</div>
            <h2 className="display mt-2 text-4xl">Public works</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {artist.gallery.length > 0 ? (
                artist.gallery.map((piece) => (
                  <article key={piece.id} className="overflow-hidden rounded-[24px] border border-line">
                    <div
                      className="h-44 bg-cover bg-center"
                      style={{
                        backgroundImage: piece.imageUrl
                          ? `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.5)), url(${piece.thumbnailUrl ?? piece.imageUrl})`
                          : "linear-gradient(135deg,#2a2d2f_0%,#121314_55%,#2d1a0a_100%)",
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{piece.title}</h3>
                      <div className="mt-1 text-sm text-muted">
                        {piece.city} • {piece.avgRating.toFixed(1)} avg
                      </div>
                      <Link href={`/spots/${piece.slug}`} className="mt-4 inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground">
                        View spot
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                  No public artworks found for this artist yet.
                </div>
              )}
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Features</div>
            <h2 className="display mt-2 text-4xl">Top 5 and editorial placements</h2>
            <div className="mt-6 grid gap-4">
              {artist.features.length > 0 ? (
                artist.features.map((feature) => (
                  <article key={feature.id} className="rounded-[24px] border border-line p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-sand">{feature.featureType.replaceAll("_", " ")}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">{formatMonth(feature.featureMonth)}</div>
                    </div>
                    <div className="mt-3 text-lg font-medium">{feature.headline ?? "Feature placement"}</div>
                    <p className="mt-2 text-sm leading-6 text-muted">{feature.excerpt ?? "No excerpt provided."}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                  No published features yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Top pieces</div>
            <h2 className="display mt-2 text-4xl">Highest-rated work</h2>
            <div className="mt-6 grid gap-4">
              {artist.topPieces.length > 0 ? (
                artist.topPieces.map((piece, index) => (
                  <article key={piece.id} className="rounded-[24px] border border-line p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-sand">#{index + 1}</div>
                    <div className="mt-2 text-lg font-medium">{piece.title}</div>
                    <div className="mt-1 text-sm text-muted">
                      {piece.avgRating.toFixed(1)} avg • {piece.ratingsCount} ratings
                    </div>
                    <Link href={`/spots/${piece.slug}`} className="mt-4 inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground">
                      Open spot
                    </Link>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                  No public rating data yet.
                </div>
              )}
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">About</div>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              <div>City: {artist.city ?? "Unknown"}</div>
              <div>Country: {artist.country ?? "Unknown"}</div>
              <div>Claimed: {artist.isClaimed ? "Yes" : "No"}</div>
              <div>Verified: {artist.isVerified ? "Yes" : "No"}</div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
