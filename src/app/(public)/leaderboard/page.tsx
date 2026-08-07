import Link from "next/link";

import { monthlyFeatures } from "@/lib/site-data";
import { getLeaderboard } from "@/server/queries/leaderboard";

type Props = { searchParams: Promise<{ type?: string; month?: string }> };

export default async function LeaderboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type === "supporter" ? "supporter" : "artist";
  const items = await getLeaderboard(type);
  const activeMonth = monthlyFeatures.find((month) => month.id === params.month) ?? monthlyFeatures[0];
  const topFive = items.slice(0, 5);

  return (
    <div className="pb-16">
      <section className="brick-band border-b border-white/50 py-12"><div className="section-shell"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><h1 className="display text-7xl leading-none md:text-9xl">Top <span className="text-accent">5</span></h1><p className="mt-3 max-w-xl text-lg text-white/75">The artists and supporters making the biggest impact on WallRank this month.</p></div><div className="flex gap-3"><Link href={`/leaderboard?type=artist&month=${activeMonth.id}`} aria-current={type === "artist" ? "page" : undefined} className="street-button street-button--yellow">Artists</Link><Link href={`/leaderboard?type=supporter&month=${activeMonth.id}`} aria-current={type === "supporter" ? "page" : undefined} className="street-button">Supporters</Link></div></div></div></section>

      <section className="section-shell py-12">
        <div className="grid items-end gap-5 md:grid-cols-5">
          {topFive.map((item,index) => {
            const visualOrder = ["md:order-3 md:min-h-[440px] rank-one","md:order-2 md:min-h-[380px] rank-two","md:order-4 md:min-h-[360px] rank-three","md:order-1 md:min-h-[300px] bg-panel","md:order-5 md:min-h-[300px] bg-panel"][index];
            return <article key={item.entityId} className={`flex flex-col border border-current p-5 ${visualOrder}`}><div className="display text-8xl leading-none">{item.rank}</div><div className="mt-auto pt-12"><h2 className="display text-4xl">{item.name}</h2><p className="mt-1 text-xs font-bold uppercase tracking-[.14em]">{item.city ?? "Unknown city"}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-current/35 pt-4 text-sm"><div><div className="text-xs uppercase opacity-65">Month</div><strong>{item.monthlyPoints}</strong></div><div><div className="text-xs uppercase opacity-65">Total</div><strong>{item.totalPoints}</strong></div></div>{item.slug ? <Link href={`/artists/${item.slug}`} className="street-button mt-5 w-full !px-3 !py-2">View profile</Link> : null}</div></article>;
          })}
        </div>
      </section>

      <section className="border-y border-white/50 bg-black/95 py-12"><div className="section-shell grid gap-8 lg:grid-cols-[1fr_340px]"><div><div className="eyebrow">Top 3 — {activeMonth.label}</div><h2 className="display mt-2 text-6xl">Stories behind the ranking</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{activeMonth.stories.map((story,index)=><article key={story.rank} className={`line-panel p-5 ${index===2?"!shadow-[7px_7px_0_var(--red)]":""}`}><div className="display text-6xl text-accent">0{story.rank}</div><h3 className="display mt-2 text-4xl">{story.tag}</h3><div className="mt-1 font-bold uppercase text-red">{story.title}</div><p className="mt-4 text-sm leading-6 text-white/72">{story.copy}</p></article>)}</div></div><aside className="line-panel p-5"><div className="eyebrow">Monthly archive</div><h2 className="display mt-2 text-4xl">The board, logged</h2><div className="mt-6 grid gap-3">{monthlyFeatures.map((month)=><Link key={month.id} href={`/leaderboard?type=${type}&month=${month.id}`} aria-current={month.id===activeMonth.id?"page":undefined} className="street-button justify-between !px-4 !py-3">{month.label}<span>→</span></Link>)}</div><p className="mt-5 text-sm leading-6 text-muted">Each month keeps its own Top 3 editorial recap so the scene’s movement stays visible over time.</p></aside></div></section>
    </div>
  );
}
