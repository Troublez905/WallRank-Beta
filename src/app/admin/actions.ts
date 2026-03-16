"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";

function bounce(path: string, key: "message" | "error", value: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(value)}`);
}

async function requireStaff(path: string) {
  const auth = await getAuthContext();
  const serverClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  const writeClient = adminClient ?? serverClient;

  if (!auth.isConfigured || !writeClient) {
    bounce(path, "message", "Demo mode is active. This moderation action was simulated.");
  }

  if (!auth.user || !auth.profile || (auth.profile.role !== "admin" && auth.profile.role !== "moderator")) {
    bounce(path, "error", "You do not have permission to perform this admin action.");
  }

  return {
    auth,
    writeClient,
  };
}

function currentMonthDate() {
  return new Date().toISOString().slice(0, 7) + "-01";
}

export async function moderateSpotAction(formData: FormData) {
  const path = "/admin/spots";
  const { writeClient } = await requireStaff(path);

  const artworkId = String(formData.get("artworkId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const featured = formData.get("isFeatured") === "on";

  if (!artworkId || !["approved", "rejected"].includes(decision)) {
    bounce(path, "error", "Invalid moderation payload.");
  }

  const { error } = await writeClient
    .from("artworks")
    .update({
      status: decision,
      is_featured: decision === "approved" ? featured : false,
      featured_month: decision === "approved" && featured ? currentMonthDate() : null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", artworkId);

  if (error) {
    bounce(path, "error", error.message);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  revalidatePath("/map");
  bounce(path, "message", `Spot ${decision}.`);
}

export async function moderateImageAction(formData: FormData) {
  const path = "/admin/spots";
  const { writeClient } = await requireStaff(path);

  const imageId = String(formData.get("imageId") ?? "");
  const artworkId = String(formData.get("artworkId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const setPrimary = formData.get("setPrimary") === "on";

  if (!imageId || !["approved", "rejected"].includes(decision)) {
    bounce(path, "error", "Invalid image moderation payload.");
  }

  if (decision === "approved" && setPrimary && artworkId) {
    await writeClient
      .from("artwork_images")
      .update({ is_primary: false } as never)
      .eq("artwork_id", artworkId);
  }

  const { error } = await writeClient
    .from("artwork_images")
    .update({
      moderation_status: decision,
      is_primary: decision === "approved" ? setPrimary : false,
    } as never)
    .eq("id", imageId);

  if (error) {
    bounce(path, "error", error.message);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  bounce(path, "message", `Image ${decision}.`);
}

export async function reviewArtistClaimAction(formData: FormData) {
  const path = "/admin/artists";
  const { writeClient } = await requireStaff(path);

  const claimRequestId = String(formData.get("claimRequestId") ?? "");
  const artistId = String(formData.get("artistId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!claimRequestId || !artistId || !userId || !["approved", "rejected"].includes(decision)) {
    bounce(path, "error", "Invalid claim review payload.");
  }

  const reviewedAt = new Date().toISOString();
  const { error: claimError } = await writeClient
    .from("artist_claim_requests")
    .update({
      status: decision,
      reviewed_at: reviewedAt,
    } as never)
    .eq("id", claimRequestId);

  if (claimError) {
    bounce(path, "error", claimError.message);
  }

  if (decision === "approved") {
    await writeClient
      .from("artist_claim_requests")
      .update({
        status: "rejected",
        reviewed_at: reviewedAt,
      } as never)
      .eq("artist_id", artistId)
      .eq("status", "pending");

    await writeClient
      .from("artists")
      .update({
        owner_user_id: userId,
        is_claimed: true,
        updated_at: reviewedAt,
      } as never)
      .eq("id", artistId);

    await writeClient
      .from("users")
      .update({
        role: "artist",
        updated_at: reviewedAt,
      } as never)
      .eq("id", userId);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  bounce(path, "message", `Claim ${decision}.`);
}

export async function updateReportAction(formData: FormData) {
  const path = "/admin/reports";
  const { writeClient } = await requireStaff(path);

  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!reportId || !["reviewing", "resolved", "dismissed"].includes(status)) {
    bounce(path, "error", "Invalid report moderation payload.");
  }

  const { error } = await writeClient
    .from("reports")
    .update({
      status,
      resolved_at: status === "reviewing" ? null : new Date().toISOString(),
    } as never)
    .eq("id", reportId);

  if (error) {
    bounce(path, "error", error.message);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  bounce(path, "message", `Report marked ${status}.`);
}

export async function saveFeatureAction(formData: FormData) {
  const path = "/admin/features";
  const { writeClient } = await requireStaff(path);

  const featureId = String(formData.get("featureId") ?? "");
  const artistId = String(formData.get("artistId") ?? "");
  const featureType = String(formData.get("featureType") ?? "homepage_top5");
  const headline = String(formData.get("headline") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!artistId || !headline || !excerpt) {
    bounce(path, "error", "Headline and excerpt are required to save a feature.");
  }

  const payload = {
    artist_id: artistId,
    feature_type: featureType,
    feature_month: currentMonthDate(),
    headline,
    article_excerpt: excerpt,
    is_published: isPublished,
  };

  const { error } = featureId
    ? await writeClient
        .from("featured_artists")
        .update(payload as never)
        .eq("id", featureId)
    : await writeClient.from("featured_artists").insert(payload as never);

  if (error) {
    bounce(path, "error", error.message);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  revalidatePath("/");
  bounce(path, "message", "Feature saved.");
}

export async function updateUserModerationAction(formData: FormData) {
  const path = "/admin/users";
  const { writeClient } = await requireStaff(path);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  const isBanned = formData.get("isBanned") === "on";

  if (!userId || !["user", "artist", "admin", "moderator"].includes(role)) {
    bounce(path, "error", "Invalid user moderation payload.");
  }

  const { error } = await writeClient
    .from("users")
    .update({
      role,
      is_banned: isBanned,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", userId);

  if (error) {
    bounce(path, "error", error.message);
  }

  revalidatePath("/admin");
  revalidatePath(path);
  bounce(path, "message", "User updated.");
}
