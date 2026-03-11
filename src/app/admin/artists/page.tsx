import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminArtistsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin artists"
        title="Claims, tags, and artist cleanup."
        description="This page is for claim review, artist metadata correction, and future merge/tag management workflows."
      />
      <PlaceholderGrid
        items={[
          { title: "Artist table", body: "Claim state, ownership, stats, and verification status." },
          { title: "Claim review", body: "Approve or reject artist ownership requests with staff notes." },
          { title: "Tag editing", body: "Resolve naming inconsistencies and link artworks cleanly." },
        ]}
      />
    </>
  );
}
