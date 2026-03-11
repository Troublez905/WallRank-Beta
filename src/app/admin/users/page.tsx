import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin users"
        title="Roles, bans, and user actions."
        description="User management is scaffolded here for role changes, bans, and moderation-related account review."
      />
      <PlaceholderGrid
        items={[
          { title: "User table", body: "Username, role, city, supporter points, and ban state." },
          { title: "Role editor", body: "Promote staff and adjust moderation access carefully." },
          { title: "Enforcement", body: "Ban flows and future account audit notes." },
        ]}
      />
    </>
  );
}
