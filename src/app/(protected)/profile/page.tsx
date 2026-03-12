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

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Activity</div>
            <h2 className="display mt-2 text-4xl">Contribution snapshot</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-line p-4 text-sm leading-6 text-muted">
                Your uploads count comes from `artworks.submitted_by_user_id`.
              </div>
              <div className="rounded-[24px] border border-line p-4 text-sm leading-6 text-muted">
                Your comment total comes from the `comments` table and will later feed supporter reward logic.
              </div>
              <div className="rounded-[24px] border border-line p-4 text-sm leading-6 text-muted">
                Your rating count comes from the one-vote-per-artwork ledger in `ratings`.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
