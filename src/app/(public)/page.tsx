import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { featuredArtists, latestSpots, supporters } from "@/lib/site-data";

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="brick-band border-b border-white/60 py-12 md:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="line-panel p-6 md:p-9">
            <h1 className="display max-w-3xl text-6xl leading-[.86] md:text-8xl">Discover the streets.<br />Rate the culture.<br /><span className="text-accent">Rise</span> through the ranks.</h1>
            <p className="mt-6 max-w-xl border-l-4 border-red pl-4 leading-7 text-white/80">WallRank maps street art, spotlights local artists, and builds a living community archive across Hamilton and beyond.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Link href="/map" className="street-button street-button--yellow">Explore Map →</Link><Link href="/upload" className="street-button">Upload a Spot ↑</Link></div>
          </div>
          <div className="line-panel min-h-[430px] overflow-hidden p-5">
            <div className="flex items-center justify-between border-b border-white/50 pb-4 text-xs font-bold uppercase tracking-[.16em]"><span>Live Hamilton wall map</span><Link href="/map" className="text-accent">View full map →</Link></div>
            <div className="relative mt-5 min-h-[340px] bg-[radial-gradient(circle_at_40%_45%,rgba(244,255,0,.12),transparent_25%),linear-gradient(135deg,#242424,#080808)]">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:38px_38px]" />
              {["left-[16%] top-[24%]","left-[38%] top-[58%]","left-[62%] top-[30%]","left-[78%] top-[65%]","left-[50%] top-[18%]"].map((position,index)=><div key={position} className={`absolute ${position} grid h-10 w-10 place-items-center border-2 border-black font-black text-black shadow-[3px_3px_0_white] ${index%2 ? "bg-red text-white" : "bg-accent"}`}>{index+1}</div>)}
              <div className="display absolute bottom-5 left-5 text-5xl text-white/20">Hamilton</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6 py-12 lg:grid-cols-[1.15fr_.85fr]">
        <div className="line-panel p-6"><div className="flex items-end justify-between gap-4"><div><div className="eyebrow">Monthly Top 5</div><h2 className="display mt-2 text-5xl">Artists leading the wall</h2></div><Link href="/leaderboard" className="street-link text-sm">Full board →</Link></div><div className="mt-7 grid gap-4 md:grid-cols-3">{featuredArtists.map((artist,index)=><article key={artist.rank} className={`p-5 ${index===0?"rank-one":index===1?"rank-two":"rank-three"}`}><div className="display text-7xl leading-none">{artist.rank}</div><div className="display mt-4 text-4xl">{artist.tag}</div><div className="mt-2 text-sm font-bold uppercase">{artist.city}</div><div className="mt-7 border-t border-current/30 pt-3 text-sm">{artist.score} points · {artist.piece}</div></article>)}</div></div>
        <aside className="line-panel p-6"><div className="eyebrow">Top supporters</div><h2 className="display mt-2 text-4xl">People pushing culture</h2><div className="mt-6 grid gap-3">{supporters.map((supporter,index)=><div key={supporter.name} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border border-white/35 p-3"><div className="display text-4xl text-red">0{index+1}</div><div><div className="font-bold">{supporter.name}</div><div className="text-xs text-muted">{supporter.summary}</div></div><div className="font-bold text-accent">{supporter.points}</div></div>)}</div></aside>
      </section>

      <section className="bg-[#f1f1ee] py-12 text-black"><div className="section-shell"><div className="flex items-end justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-red">Latest uploads</div><h2 className="display mt-2 text-5xl">New movement on the map</h2></div><Link href="/map" className="street-link">View all →</Link></div><div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{latestSpots.map((spot,index)=><article key={spot.title} className="border-2 border-black bg-white p-3 shadow-[7px_7px_0_#090909]"><div className={`h-44 bg-[url('/art/wallrank-brick-graffiti.png')] bg-cover ${index%2?"bg-right":"bg-left"}`} /><div className="pt-4"><div className="flex justify-between gap-3"><h3 className="font-black uppercase">{spot.title}</h3><span className="text-xs font-bold text-red">{spot.rating.toFixed(1)}</span></div><p className="mt-1 text-sm text-black/65">{spot.city} · {spot.status}</p></div></article>)}</div></div></section>

      <section className="section-shell grid gap-6 py-12 lg:grid-cols-2">
        <article className="line-panel p-7"><div className="eyebrow">Founding store sponsor</div><h2 className="display mt-3 text-6xl"><span className="text-accent">Concrete Culture</span><br />Hamilton, Ontario</h2><p className="mt-5 max-w-xl leading-7 text-white/80">Concrete Culture is WallRank’s first store sponsor and affiliate—a Hamilton-based partner helping us create a stronger bridge between the city’s walls, its artists, and the people who follow the work.</p><p className="mt-4 max-w-xl text-sm leading-6 text-muted">Hamilton’s street-art story includes a city-supported legal wall and a growing network of murals shaped by local and visiting artists. WallRank is proud to build from that energy with a founding partner rooted in the city.</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/magazine" className="street-button street-button--yellow">Read the sponsor story →</Link><a href="https://tourismhamilton.com/street-art-guide/" target="_blank" rel="noreferrer" className="street-button">Hamilton street-art guide ↗</a></div></article>
        <article className="red-panel p-7"><div className="text-xs font-black uppercase tracking-[.2em] text-black">Staff dispatch</div><h2 className="display mt-3 text-6xl">The Weekly Wall</h2><p className="mt-3 max-w-xl leading-7">Events. Fresh uploads. Artist stories. Monthly rankings. One bright email from the WallRank staff every week.</p><div className="mt-7"><NewsletterForm /></div></article>
      </section>

      <section className="section-shell pb-12">
        <article className="line-panel grid overflow-hidden lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[360px] border-b border-white/40 lg:border-b-0 lg:border-r">
            <Image src="/art/404-kidz-genesis-season-01.png" alt="404 KiDZ Genesis Season 01 Not Found artwork" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="p-7 md:p-10">
            <div className="eyebrow">NFT + story universe affiliate</div>
            <h2 className="display mt-3 text-6xl md:text-7xl"><span className="text-red">404 KiDZ</span><br />Genesis signal detected</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">404 KiDZ joins WallRank as a project affiliate and sponsor: a graffiti-charged collectible universe beginning with Genesis Season 01 and designed to grow into physical figures, limited apparel, trading cards, animation, and game experiences.</p>
            <p className="mt-4 max-w-2xl leading-7 text-muted">The collection is currently in launch preparation. Its public mint date and official mint link have not been announced yet, so WallRank will publish the verified launch details here when they are locked.</p>
            <div className="mt-7 flex flex-wrap gap-4"><Link href="/magazine#404-kidz" className="street-button street-button--red">Explore 404 KiDZ -&gt;</Link><Link href="/magazine#not-found-series" className="street-button street-button--yellow">Meet the series -&gt;</Link></div>
          </div>
        </article>
      </section>
    </div>
  );
}
