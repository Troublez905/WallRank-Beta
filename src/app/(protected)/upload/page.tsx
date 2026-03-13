import { PageHeader } from "@/components/app-shell/page-header";
import { uploadSpotAction } from "@/app/(protected)/actions";

type UploadPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const params = await searchParams;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Upload flow"
        title="Submit a wall to moderation."
        description="This flow now uploads an image into Supabase Storage, then stores the location, artwork, and pending image record for moderation."
      />

      <section className="section-shell max-w-5xl">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <form action={uploadSpotAction} className="grid gap-6">
          <div className="panel grid gap-5 rounded-[32px] p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="eyebrow">Step 1</div>
              <h2 className="display mt-2 text-4xl">Identify the work</h2>
            </div>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Title</span>
              <input required name="title" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Artist tag</span>
              <input name="artistTag" placeholder="AERO or leave blank" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Category</span>
              <select name="category" defaultValue="piece" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent">
                {["graffiti", "mural", "sticker", "pasteup", "throwup", "piece", "other"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Date seen</span>
              <input type="date" name="dateSeen" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="text-muted">Description</span>
              <textarea name="description" rows={4} className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Style tags</span>
              <input name="styleTags" placeholder="wildstyle, chrome, character" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Wall type</span>
              <input name="wallType" placeholder="brick, concrete, warehouse" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
          </div>

          <div className="panel grid gap-5 rounded-[32px] p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="eyebrow">Step 2</div>
              <h2 className="display mt-2 text-4xl">Place the location</h2>
            </div>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Location name</span>
              <input name="locationName" placeholder="King William Wall" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Address / landmark</span>
              <input name="addressText" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">City</span>
              <input required name="city" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Province / state</span>
              <input name="provinceState" defaultValue="ON" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Country</span>
              <input name="country" defaultValue="Canada" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Visibility</span>
              <select name="visibility" defaultValue="public_approximate" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent">
                <option value="public_exact">Public exact</option>
                <option value="public_approximate">Public approximate</option>
                <option value="hidden_admin_only">Hidden admin only</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Latitude</span>
              <input required type="number" step="0.000001" name="latitude" defaultValue="43.255203" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Longitude</span>
              <input required type="number" step="0.000001" name="longitude" defaultValue="-79.868202" className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent" />
            </label>
          </div>

          <div className="panel grid gap-5 rounded-[32px] p-6">
            <div>
              <div className="eyebrow">Step 3</div>
              <h2 className="display mt-2 text-4xl">Finish submission</h2>
            </div>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Artwork image</span>
              <input
                type="file"
                name="imageFile"
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium file:text-black focus:border-accent"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Remote image URL fallback</span>
              <input
                name="imageUrl"
                placeholder="https://..."
                className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <div className="rounded-[24px] border border-dashed border-line p-4 text-sm leading-6 text-muted">
              Use the file field for the normal path. The URL field is only a fallback for already-hosted images. At least one image source is required.
            </div>
            <label className="flex items-start gap-3 rounded-[24px] border border-line p-4 text-sm text-muted">
              <input type="checkbox" name="agreement" className="mt-1" />
              <span>I confirm this upload should enter moderation and I understand public visibility may be generalized for sensitive locations.</span>
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted">New submissions are stored with `pending` status until a moderator reviews them.</div>
              <button type="submit" className="rounded-full bg-accent px-5 py-3 font-medium text-black">
                Submit spot
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
