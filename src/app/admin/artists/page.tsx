import Link from "next/link";

import { reviewArtistClaimAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { getArtistClaimRequests } from "@/server/queries/admin";

type AdminArtistsPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminArtistsPage({ searchParams }: AdminArtistsPageProps) {
  const [params, claimRequests] = await Promise.all([searchParams, getArtistClaimRequests()]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin artists"
        title="Claims, tags, and artist cleanup."
        description="Staff can now review artist ownership claims directly from this queue and move accepted claimants into the artist role."
      />

      <section className="section-shell">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <div className="panel overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1.1fr_1fr_1.5fr_auto] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div>Artist</div>
            <div>Requested by</div>
            <div>Message</div>
            <div>Actions</div>
          </div>

          {claimRequests.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted">No pending artist claims right now.</div>
          ) : null}

          {claimRequests.map((claim) => (
            <div key={claim.id} className="grid grid-cols-[1.1fr_1fr_1.5fr_auto] gap-3 border-t border-line px-5 py-5 text-sm">
              <div>
                <div className="font-medium">{claim.artistTag}</div>
                <Link href={`/artists/${claim.artistSlug}`} className="mt-2 inline-block text-xs uppercase tracking-[0.16em] text-sand">
                  Open artist profile
                </Link>
              </div>
              <div className="text-muted">{claim.requestedBy}</div>
              <div className="text-muted">{claim.message ?? "No message provided."}</div>
              <form action={reviewArtistClaimAction} className="flex min-w-[220px] gap-2">
                <input type="hidden" name="claimRequestId" value={claim.id} />
                <input type="hidden" name="artistId" value={claim.artistId} />
                <input type="hidden" name="userId" value={claim.userId} />
                <button type="submit" name="decision" value="approved" className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-black">
                  Approve
                </button>
                <button type="submit" name="decision" value="rejected" className="rounded-full border border-line px-4 py-2 text-xs text-foreground">
                  Reject
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
