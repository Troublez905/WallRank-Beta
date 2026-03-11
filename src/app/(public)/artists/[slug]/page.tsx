import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Artist profile"
        title={slug.toUpperCase()}
        description="Artist detail pages are ready for a hero banner, stat row, gallery, map tab, ratings-over-time charts, features history, and claim/verification states."
      />
      <PlaceholderGrid
        items={[
          { title: "Hero + identity", body: "Banner image, avatar, tag name, city, socials, and verification state." },
          { title: "Stats tabs", body: "Gallery, map, charts, top pieces, features, and full about tab content." },
          { title: "Leaderboard context", body: "Monthly rank and all-time rank should sit directly in the stat row for quick comparison." },
        ]}
      />
    </>
  );
}
