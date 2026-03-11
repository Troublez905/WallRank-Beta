import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { getLeaderboard } from "@/server/queries/leaderboard";

type LeaderboardPageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const params = await searchParams;
  const type = params.type === "supporter" ? "supporter" : "artist";
  const items = await getLeaderboard(type);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Leaderboard"
        title="Artists and supporters on the board."
        description="This page is connected to the shared leaderboard query. It uses Supabase when configured and drops back to demo rows while the project is still being wired."
      />

      <section className="section-shell grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="panel rounded-[32px] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/leaderboard?type=artist"
                className={`rounded-full px-4 py-2 text-sm transition ${type === "artist" ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"}`}
              >
                Artists
              </Link>
              <Link
                href="/leaderboard?type=supporter"
                className={`rounded-full px-4 py-2 text-sm transition ${type === "supporter" ? "bg-accent text-black" : "border border-line text-muted hover:text-foreground"}`}
              >
                Supporters
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted">
              <span className="rounded-full border border-line px-4 py-2 text-foreground">This Month</span>
              <span className="rounded-full border border-line px-4 py-2">All Time</span>
              <span className="rounded-full border border-line px-4 py-2">This Season</span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-line">
            <div className="grid grid-cols-[72px_1.3fr_1fr_1fr_1fr] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
              <div>Rank</div>
              <div>{type === "artist" ? "Artist" : "Supporter"}</div>
              <div>City</div>
              <div>Month</div>
              <div>{type === "artist" ? "Total / Rating" : "Total points"}</div>
            </div>
            {items.map((item) => (
              <div key={item.entityId} className="grid grid-cols-[72px_1.3fr_1fr_1fr_1fr] gap-3 border-t border-line px-5 py-4 text-sm">
                <div className="display text-3xl text-accent">#{item.rank}</div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.slug ? (
                    <Link href={`/artists/${item.slug}`} className="mt-1 inline-block text-xs uppercase tracking-[0.16em] text-sand">
                      View profile
                    </Link>
                  ) : (
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">Community member</div>
                  )}
                </div>
                <div className="text-muted">{item.city ?? "Unknown"}</div>
                <div>{item.monthlyPoints}</div>
                <div>
                  {type === "artist" ? `${item.totalPoints} / ${item.avgRating?.toFixed(2) ?? "-"}` : item.totalPoints}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="panel rounded-[28px] p-5">
            <div className="eyebrow">Current reward</div>
            <h2 className="display mt-2 text-3xl">Monthly feature slot</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              The current board winner can feed the homepage Top 5, store displays, and the next Concrete Culture feature package.
            </p>
          </div>
          <div className="panel rounded-[28px] p-5">
            <div className="eyebrow">Rules summary</div>
            <p className="mt-3 text-sm leading-6 text-muted">
              One vote per user per artwork, no self-rating, and monthly rankings derive from point events captured during the active month.
            </p>
          </div>
          <div className="panel rounded-[28px] p-5">
            <div className="eyebrow">Feature announcement</div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Admin tools can publish a curated Top 5 snapshot directly from the leaderboard data once the moderation flow is live.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
