import { saveFeatureAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { getFeatureCandidates } from "@/server/queries/admin";

type AdminFeaturesPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminFeaturesPage({ searchParams }: AdminFeaturesPageProps) {
  const [params, featureCandidates] = await Promise.all([searchParams, getFeatureCandidates()]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin features"
        title="Top 5 and featured artist publishing."
        description="This route now turns the monthly leaderboard into editable feature candidates for homepage and campaign publishing."
      />

      <section className="section-shell">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <div className="grid gap-4">
          {featureCandidates.map((candidate, index) => (
            <form key={candidate.artistId} action={saveFeatureAction} className="panel rounded-[32px] p-6">
              <input type="hidden" name="featureId" value={candidate.featureId ?? ""} />
              <input type="hidden" name="artistId" value={candidate.artistId} />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-sand">
                    Top {index + 1} / {candidate.city ?? "Unknown city"}
                  </div>
                  <h2 className="display mt-3 text-4xl">{candidate.artistTag}</h2>
                  <div className="mt-2 text-sm text-muted">
                    {candidate.monthlyPoints} monthly points / {candidate.totalPoints} all-time points
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" name="isPublished" defaultChecked={candidate.isPublished} />
                  Publish
                </label>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
                <label className="grid gap-2 text-sm">
                  <span className="text-muted">Feature type</span>
                  <select
                    name="featureType"
                    defaultValue={candidate.featureType}
                    className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
                  >
                    <option value="homepage_top5">Homepage Top 5</option>
                    <option value="magazine">Magazine</option>
                    <option value="instore">In-store</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-muted">Headline</span>
                  <input
                    name="headline"
                    defaultValue={candidate.headline}
                    className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
                  />
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm">
                <span className="text-muted">Excerpt</span>
                <textarea
                  name="excerpt"
                  rows={3}
                  defaultValue={candidate.excerpt}
                  className="rounded-[18px] border border-line bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
              </label>

              <button type="submit" className="mt-5 rounded-full bg-accent px-4 py-3 text-sm font-medium text-black">
                Save feature
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
