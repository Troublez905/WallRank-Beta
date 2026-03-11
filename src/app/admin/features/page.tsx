import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminFeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin features"
        title="Top 5 and featured artist publishing."
        description="This route will manage homepage Top 5, magazine placements, in-store features, and seasonal spotlights."
      />
      <PlaceholderGrid
        items={[
          { title: "Top 5 manager", body: "Select featured artists, order rankings, and publish monthly snapshots." },
          { title: "Feature publishing", body: "Headline, article excerpt, and publish state for feature placements." },
          { title: "Cross-channel reuse", body: "One admin surface can feed homepage, magazine, and store displays." },
        ]}
      />
    </>
  );
}
