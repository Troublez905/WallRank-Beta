import { getSupabaseStorageBucket } from "@/lib/env";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function isAbsoluteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export async function resolveStoredImageUrl(
  supabase: NonNullable<SupabaseServerClient>,
  storedValue: string | null,
) {
  if (!storedValue) {
    return null;
  }

  if (isAbsoluteUrl(storedValue)) {
    return storedValue;
  }

  const signingClient = createSupabaseAdminClient() ?? supabase;

  const { data, error } = await signingClient.storage
    .from(getSupabaseStorageBucket())
    .createSignedUrl(storedValue, 60 * 60);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
