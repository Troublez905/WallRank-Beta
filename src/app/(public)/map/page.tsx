import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { MapExplorer } from "@/components/map-explorer";
import { cities } from "@/lib/site-data";
import { getSpots } from "@/server/queries/spots";

type MapPageProps = { searchParams: Promise<{ city?: string; category?: string; minRating?: string; featuredOnly?: string }> };
const categories = ["all", "piece", "mural", "graffiti", "throwup", "sticker", "pasteup", "other"];

function filterHref(params: { city: string; category: string; minRating?: number; featuredOnly: boolean }, update: Record<string,string|undefined>) {
  const query = new URLSearchParams();
  const values = { city: params.city === "All cities" ? undefined : params.city, category: params.category === "all" ? undefined : params.category, minRating: params.minRating?.toString(), featuredOnly: params.featuredOnly ? "true" : undefined, ...update };
  Object.entries(values).forEach(([key,value]) => { if (value) query.set(key,value); });
  const value = query.toString();
  return value ? `/map?${value}` : "/map";
}
export default async function MapPage({ searchParams }: MapPageProps) {
  const query = await searchParams;
  const filters = { city: query.city ?? "All cities", category: query.category ?? "all", minRating: query.minRating ? Number(query.minRating) : undefined, featuredOnly: query.featuredOnly === "true" };
  const spots = await getSpots(filters);

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Live wall map" title="Find the paint. Walk the city." description="Explore clustered artwork pins, search the visible walls, switch to a scannable list, or use your location to discover the closest pieces." />
      <section className="section-shell grid gap-6 xl:grid-cols-[310px_1fr]">
        <aside className="panel h-fit rounded-[32px] p-6 xl:sticky xl:top-28">
          <div className="eyebrow">Discovery filters</div><h2 className="display mt-2 text-4xl">Shape the route</h2>
          <div className="mt-6 grid gap-7">
            <div><div className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-muted">City</div><div className="flex flex-wrap gap-2">{["All cities",...cities].map((option)=><Link key={option} href={filterHref(filters,{city:option==="All cities"?undefined:option})} className={`border px-3 py-2 text-sm ${filters.city===option?"border-black bg-accent text-black":"border-line text-muted hover:border-accent hover:text-white"}`}>{option}</Link>)}</div></div>
            <div><div className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-muted">Category</div><div className="flex flex-wrap gap-2">{categories.map((option)=><Link key={option} href={filterHref(filters,{category:option==="all"?undefined:option})} className={`border px-3 py-2 text-sm capitalize ${filters.category===option?"border-black bg-accent text-black":"border-line text-muted hover:border-accent hover:text-white"}`}>{option}</Link>)}</div></div>
            <Link href={filterHref(filters,{minRating:filters.minRating===4?undefined:"4"})} className={`street-button ${filters.minRating===4?"street-button--yellow":""}`}>4★ and up</Link>
            <Link href={filterHref(filters,{featuredOnly:filters.featuredOnly?undefined:"true"})} className={`street-button ${filters.featuredOnly?"street-button--red":""}`}>Featured walls</Link>
            <Link href="/map" className="street-link text-sm">Reset all filters</Link>
            <p className="border-l-4 border-red pl-4 text-sm leading-6 text-muted">Sensitive walls use generalized pins. Exact coordinates are only shown when the location is marked safe for public access.</p>
          </div>
        </aside>
        <MapExplorer spots={spots} />
      </section>
    </div>
  );
}
