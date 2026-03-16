import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { getAdminOverview } from "@/server/queries/admin";

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin"
        title="Moderation, features, and queue control."
        description="This dashboard now reflects the live moderation state so staff can see where the backlog is building and jump straight into the right queue."
      />

      <section className="section-shell grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Pending spots", value: overview.pendingSpots, href: "/admin/spots" },
          { label: "Pending images", value: overview.pendingImages, href: "/admin/spots" },
          { label: "Artist claims", value: overview.pendingClaims, href: "/admin/artists" },
          { label: "Open reports", value: overview.openReports, href: "/admin/reports" },
          { label: "Published features", value: overview.publishedFeatures, href: "/admin/features" },
          { label: "Most active city", value: overview.mostActiveCity, href: "/admin/spots" },
        ].map((card) => (
          <article key={card.label} className="panel rounded-[28px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-sand">{card.label}</div>
            <div className="display mt-4 text-5xl">{card.value}</div>
            <Link href={card.href} className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground">
              Open queue
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
