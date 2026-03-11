import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function UploadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Upload flow"
        title="Five steps from photo to moderation queue."
        description="This route is scaffolded for drag-and-drop upload, map pin placement, artist lookup, tags, moderation acknowledgment, and submission."
      />
      <PlaceholderGrid
        items={[
          { title: "Step 1-2", body: "Photo upload, validation, preview grid, address search, and exact-versus-approximate visibility." },
          { title: "Step 3-4", body: "Title, artist tag, category, date seen, wall status, description, tags, and legal note." },
          { title: "Step 5", body: "Moderation notice, agreement checkbox, and submit action into pending status." },
        ]}
      />
    </>
  );
}
