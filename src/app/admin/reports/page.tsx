import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin reports"
        title="Reports and moderation outcomes."
        description="This route is prepared for report triage, status changes, and resolution history across artworks, images, comments, artists, and users."
      />
      <PlaceholderGrid
        items={[
          { title: "Report queue", body: "Target type, reason, reporter, timestamp, and current status." },
          { title: "Resolution panel", body: "Review notes, target context, and resolve or dismiss actions." },
          { title: "Audit trail", body: "Resolved-at timestamps and moderator visibility for accountability." },
        ]}
      />
    </>
  );
}
