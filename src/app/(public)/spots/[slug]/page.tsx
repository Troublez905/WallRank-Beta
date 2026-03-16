import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addCommentAction,
  rateSpotAction,
  uploadSpotPhotoAction,
} from "@/app/(public)/spots/actions";
import { getAuthContext } from "@/server/auth/context";
import { getSpotBySlug } from "@/server/queries/spots";

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function SpotDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const [{ slug }, uiState, auth] = await Promise.all([params, searchParams, getAuthContext()]);
  const spot = await getSpotBySlug(slug, auth.user?.id);

  if (!spot) {
    notFound();
  }

  const heroImage = spot.images.find((image) => image.isPrimary) ?? spot.images[0] ?? null;

  return (
    <div className="pb-16">
      <section className="section-shell pt-8">
        {uiState.message ? (
          <div className="mb-4 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{uiState.message}</div>
        ) : null}
        {uiState.error ? (
          <div className="mb-4 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{uiState.error}</div>
        ) : null}
      </section>

      <section className="section-shell grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="grid gap-4">
          <div
            className="panel min-h-[420px] overflow-hidden rounded-[32px] bg-cover bg-center"
            style={{
              backgroundImage: heroImage
                ? `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.55)), url(${heroImage.imageUrl})`
                : "linear-gradient(135deg,#2a2d2f_0%,#121314_55%,#2d1a0a_100%)",
            }}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {spot.images.map((image) => (
              <div
                key={`${image.imageUrl}-${image.timelineType}`}
                className="panel overflow-hidden rounded-[24px]"
              >
                <div
                  className="h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45)), url(${image.thumbnailUrl ?? image.imageUrl})`,
                  }}
                />
                <div className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-sand">{image.timelineType}</div>
                  <div className="mt-2 text-sm text-muted">{image.caption ?? "No caption provided."}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Spot detail</div>
            <h1 className="display mt-3 text-5xl leading-none">{spot.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-sand">{spot.status}</span>
              <span className="rounded-full border border-line px-3 py-1">{spot.category}</span>
              {spot.isFeatured ? <span className="rounded-full border border-line px-3 py-1">featured</span> : null}
            </div>

            <div className="mt-6 grid gap-4 text-sm text-muted">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Artist</div>
                {spot.artist.slug ? (
                  <Link href={`/artists/${spot.artist.slug}`} className="mt-1 inline-block text-lg font-medium text-foreground">
                    {spot.artist.tagName}
                  </Link>
                ) : (
                  <div className="mt-1 text-lg font-medium text-foreground">{spot.artist.tagName}</div>
                )}
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Seen</div>
                <div className="mt-1 text-foreground">{formatDate(spot.dateSeen)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Location</div>
                <div className="mt-1 text-foreground">
                  {spot.location.name} / {spot.location.city}
                </div>
              </div>
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Summary</div>
            <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Avg rating</div>
                <div className="display mt-2 text-4xl">{spot.avgRating.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Total ratings</div>
                <div className="mt-2 text-2xl font-semibold">{spot.ratingsCount}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Artist points</div>
                <div className="mt-2 text-2xl font-semibold">{spot.artistPointsTotal}</div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Overview</div>
            <h2 className="display mt-2 text-4xl">Wall context</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
              {spot.description ?? "No description has been added for this spot yet."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {spot.styleTags.length > 0 ? (
                spot.styleTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted">No style tags yet.</span>
              )}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-line p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Wall type</div>
                <div className="mt-2 text-sm text-foreground">{spot.wallType ?? "Unknown"}</div>
              </div>
              <div className="rounded-[24px] border border-line p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Location privacy</div>
                <div className="mt-2 text-sm text-foreground">{spot.location.visibility.replaceAll("_", " ")}</div>
              </div>
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Ratings</div>
            <h2 className="display mt-2 text-4xl">Histogram</h2>
            <div className="mt-6 grid gap-3">
              {["5", "4", "3", "2", "1"].map((star) => {
                const count = spot.ratingHistogram[star] ?? 0;
                const width = spot.ratingsCount > 0 ? `${(count / spot.ratingsCount) * 100}%` : "0%";

                return (
                  <div key={star} className="grid grid-cols-[60px_1fr_40px] items-center gap-4">
                    <div className="text-sm text-muted">{star} star</div>
                    <div className="h-3 overflow-hidden rounded-full bg-black/30">
                      <div className="h-full rounded-full bg-accent" style={{ width }} />
                    </div>
                    <div className="text-sm text-foreground">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Comments</div>
            <h2 className="display mt-2 text-4xl">Community notes</h2>
            {spot.viewer ? (
              <div className="mt-4 rounded-[24px] border border-line bg-black/20 p-4 text-sm text-muted">
                {spot.viewer.commentCount > 0 ? (
                  <>
                    You have added {spot.viewer.commentCount} comment{spot.viewer.commentCount > 1 ? "s" : ""} on this spot.
                    {spot.viewer.lastCommentAt ? ` Latest activity: ${formatDate(spot.viewer.lastCommentAt)}.` : null}
                  </>
                ) : (
                  "You have not commented on this spot yet."
                )}
              </div>
            ) : null}
            {auth.user ? (
              <form action={addCommentAction} className="mt-6 grid gap-3 rounded-[24px] border border-line p-4">
                <input type="hidden" name="slug" value={spot.slug} />
                <input type="hidden" name="artworkId" value={spot.id} />
                <textarea
                  name="body"
                  rows={3}
                  placeholder="Add a comment about the wall, update, or style..."
                  className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
                <div className="flex justify-end">
                  <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black">
                    Add comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                <Link href={`/sign-in?next=/spots/${spot.slug}`} className="text-foreground underline-offset-4 hover:underline">
                  Sign in
                </Link>{" "}
                to comment on this spot.
              </div>
            )}
            <div className="mt-6 grid gap-4">
              {spot.comments.length > 0 ? (
                spot.comments.map((comment) => (
                  <article key={comment.id} className="rounded-[24px] border border-line p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-medium">{comment.authorLabel}</div>
                      <div className="text-xs uppercase tracking-[0.16em] text-muted">{formatDate(comment.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted">{comment.body}</p>
                    <div className="mt-3 text-xs uppercase tracking-[0.16em] text-sand">
                      Helpful {comment.helpfulCount}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                  No visible comments yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Map</div>
            <h2 className="display mt-2 text-4xl">Where it sits</h2>
            <div className="mt-5 rounded-[28px] border border-line bg-[radial-gradient(circle_at_35%_35%,rgba(255,106,0,0.24),transparent_18%),linear-gradient(180deg,#17191a_0%,#101112_100%)] p-5">
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-4 w-4 rounded-full bg-accent shadow-[0_0_20px_rgba(255,106,0,0.55)]" />
                  <div className="mt-3 text-sm text-muted">
                    {spot.location.latitude.toFixed(4)}, {spot.location.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted">
              {spot.location.addressText ?? spot.location.name} / {spot.location.city}
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="eyebrow">Actions</div>
            {auth.user ? (
              <div className="mt-5 grid gap-5">
                <form action={rateSpotAction} className="grid gap-3">
                  <input type="hidden" name="slug" value={spot.slug} />
                  <input type="hidden" name="artworkId" value={spot.id} />
                  <label className="grid gap-2 text-sm">
                    <span className="text-muted">Rate this wall</span>
                    {spot.viewer?.existingRating ? (
                      <span className="text-xs uppercase tracking-[0.16em] text-sand">
                        Your current rating: {spot.viewer.existingRating} star{spot.viewer.existingRating > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.16em] text-muted">No rating saved yet</span>
                    )}
                    <select
                      name="stars"
                      defaultValue={String(spot.viewer?.existingRating ?? 5)}
                      className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} star{value > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-black">
                    Save rating
                  </button>
                </form>

                <form action={uploadSpotPhotoAction} className="grid gap-3">
                  <input type="hidden" name="slug" value={spot.slug} />
                  <input type="hidden" name="artworkId" value={spot.id} />
                  <label className="grid gap-2 text-sm">
                    <span className="text-muted">Upload new wall photo</span>
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium file:text-black focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span className="text-muted">Caption</span>
                    <input
                      name="caption"
                      className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span className="text-muted">Timeline type</span>
                    <select
                      name="timelineType"
                      defaultValue="update"
                      className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
                    >
                      {["standard", "before", "after", "update", "historic"].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="rounded-full border border-line px-4 py-3 text-sm text-foreground">
                    Submit photo
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-line p-4 text-sm text-muted">
                <Link href={`/sign-in?next=/spots/${spot.slug}`} className="text-foreground underline-offset-4 hover:underline">
                  Sign in
                </Link>{" "}
                to rate, comment, or upload a new wall photo.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
