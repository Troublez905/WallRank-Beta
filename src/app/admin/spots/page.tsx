import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminSpotsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin spots"
        title="Spot moderation queue."
        description="Dedicated moderation space for reviewing pending artworks, artist tagging, feature flags, and approval or rejection actions."
      />
      <PlaceholderGrid
        items={[
          { title: "Pending spot table", body: "Moderation rows with title, submitter, artist, city, timestamp, and status." },
          { title: "Review drawer", body: "Expanded view with image previews, metadata, and edit controls before moderation." },
          { title: "Approval actions", body: "Approve, reject, retag artist, and mark as featured." },
        ]}
      />
    </>
  );
}
