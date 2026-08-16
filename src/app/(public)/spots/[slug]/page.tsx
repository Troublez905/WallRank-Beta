import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app-shell/page-header";
import { getAuthContext } from "@/server/auth/context";
import { getSpotBySlug } from "@/server/queries/spots";
import { commentArtworkAction, rateArtworkAction, toggleFavoriteAction } from "./actions";

type SpotPageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ error?: string }> };

export default async function SpotDetailPage({ params, searchParams }: SpotPageProps) {
  const [{ slug }, query, auth] = await Promise.all([params, searchParams, getAuthContext()]);
  const spot = await getSpotBySlug(slug, auth.user?.id);
  if (!spot) notFound();

  return (
    <div className="pb-20">
      <PageHeader eyebrow={`${spot.category} / ${spot.status}`} title={spot.title} description={spot.description ?? `Documented at ${spot.location.name} in ${spot.location.city}.`} />
      <section className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,.55fr)]">
        <div className="grid gap-8">
          <div className="line-panel overflow-hidden rounded-[32px]">
            {spot.primaryImage ? <Image priority unoptimized src={spot.primaryImage.imageUrl} alt={`${spot.title} by ${spot.artist.tagName}`} width={1400} height={875} className="aspect-[16/10] w-full object-cover" /> : <div className="grid aspect-[16/10] place-items-center bg-panel-strong text-muted">Image awaiting moderation</div>}
            <div className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-end">
              <div><div className="text-sm uppercase tracking-[.18em] text-muted">Artist</div><div className="display mt-1 text-4xl">{spot.artist.tagName}</div><p className="mt-3 text-muted">{spot.location.name} · {spot.location.city}{spot.wallType ? ` · ${spot.wallType} wall` : ""}</p></div>
              {spot.artist.slug ? <Link href={`/artists/${spot.artist.slug}`} className="street-button">Artist profile</Link> : null}
            </div>
          </div>

          <section className="panel rounded-[32px] p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Community score</div><h2 className="display mt-2 text-5xl">{spot.avgRating.toFixed(1)} / 5</h2></div><div className="text-sm text-muted">{spot.ratingsCount} verified community ratings</div></div>
            <div className="mt-7 grid gap-2">
              {[5,4,3,2,1].map((stars) => { const count=spot.ratingsBreakdown[stars as 1|2|3|4|5]; const width=spot.ratingsCount ? (count/spot.ratingsCount)*100 : 0; return <div key={stars} className="grid grid-cols-[42px_1fr_32px] items-center gap-3 text-sm"><span>{stars} ★</span><div className="h-3 overflow-hidden bg-white/10"><div className="h-full bg-accent" style={{width:`${width}%`}} /></div><span className="text-right text-muted">{count}</span></div>; })}
            </div>
            <form action={rateArtworkAction} className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <input type="hidden" name="slug" value={spot.slug}/><input type="hidden" name="artworkId" value={spot.id}/><input type="hidden" name="artistId" value={spot.artist.id ?? ""}/>
              <label htmlFor="stars" className="font-bold">Your rating</label><select id="stars" name="stars" defaultValue={spot.viewerRating ?? 5} className="rounded-none border border-line bg-black px-4 py-3">{[5,4,3,2,1].map((value)=><option key={value} value={value}>{value} star{value===1?"":"s"}</option>)}</select>
              <button className="street-button street-button--yellow" type="submit">{spot.viewerRating ? "Update vote" : "Rate this wall"}</button>{!auth.user ? <span className="text-sm text-muted">Sign in required</span> : null}
            </form>
          </section>

          <section className="panel rounded-[32px] p-6 md:p-8">
            <div className="eyebrow">Wall talk</div><h2 className="display mt-2 text-5xl">{spot.commentsCount} comments</h2>
            {query.error ? <p className="mt-4 border border-red bg-red/10 p-3 text-sm text-red-neon">{query.error}</p> : null}
            <form action={commentArtworkAction} className="mt-6 grid gap-3"><input type="hidden" name="slug" value={spot.slug}/><input type="hidden" name="artworkId" value={spot.id}/><label htmlFor="comment" className="sr-only">Add a comment</label><textarea id="comment" name="body" required minLength={2} maxLength={1200} rows={4} placeholder="Share context, history, or respect for the work…" className="border border-line bg-black/40 p-4 outline-none focus:border-accent"/><button className="street-button w-fit" type="submit">Add comment</button></form>
            <div className="mt-8 grid gap-4">{spot.comments.length ? spot.comments.map((comment)=><article key={comment.id} className="border-l-4 border-accent bg-white/[.04] p-4"><div className="text-xs uppercase tracking-[.16em] text-muted">Community member · {new Intl.DateTimeFormat("en-CA",{dateStyle:"medium"}).format(new Date(comment.createdAt))}</div><p className="mt-2 leading-7">{comment.body}</p></article>) : <p className="text-muted">No comments yet. Add the first piece of context for this wall.</p>}</div>
          </section>
        </div>

        <aside className="grid h-fit gap-6 lg:sticky lg:top-28">
          <div className="red-panel rounded-[28px] p-6"><div className="text-xs font-bold uppercase tracking-[.2em]">Save the spot</div><h2 className="display mt-2 text-4xl">Build your wall list.</h2><form action={toggleFavoriteAction} className="mt-5"><input type="hidden" name="slug" value={spot.slug}/><input type="hidden" name="artworkId" value={spot.id}/><input type="hidden" name="isFavorite" value={String(spot.isFavorite)}/><button className="street-button w-full" type="submit">{spot.isFavorite ? "Remove favorite" : "Save to favorites"}</button></form></div>
          <div className="light-panel rounded-[28px] p-6"><div className="text-xs font-bold uppercase tracking-[.2em]">Location</div><h2 className="display mt-2 text-3xl">{spot.location.city}</h2><p className="mt-3 text-sm leading-6">{spot.location.visibility === "public_exact" ? "Exact location is available on the map." : "Coordinates are generalized to protect the work and property."}</p><Link href={`/map?city=${encodeURIComponent(spot.location.city)}`} className="street-button mt-5 w-full">Open on map</Link></div>
          {spot.styleTags.length ? <div className="panel rounded-[28px] p-6"><div className="eyebrow">Style tags</div><div className="mt-4 flex flex-wrap gap-2">{spot.styleTags.map((tag)=><span key={tag} className="border border-line px-3 py-2 text-sm">#{tag}</span>)}</div></div> : null}
        </aside>
      </section>
    </div>
  );
}
