import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function MagazinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Magazine"
        title="Seasonal feature space."
        description="MVP keeps this route as a placeholder, but the shell is ready for editorial previews and future Concrete Culture feature integrations."
      />
      <PlaceholderGrid
        items={[
          { title: "Seasonal issue teaser", body: "Hero tile for the latest issue or feature collection." },
          { title: "Top 5 recap", body: "Monthly artist snapshots can feed future magazine blocks." },
          { title: "Store crossover", body: "The same featured-artist system can serve in-store and magazine promos." },
        ]}
      />
    </>
  );
}
