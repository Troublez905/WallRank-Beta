import Link from "next/link";

import { featuredArtists, latestSpots, supporters } from "@/lib/site-data";

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="section-shell grid gap-8 py-12 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative">
          <div className="eyebrow">Live from the wall</div>
          <h1 className="display mt-4 max-w-4xl text-6xl leading-[0.88] md:text-8xl">
            Discover the streets. Rate the culture. Rise through the ranks.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
            WallRank turns street art discovery into a living archive with map-based exploration, artist profiles, supporter points, and a monthly Top 5 feeding Concrete Culture features.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/map" className="rounded-full bg-accent px-6 py-3 font-medium text-black transition hover:bg-[#ff812e]">
              Explore Map
            </Link>
            <Link href="/upload" className="rounded-full border border-line px-6 py-3 text-muted transition hover:text-foreground">
              Upload a Spot
            </Link>
          </div>
          <div className="spray-ring left-[-4rem] top-10 h-24 w-24 bg-accent-soft" />
        </div>

        <div className="panel relative overflow-hidden rounded-[32px] p-6">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,106,0,0.1),transparent_35%,rgba(212,179,139,0.08))]" />
          <div className="relative grid gap-4">
            <div className="rounded-[24px] border border-line bg-black/30 p-4">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Mini live map</span>
                <span>38 recent pins</span>
              </div>
              <div className="mt-4 grid h-56 grid-cols-6 gap-3 rounded-[20px] bg-[radial-gradient(circle_at_20%_25%,rgba(255,106,0,0.35),transparent_18%),radial-gradient(circle_at_75%_55%,rgba(212,179,139,0.28),transparent_16%),linear-gradient(180deg,#161818_0%,#0f1011_100%)] p-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full ${index % 3 === 0 ? "bg-accent" : "bg-sand"} ${index % 2 === 0 ? "h-3 w-3" : "h-2.5 w-2.5"} self-center justify-self-center shadow-[0_0_18px_rgba(255,106,0,0.5)]`}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {featuredArtists.map((artist) => (
                <article key={artist.rank} className="rounded-[24px] border border-line bg-panel-strong p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-sand">#{artist.rank}</div>
                  <div className="display mt-3 text-3xl">{artist.tag}</div>
                  <div className="mt-1 text-sm text-muted">{artist.city}</div>
                  <div className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">Top piece</div>
                  <div className="mt-1 text-sm text-foreground">{artist.piece}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-4 pb-6 md:grid-cols-3">
        {[
          "Map-first exploration with filters for city, rating, status, artist, and radius.",
          "Monthly Top 5 leaderboards for artists, plus supporter point progression.",
          "Moderated uploads with timeline photos and sensitive-location privacy controls.",
        ].map((copy) => (
          <div key={copy} className="panel rounded-[24px] p-5 text-sm leading-6 text-muted">
            {copy}
          </div>
        ))}
      </section>

      <section className="section-shell grid gap-6 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[32px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Monthly Top 5</div>
              <h2 className="display mt-2 text-4xl">Artists leading this month</h2>
            </div>
            <Link href="/leaderboard" className="text-sm text-sand">
              View leaderboard
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {featuredArtists.map((artist) => (
              <div key={artist.rank} className="grid gap-3 rounded-[24px] border border-line bg-black/20 p-4 md:grid-cols-[72px_1fr_auto] md:items-center">
                <div className="display text-5xl text-accent">#{artist.rank}</div>
                <div>
                  <div className="display text-3xl">{artist.tag}</div>
                  <div className="text-sm text-muted">
                    {artist.city} • {artist.piece}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">Score</div>
                  <div className="text-2xl font-semibold">{artist.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Top supporters</div>
            <h2 className="display mt-2 text-4xl">People pushing the culture</h2>
            <div className="mt-6 grid gap-4">
              {supporters.map((supporter) => (
                <div key={supporter.name} className="rounded-[24px] border border-line bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium">{supporter.name}</div>
                      <div className="text-sm text-muted">{supporter.summary}</div>
                    </div>
                    <div className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-sand">
                      {supporter.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Concrete Culture features</div>
            <h2 className="display mt-2 text-4xl">Store, magazine, season</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {["In-store spotlight", "Magazine preview", "Artist feature tile"].map((item) => (
                <div key={item} className="rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Latest uploads</div>
            <h2 className="display mt-2 text-4xl">New movement on the map</h2>
          </div>
          <Link href="/map" className="text-sm text-sand">
            Open full map
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {latestSpots.map((spot) => (
            <article key={spot.title} className="panel overflow-hidden rounded-[28px]">
              <div className="h-44 bg-[linear-gradient(135deg,#2a2d2f_0%,#121314_55%,#2d1a0a_100%)]" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium">{spot.title}</h3>
                  <span className="rounded-full bg-accent-soft px-2 py-1 text-xs uppercase tracking-[0.2em] text-sand">
                    {spot.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted">{spot.city}</div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-muted">Avg rating</span>
                  <span className="font-medium text-foreground">{spot.rating.toFixed(1)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
