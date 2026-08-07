import Image from "next/image";

import { NewsletterForm } from "@/components/newsletter-form";

export default function MagazinePage() {
  return (
    <div className="pb-16">
      <section className="brick-band py-16">
        <div className="section-shell">
          <div className="line-panel max-w-4xl p-8">
            <div className="eyebrow">Founding store sponsor</div>
            <h1 className="display mt-3 text-7xl leading-[.9] md:text-9xl"><span className="text-accent">Concrete Culture</span><br />Hamilton, Ontario</h1>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-7 py-12 lg:grid-cols-[1.2fr_.8fr]">
        <article className="light-panel p-7">
          <h2 className="display text-5xl">A first partner for the wall</h2>
          <p className="mt-5 text-lg leading-8">Concrete Culture is a Hamilton-based store and WallRank&apos;s first store sponsor and affiliate. This partnership is designed to connect online discovery with the people and places sustaining street culture in the city.</p>
          <p className="mt-5 leading-7 text-black/70">Hamilton has an established and evolving street-art story. The City opened its first legal wall at Woodlands Park in 2019, creating an approved space for emerging artists to practise and display their work. Tourism Hamilton&apos;s street-art guide also documents murals across the city and the role of Concrete Canvas in bringing local and visiting artists together.</p>
          <div className="mt-7 flex flex-wrap gap-4"><a href="https://www.hamilton.ca/city-council/news-notices/news-releases/city-hamilton-launches-legal-wall-street-art" target="_blank" rel="noreferrer" className="street-button street-button--red">City legal wall story</a><a href="https://tourismhamilton.com/street-art-guide/" target="_blank" rel="noreferrer" className="street-button street-button--yellow">Street-art guide</a></div>
        </article>
        <aside className="line-panel p-7">
          <div className="display inline-block rotate-[-3deg] border-4 border-accent p-5 text-4xl text-accent">Founding<br />Partner</div>
          <h2 className="display mt-8 text-4xl">What this sponsorship means</h2>
          <p className="mt-4 leading-7 text-white/75">A dedicated sponsor spotlight, stronger artist storytelling, community event coverage, and a local home base for future WallRank collaborations.</p>
          <p className="mt-5 text-sm text-muted">We will add verified store links, address, hours, and product details when Concrete Culture supplies or confirms them.</p>
        </aside>
      </section>

      <section id="404-kidz" className="section-shell scroll-mt-28 py-12">
        <div className="line-panel grid overflow-hidden lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative min-h-[440px] border-b border-white/40 lg:border-b-0 lg:border-r">
            <Image src="/art/404-kidz-genesis-season-01.png" alt="404 KiDZ Genesis Season 01 Not Found artwork" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
          <article className="p-7 md:p-10">
            <div className="eyebrow">Project affiliate + sponsor</div>
            <h2 className="display mt-3 text-7xl leading-[.9]"><span className="text-red">404 KiDZ</span><br />Not found. Always original.</h2>
            <p className="mt-6 text-lg leading-8 text-white/80">404 KiDZ is a cyberpunk-graffiti collectible universe built around 20 Genesis characters, a corrupted city, rarity-driven digital collectibles, and a long-term bridge between digital ownership and physical culture.</p>
            <p className="mt-4 leading-7 text-muted">Genesis Season 01 is the first active phase. The current plan calls for 7,777 NFTs on Polygon, with holder verification intended to support future community access, limited apparel opportunities, physical collectibles, and game integrations. Those later utilities remain post-launch expansion plans.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="border border-white/40 p-4"><div className="display text-4xl text-accent">20</div><div className="text-xs font-bold uppercase tracking-wider">Genesis characters</div></div><div className="border border-white/40 p-4"><div className="display text-4xl text-red">7,777</div><div className="text-xs font-bold uppercase tracking-wider">Planned supply</div></div><div className="border border-white/40 p-4"><div className="display text-4xl">TBA</div><div className="text-xs font-bold uppercase tracking-wider">Public mint date</div></div></div>
            <div className="mt-7 border-l-4 border-accent pl-5"><div className="font-black uppercase">Launch status</div><p className="mt-2 leading-7 text-white/70">Artwork, traits, metadata planning, mint infrastructure, and launch content are in production. The verified public mint URL and date will be added when the contract, metadata, and launch window are ready.</p></div>
          </article>
        </div>
      </section>

      <section id="not-found-series" className="brick-band scroll-mt-28 py-12">
        <div className="section-shell grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
          <article className="red-panel p-7 md:p-10">
            <div className="text-xs font-black uppercase tracking-[.2em] text-black">Upcoming cartoon + comic affiliate</div>
            <h2 className="display mt-3 text-7xl">404 KiDZ:<br />Not Found</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8">The 404 KiDZ story expands into a serialized animated street-noir mystery and comic series. Marker Kid discovers Ghost Ink, an impossible pigment capable of restoring art, places, and people erased from the city&apos;s memory.</p>
            <p className="mt-4 max-w-2xl leading-7">The planned launch format is a six-episode TV-14 season with short 4-6 minute chapters and vertical clips. Its world mixes graffiti transitions, cinematic 2.5D animation, neon streets, surveillance, loyalty, and the fight over who gets to own culture.</p>
          </article>
          <aside className="line-panel p-7">
            <div className="eyebrow">Issue 01 in development</div>
            <h3 className="display mt-3 text-5xl text-accent">Ghost Ink</h3>
            <p className="mt-4 leading-7 text-white/75">The first completed Story Edition spans seven pages, moving from Rooftop Court into Ghost Alley and introducing Marker Kid, Stick Up, Cap King, the System, and Graffiti Ghost.</p>
            <div className="mt-6 border border-white/40 p-5"><div className="font-black uppercase text-red">The central question</div><p className="mt-2 text-xl leading-8">Who owns culture after the people who created it are erased?</p></div>
            <p className="mt-5 text-sm leading-6 text-muted">WallRank will feature verified release links and new chapters as the cartoon and comic publishing schedule is announced.</p>
          </aside>
        </div>
      </section>

      <section className="section-shell pt-12"><div className="red-panel grid gap-8 p-7 md:grid-cols-[1fr_.8fr]"><div><div className="text-xs font-black uppercase tracking-[.2em] text-black">Weekly staff email</div><h2 className="display mt-3 text-7xl">The Weekly Wall</h2><p className="mt-4 max-w-xl text-lg leading-7">Get event notes, fresh wall uploads, artist features, and monthly ranking movement from the WallRank staff.</p><div className="mt-6 flex flex-wrap gap-3 text-sm font-bold uppercase"><span className="border border-black px-3 py-2">Events</span><span className="border border-black px-3 py-2">New walls</span><span className="border border-black px-3 py-2">Rankings</span></div></div><NewsletterForm /></div></section>
    </div>
  );
}
