"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseStorageBucket } from "@/lib/env";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";
import type { Database } from "@/types/database";

type RatingAggregateRow = {
  stars: number;
  artist_points_awarded: number;
};

const allowedTimelineTypes = new Set(["standard", "before", "after", "update", "historic"]);

function getSpotPath(slug: string) {
  return slug ? `/spots/${slug}` : "/map";
}

function redirectToSpot(slug: string, key: "message" | "error", value: string): never {
  redirect(`${getSpotPath(slug)}?${key}=${encodeURIComponent(value)}`);
}

function redirectToSignIn(slug: string): never {
  redirect(`/sign-in?next=${encodeURIComponent(getSpotPath(slug))}`);
}

function getFileExtension(fileName: string, mimeType: string) {
  const byName = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : null;

  if (byName) {
    return byName;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

async function recalculateArtworkRatingMetrics(artworkId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY for rating updates.");
  }

  const { data: ratings } = await admin
    .from("ratings")
    .select("stars, artist_points_awarded")
    .eq("artwork_id", artworkId);

  const rows = (ratings as RatingAggregateRow[] | null) ?? [];
  const ratingsCount = rows.length;
  const totalStars = rows.reduce((sum, rating) => sum + rating.stars, 0);
  const totalArtistPoints = rows.reduce((sum, rating) => sum + rating.artist_points_awarded, 0);

  await admin
    .from("artworks")
    .update({
      avg_rating: ratingsCount > 0 ? Number((totalStars / ratingsCount).toFixed(2)) : 0,
      ratings_count: ratingsCount,
      artist_points_total: totalArtistPoints,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", artworkId);
}

async function recalculateArtworkCommentCount(artworkId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY for comment updates.");
  }

  const { count } = await admin
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("artwork_id", artworkId)
    .eq("moderation_status", "visible");

  await admin
    .from("artworks")
    .update({
      comments_count: count ?? 0,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", artworkId);
}

export async function rateSpotAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    redirectToSignIn(slug);
  }

  if (!admin) {
    redirectToSpot(slug, "error", "Server is missing service-role configuration for ratings.");
  }

  const artworkId = String(formData.get("artworkId") ?? "");
  const stars = Number(formData.get("stars") ?? 0);
  const userId = auth.user.id;

  if (!slug || !artworkId || ![1, 2, 3, 4, 5].includes(stars)) {
    redirectToSpot(slug, "error", "Choose a valid star rating.");
  }

  const { data: artwork } = await admin
    .from("artworks")
    .select("artist_id")
    .eq("id", artworkId)
    .maybeSingle();
  const artworkArtistId = (artwork as { artist_id: string | null } | null)?.artist_id ?? null;

  const existingRatingResult = await supabase
    .from("ratings")
    .select("id")
    .eq("artwork_id", artworkId)
    .eq("user_id", userId)
    .maybeSingle();

  const existingRating = existingRatingResult.data as { id: string } | null;
  let ratingId = existingRating?.id ?? null;

  if (existingRating) {
    const { error } = await supabase
      .from("ratings")
      .update({
        stars,
        artist_points_awarded: stars,
      } as never)
      .eq("id", existingRating.id);

    if (error) {
      redirectToSpot(slug, "error", error.message);
    }
  } else {
    const { data: newRating, error } = await supabase
      .from("ratings")
      .insert({
        artwork_id: artworkId,
        artist_id: artworkArtistId,
        user_id: userId,
        stars,
        artist_points_awarded: stars,
        supporter_points_awarded: 1,
      } as never)
      .select("id")
      .single();

    if (error || !newRating) {
      redirectToSpot(slug, "error", error?.message ?? "Unable to save your rating.");
    }

    ratingId = (newRating as { id: string }).id;
  }

  if (ratingId) {
    if (artworkArtistId) {
      const { data: existingArtistEvent } = await admin
        .from("artist_point_events")
        .select("id")
        .eq("source_type", "rating")
        .eq("source_id", ratingId)
        .maybeSingle();

      if (existingArtistEvent) {
        await admin
          .from("artist_point_events")
          .update({ points: stars } as never)
          .eq("id", (existingArtistEvent as { id: string }).id);
      } else {
        const artistEventInsert: Database["public"]["Tables"]["artist_point_events"]["Insert"] = {
          artist_id: artworkArtistId,
          artwork_id: artworkId,
          source_type: "rating",
          source_id: ratingId,
          points: stars,
        };

        await admin.from("artist_point_events").insert({
          ...artistEventInsert,
        } as never);
      }
    }

    const { data: existingSupporterEvent } = await admin
      .from("supporter_point_events")
      .select("id")
      .eq("source_type", "rating")
      .eq("source_id", ratingId)
      .maybeSingle();

    if (existingSupporterEvent) {
      await admin
        .from("supporter_point_events")
        .update({ points: 1 } as never)
        .eq("id", (existingSupporterEvent as { id: string }).id);
    } else {
      const supporterEventInsert: Database["public"]["Tables"]["supporter_point_events"]["Insert"] = {
        user_id: userId,
        source_type: "rating",
        source_id: ratingId,
        points: 1,
      };

      await admin.from("supporter_point_events").insert(supporterEventInsert as never);
    }
  }

  await recalculateArtworkRatingMetrics(artworkId);
  revalidatePath(`/spots/${slug}`);
  revalidatePath("/map");
  redirectToSpot(slug, "message", "Rating saved.");
}

export async function addCommentAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    redirectToSignIn(slug);
  }

  if (!admin) {
    redirectToSpot(slug, "error", "Server is missing service-role configuration for comments.");
  }

  const artworkId = String(formData.get("artworkId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const userId = auth.user.id;

  if (!slug || !artworkId || !body) {
    redirectToSpot(slug, "error", "Comment text cannot be empty.");
  }

  const { count: existingCommentCount } = await admin
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("artwork_id", artworkId)
    .eq("user_id", userId);

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      artwork_id: artworkId,
      user_id: userId,
      body,
    } as never)
    .select("id")
    .single();

  if (error || !comment) {
    redirectToSpot(slug, "error", error?.message ?? "Unable to save your comment.");
  }

  if ((existingCommentCount ?? 0) === 0) {
    const commentEventInsert: Database["public"]["Tables"]["supporter_point_events"]["Insert"] = {
      user_id: userId,
      source_type: "comment",
      source_id: (comment as { id: string }).id,
      points: 1,
    };

    await admin.from("supporter_point_events").insert(commentEventInsert as never);
  }

  await recalculateArtworkCommentCount(artworkId);
  revalidatePath(`/spots/${slug}`);
  redirectToSpot(slug, "message", "Comment added.");
}

