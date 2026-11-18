"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";

async function requireMember(returnPath: string) {
  const [auth, supabase] = await Promise.all([getAuthContext(), createSupabaseServerClient()]);
  if (!auth.user || !supabase) redirect(`/sign-in?next=${encodeURIComponent(returnPath)}`);
  return { userId: auth.user.id, supabase };
}

export async function rateArtworkAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const artworkId = String(formData.get("artworkId") ?? "");
  const artistId = String(formData.get("artistId") ?? "") || null;
  const stars = Number(formData.get("stars"));
  if (!slug || !artworkId || !Number.isInteger(stars) || stars < 1 || stars > 5) return;
  const { userId, supabase } = await requireMember(`/spots/${slug}`);
  const { error } = await supabase.from("ratings").upsert({ artwork_id: artworkId, artist_id: artistId, user_id: userId, stars, artist_points_awarded: stars, supporter_points_awarded: 1 } as never, { onConflict: "artwork_id,user_id" });
  if (error) redirect(`/spots/${slug}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/spots/${slug}`);
}

export async function commentArtworkAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const artworkId = String(formData.get("artworkId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!slug || !artworkId || body.length < 2 || body.length > 1200) return;
  const { userId, supabase } = await requireMember(`/spots/${slug}`);
  const { error } = await supabase.from("comments").insert({ artwork_id: artworkId, user_id: userId, body } as never);
  if (error) redirect(`/spots/${slug}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/spots/${slug}`);
}

export async function toggleFavoriteAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const artworkId = String(formData.get("artworkId") ?? "");
  const remove = formData.get("isFavorite") === "true";
  if (!slug || !artworkId) return;
  const { userId, supabase } = await requireMember(`/spots/${slug}`);
  const result = remove
    ? await supabase.from("favorites").delete().eq("user_id", userId).eq("artwork_id", artworkId)
    : await supabase.from("favorites").upsert({ user_id: userId, artwork_id: artworkId } as never, { onConflict: "user_id,artwork_id" });
  if (result.error) redirect(`/spots/${slug}?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath(`/spots/${slug}`);
}
