import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Moderation, features, and queue control."
        description="The admin surface is bootstrapped for pending uploads, report resolution, artist claims, Top 5 management, and user actions."
      />
      <PlaceholderGrid
        items={[
          { title: "Overview cards", body: "Pending uploads count, new users, open reports, current Top 5, and most active city." },
          { title: "Queues", body: "Pending spots, images, claims, and reports with staff-only moderation actions." },
          { title: "Feature manager", body: "Top 5 publishing and featured artist placements can live here." },
        ]}
      />
    </>
  );
}
