import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { featuredArtists } from "@/lib/site-data";

export default function ArtistsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Artists"
        title="Verified tags, city scenes, featured walls."
        description="This directory is set up for search, filters, and ranking highlights, with each artist linking into a more detailed profile and performance view."
      />
      <div className="section-shell grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredArtists.map((artist) => (
          <article key={artist.tag} className="panel rounded-[28px] p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-sand">{artist.city}</div>
            <div className="display mt-3 text-5xl">{artist.tag}</div>
            <div className="mt-3 text-sm leading-6 text-muted">
              Featured piece: {artist.piece}. This card can evolve into the shared `ArtistCard` component from the checklist.
            </div>
            <Link href={`/artists/${artist.tag.toLowerCase()}`} className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-black">
              View profile
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
