import { PageHeader } from "@/components/app-shell/page-header";
import { getAdminUsers } from "@/server/queries/admin";
import { updateUserModerationAction } from "@/app/admin/actions";

type AdminUsersPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const [params, users] = await Promise.all([searchParams, getAdminUsers()]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin users"
        title="Roles, bans, and user actions."
        description="This page now supports basic staff controls for role assignment and bans."
      />

      <section className="section-shell">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <div className="panel overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1fr_1.1fr_120px_140px_auto] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div>User</div>
            <div>Email</div>
            <div>City</div>
            <div>Points</div>
            <div>Actions</div>
          </div>

          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1fr_1.1fr_120px_140px_auto] gap-3 border-t border-line px-5 py-5 text-sm">
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{user.role}</div>
              </div>
              <div className="text-muted">{user.email}</div>
              <div className="text-muted">{user.city ?? "Unknown"}</div>
              <div className="text-muted">{user.supporterPoints}</div>
              <form action={updateUserModerationAction} className="flex min-w-[280px] items-center gap-3">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="rounded-[18px] border border-line bg-black/20 px-4 py-2 text-sm outline-none transition focus:border-accent"
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input type="checkbox" name="isBanned" defaultChecked={user.isBanned} />
                  Banned
                </label>
                <button type="submit" className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-black">
                  Save
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
