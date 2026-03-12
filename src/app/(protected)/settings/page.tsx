import { PageHeader } from "@/components/app-shell/page-header";
import { updateProfileAction } from "@/app/(protected)/actions";
import { getViewerProfile } from "@/server/queries/profile";

type SettingsPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [profile, params] = await Promise.all([getViewerProfile(), searchParams]);

  if (!profile) {
    return <PageHeader eyebrow="Settings" title="Settings unavailable." description="Sign in to edit your profile settings." />;
  }

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Settings"
        title="Account, profile, privacy."
        description="This form writes back to `public.users` and is the starting point for profile editing, social linking, and future privacy controls."
      />

      <section className="section-shell max-w-4xl">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <form action={updateProfileAction} className="panel grid gap-5 rounded-[32px] p-6 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Username</span>
            <input value={profile.username} disabled className="rounded-[18px] border border-line bg-black/10 px-4 py-3 text-muted" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Display name</span>
            <input
              name="displayName"
              defaultValue={profile.displayName ?? ""}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-muted">Bio</span>
            <textarea
              name="bio"
              defaultValue={profile.bio ?? ""}
              rows={4}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">City</span>
            <input name="city" defaultValue={profile.city ?? ""} className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Country</span>
            <input name="country" defaultValue={profile.country ?? ""} className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Instagram</span>
            <input
              name="instagramHandle"
              defaultValue={profile.instagramHandle ?? ""}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Twitter / X</span>
            <input
              name="twitterHandle"
              defaultValue={profile.twitterHandle ?? ""}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-muted">Website</span>
            <input
              name="websiteUrl"
              defaultValue={profile.websiteUrl ?? ""}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <div className="text-sm text-muted">Email and role stay read-only here for now.</div>
            <button type="submit" className="rounded-full bg-accent px-5 py-3 font-medium text-black">
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
