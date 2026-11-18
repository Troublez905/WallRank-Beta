import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { getViewerProfile } from "@/server/queries/profile";

export default async function ProfilePage() {
  const profile = await getViewerProfile();

  if (!profile) {
    return (
      <>
        <PageHeader eyebrow="Profile" title="Profile unavailable." description="Sign in to view your WallRank identity and contribution history." />
      </>
    );
  }

  const supporterLevel =
    profile.supporterPoints >= 150 ? "Legend" : profile.supporterPoints >= 75 ? "Scout+" : "Scout";

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Profile"
        title={profile.displayName || profile.username}
        description="Your supporter identity, contribution totals, and public-facing community profile now come from the shared user query."
      />

      <section className="section-shell grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="panel rounded-[32px] p-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-semibold text-black">
            {(profile.displayName || profile.username).slice(0, 2).toUpperCase()}
          </div>
          <div className="mt-5 text-sm uppercase tracking-[0.2em] text-sand">{supporterLevel}</div>
          <h2 className="mt-2 text-2xl font-semibold">{profile.displayName || profile.username}</h2>
          <div className="mt-1 text-sm text-muted">@{profile.username}</div>
          <div className="mt-3 text-sm text-muted">
            {[profile.city, profile.country].filter(Boolean).join(", ") || "No location set"}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">{profile.bio || "No bio yet. Add one in settings to show your style, city focus, or scene interests."}</p>
          <div className="mt-6 grid gap-2 text-sm text-muted">
            <div>Email: {profile.email ?? "Unavailable"}</div>
            <div>Instagram: {profile.instagramHandle ? `@${profile.instagramHandle}` : "Not linked"}</div>
            <div>Website: {profile.websiteUrl ?? "Not linked"}</div>
            <div>Role: {profile.role}</div>
          </div>
          <Link href="/settings" className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-black">
            Edit settings
          </Link>
        </aside>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Supporter points", value: profile.supporterPoints },
              { label: "Uploads", value: profile.stats.uploads },
              { label: "Comments", value: profile.stats.comments },
              { label: "Ratings", value: profile.stats.ratings },
            ].map((item) => (
              <div key={item.label} className="panel rounded-[28px] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</div>
                <div className="display mt-3 text-4xl">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="panel rounded-[32px] p-6"><div className="eyebrow">Saved walls</div><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="display mt-2 text-4xl">Your favorites</h2><Link href="/map" className="street-link text-sm">Discover more</Link></div><div className="mt-6 grid gap-4 md:grid-cols-2">{profile.favorites.length ? profile.favorites.map((spot)=><Link key={spot.id} href={`/spots/${spot.slug}`} className="group overflow-hidden border border-line bg-black/30"><div className="h-36 bg-cover bg-center transition group-hover:scale-[1.02]" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(0,0,0,.72)),url(${spot.primaryImage?.thumbnailUrl ?? spot.primaryImage?.imageUrl ?? ""})`}}/><div className="p-4"><div className="text-xs font-bold uppercase tracking-[.16em] text-accent">{spot.location.city} · {spot.avgRating.toFixed(1)} ★</div><div className="display mt-1 text-2xl">{spot.title}</div></div></Link>) : <p className="text-muted md:col-span-2">Save spots from any artwork page to build your personal wall list.</p>}</div></div>
        </div>
      </section>
    </div>
  );
}
