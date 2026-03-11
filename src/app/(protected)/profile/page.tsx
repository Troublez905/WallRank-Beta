import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Supporter identity and contribution history."
        description="This page is ready for avatar, supporter level, social links, stats, activity, uploads, comments, badges, and rewards."
      />
      <PlaceholderGrid
        items={[
          { title: "Header", body: "Avatar, username, level badge, social links, and stats row." },
          { title: "Tabs", body: "Activity, uploads, comments, badges, and rewards should become shared tab content blocks." },
          { title: "Points context", body: "Supporter totals can tie directly to the point-event ledger already defined in Supabase." },
        ]}
      />
    </>
  );
}