export async function uploadSpotPhotoAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    redirectToSignIn(slug);
  }

  const artworkId = String(formData.get("artworkId") ?? "");
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const timelineType = String(formData.get("timelineType") ?? "update");
  const imageFileValue = formData.get("imageFile");
  const imageFile = imageFileValue instanceof File && imageFileValue.size > 0 ? imageFileValue : null;
  const userId = auth.user.id;
  const bucket = getSupabaseStorageBucket();

  if (!slug || !artworkId || !imageFile) {
    redirectToSpot(slug, "error", "Add an image file before submitting.");
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

  if (!allowedTypes.has(imageFile.type)) {
    redirectToSpot(slug, "error", "Upload a JPG, PNG, WebP, or AVIF image.");
  }

  if (imageFile.size > 10 * 1024 * 1024) {
    redirectToSpot(slug, "error", "Image files must be 10 MB or smaller.");
  }

  if (!allowedTimelineTypes.has(timelineType)) {
    redirectToSpot(slug, "error", "Choose a valid timeline type.");
  }

  const extension = getFileExtension(imageFile.name, imageFile.type);
  const objectPath = `${userId}/artwork-updates/${artworkId}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, imageFile, {
    upsert: false,
    contentType: imageFile.type,
  });

  if (uploadError) {
    redirectToSpot(slug, "error", uploadError.message);
  }

  const { error: imageInsertError } = await supabase.from("artwork_images").insert({
    artwork_id: artworkId,
    uploaded_by_user_id: userId,
    image_url: objectPath,
    thumbnail_url: objectPath,
    caption,
    timeline_type: timelineType,
    moderation_status: "pending",
  } as never);

  if (imageInsertError) {
    await supabase.storage.from(bucket).remove([objectPath]);
    redirectToSpot(slug, "error", imageInsertError.message);
  }

  revalidatePath(`/spots/${slug}`);
  redirectToSpot(slug, "message", "New wall photo submitted to moderation.");
}
