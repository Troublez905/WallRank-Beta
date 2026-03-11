import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Spot detail"
        title={slug.replaceAll("-", " ")}
        description="This route is prepared for the image carousel, artist link, summary card, mini map, timeline gallery, ratings histogram, threaded comments, and sticky action bar from the wireframe."
      />
      <PlaceholderGrid
        items={[
          { title: "Gallery + overview", body: "Primary image carousel, style tags, wall type, location privacy note, and directions entry point." },
          { title: "Ratings + comments", body: "One vote per user, histogram view, verified vote markers, threaded comments, and report actions." },
          { title: "Sticky actions", body: "Star rating input, add comment CTA, and upload-new-wall-photo action persist as the user scrolls." },
        ]}
      />
    </>
  );
}
