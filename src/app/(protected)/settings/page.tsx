import { PageHeader } from "@/components/app-shell/page-header";
import { PlaceholderGrid } from "@/components/app-shell/placeholder-grid";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Account, profile, privacy."
        description="This route is reserved for account settings, linked socials, privacy controls, and any future moderation-related disclosures."
      />
      <PlaceholderGrid
        items={[
          { title: "Account settings", body: "Email, password, and auth provider controls." },
          { title: "Profile settings", body: "Display name, bio, social links, avatar, and city details." },
          { title: "Privacy + terms", body: "Visibility preferences, moderation policies, and account deactivation tools." },
        ]}
      />
    </>
  );
}
