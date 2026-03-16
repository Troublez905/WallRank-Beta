import Link from "next/link";

import { moderateImageAction, moderateSpotAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { getPendingImages, getPendingSpots } from "@/server/queries/admin";

type AdminSpotsPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminSpotsPage({ searchParams }: AdminSpotsPageProps) {
  const [params, pendingSpots, pendingImages] = await Promise.all([
    searchParams,
    getPendingSpots(),
    getPendingImages(),
  ]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin spots"
        title="Spot moderation queue."
        description="This page now reads pending artworks and lets staff approve or reject them. Feature state can be toggled during approval."
      />

      <section className="section-shell">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <div className="panel overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div>Spot</div>
            <div>Artist</div>
            <div>City</div>
            <div>Submitted by</div>
            <div>Actions</div>
          </div>

          {pendingSpots.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted">No pending spots right now.</div>
          ) : null}

          {pendingSpots.map((spot) => (
            <div key={spot.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 border-t border-line px-5 py-5 text-sm">
              <div>
                <div className="font-medium">{spot.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{spot.status}</div>
                <Link href={`/spots/${spot.slug}`} className="mt-2 inline-block text-xs uppercase tracking-[0.16em] text-sand">
                  Open spot page
                </Link>
              </div>
              <div className="text-muted">{spot.artistTag}</div>
              <div className="text-muted">{spot.city}</div>
              <div className="text-muted">{spot.submittedBy}</div>
              <form action={moderateSpotAction} className="flex min-w-[220px] flex-col gap-2">
                <input type="hidden" name="artworkId" value={spot.id} />
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input type="checkbox" name="isFeatured" defaultChecked={spot.isFeatured} />
                  Feature if approved
                </label>
                <div className="flex gap-2">
                  <button type="submit" name="decision" value="approved" className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-black">
                    Approve
                  </button>
                  <button type="submit" name="decision" value="rejected" className="rounded-full border border-line px-4 py-2 text-xs text-foreground">
                    Reject
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>

        <div className="mt-8 panel overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[120px_1.3fr_1fr_1fr_auto] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div>Preview</div>
            <div>Artwork</div>
            <div>Timeline</div>
            <div>Uploaded by</div>
            <div>Actions</div>
          </div>

          {pendingImages.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted">No pending image submissions right now.</div>
          ) : null}

          {pendingImages.map((image) => (
            <div key={image.id} className="grid grid-cols-[120px_1.3fr_1fr_1fr_auto] gap-3 border-t border-line px-5 py-5 text-sm">
              <div
                className="h-20 rounded-[18px] border border-line bg-cover bg-center"
                style={{
                  backgroundImage: image.previewUrl
                    ? `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.45)), url(${image.previewUrl})`
                    : "linear-gradient(135deg,#1f2123_0%,#131415_55%,#2d1a0a_100%)",
                }}
              />
              <div>
                <div className="font-medium">{image.artworkTitle}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{image.caption ?? "No caption provided"}</div>
                <Link href={`/spots/${image.artworkSlug}`} className="mt-2 inline-block text-xs uppercase tracking-[0.16em] text-sand">
                  Open spot page
                </Link>
              </div>
              <div className="text-muted">{image.timelineType}</div>
              <div className="text-muted">{image.uploadedBy}</div>
              <form action={moderateImageAction} className="flex min-w-[220px] flex-col gap-2">
                <input type="hidden" name="imageId" value={image.id} />
                <input type="hidden" name="artworkId" value={image.artworkId} />
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input type="checkbox" name="setPrimary" />
                  Set as primary if approved
                </label>
                <div className="flex gap-2">
                  <button type="submit" name="decision" value="approved" className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-black">
                    Approve
                  </button>
                  <button type="submit" name="decision" value="rejected" className="rounded-full border border-line px-4 py-2 text-xs text-foreground">
                    Reject
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
