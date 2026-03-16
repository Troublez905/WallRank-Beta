"use server";

import { redirect } from "next/navigation";

import { getSupabaseStorageBucket } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";
import type { Database } from "@/types/database";

function redirectWithMessage(path: string, key: "message" | "error", value: string): never {
  redirect(`${path}?${key}=${encodeURIComponent(value)}`);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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

export async function updateProfileAction(formData: FormData) {
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    redirectWithMessage("/settings", "message", "Demo mode is active. Add Supabase env vars to save settings.");
  }

  const userId = auth.user.id;

  const payload: Partial<Database["public"]["Tables"]["users"]["Update"]> = {
    display_name: String(formData.get("displayName") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    country: String(formData.get("country") ?? "").trim() || null,
    instagram_handle: String(formData.get("instagramHandle") ?? "").trim() || null,
    twitter_handle: String(formData.get("twitterHandle") ?? "").trim() || null,
    website_url: String(formData.get("websiteUrl") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("users").update(payload as never).eq("id", userId);

  if (error) {
    redirectWithMessage("/settings", "error", error.message);
  }

  redirectWithMessage("/settings", "message", "Profile updated.");
}

export async function uploadSpotAction(formData: FormData) {
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    redirectWithMessage("/upload", "message", "Demo mode is active. Submission was simulated but not stored.");
  }

  const userId = auth.user.id;

  const title = String(formData.get("title") ?? "").trim();
  const artistTag = String(formData.get("artistTag") ?? "").trim();
  const category = String(formData.get("category") ?? "other").trim();
  const dateSeen = String(formData.get("dateSeen") ?? "").trim() || null;
  const wallType = String(formData.get("wallType") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const locationName = String(formData.get("locationName") ?? "").trim() || null;
  const addressText = String(formData.get("addressText") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const provinceState = String(formData.get("provinceState") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || "Canada";
  const latitude = Number(formData.get("latitude") ?? 0);
  const longitude = Number(formData.get("longitude") ?? 0);
  const visibility = String(formData.get("visibility") ?? "public_approximate").trim();
  const styleTags = String(formData.get("styleTags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const imageFile = formData.get("imageFile");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const agreement = formData.get("agreement");

  if (!title || !category || !agreement || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    redirectWithMessage("/upload", "error", "Please complete the required upload fields.");
  }

  const uploadedFile = imageFile instanceof File && imageFile.size > 0 ? imageFile : null;

  if (!uploadedFile && !imageUrl) {
    redirectWithMessage("/upload", "error", "Add an image file or a remote image URL before submitting.");
  }

  if (uploadedFile) {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

    if (!allowedTypes.has(uploadedFile.type)) {
      redirectWithMessage("/upload", "error", "Upload a JPG, PNG, WebP, or AVIF image.");
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      redirectWithMessage("/upload", "error", "Image files must be 10 MB or smaller.");
    }
  }

  let artistId: string | null = null;

  if (artistTag) {
    const { data: artist } = await supabase
      .from("artists")
      .select("id")
      .eq("tag_name", artistTag.toUpperCase())
      .maybeSingle();

    artistId = (artist as { id: string } | null)?.id ?? null;
  }

  const locationInsert: Database["public"]["Tables"]["locations"]["Insert"] = {
    name: locationName,
    address_text: addressText,
    city,
    province_state: provinceState,
    country,
    latitude,
    longitude,
    location_visibility: visibility as Database["public"]["Tables"]["locations"]["Row"]["location_visibility"],
  };

  const { data: location, error: locationError } = await supabase
    .from("locations")
    .insert(locationInsert as never)
    .select("id")
    .single();

  if (locationError || !location) {
    redirectWithMessage("/upload", "error", locationError?.message ?? "Unable to save location.");
  }

  const slug = `${slugify(title)}-${Date.now().toString().slice(-6)}`;
  const bucket = getSupabaseStorageBucket();
  let storedImageUrl = imageUrl;
  let storedImagePath: string | null = null;

  if (uploadedFile) {
    const extension = getFileExtension(uploadedFile.name, uploadedFile.type);
    const objectPath = `${userId}/artworks/${slug}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, uploadedFile, {
      upsert: false,
      contentType: uploadedFile.type,
    });

    if (uploadError) {
      redirectWithMessage("/upload", "error", uploadError.message);
    }

    storedImagePath = objectPath;
    storedImageUrl = objectPath;
  }

  const artworkInsert: Database["public"]["Tables"]["artworks"]["Insert"] = {
    artist_id: artistId,
    location_id: (location as { id: string }).id,
    submitted_by_user_id: userId,
    title,
    slug,
    description,
    category: category as Database["public"]["Tables"]["artworks"]["Row"]["category"],
    style_tags: styleTags,
    status: "pending",
    wall_type: wallType,
    date_seen: dateSeen,
  };

  const { data: artwork, error: artworkError } = await supabase
    .from("artworks")
    .insert(artworkInsert as never)
    .select("id")
    .single();

  if (artworkError || !artwork) {
    if (storedImagePath) {
      await supabase.storage.from(bucket).remove([storedImagePath]);
    }

    redirectWithMessage("/upload", "error", artworkError?.message ?? "Unable to save artwork.");
  }

  if (storedImageUrl) {
    const imageInsert: Database["public"]["Tables"]["artwork_images"]["Insert"] = {
      artwork_id: (artwork as { id: string }).id,
      uploaded_by_user_id: userId,
      image_url: storedImageUrl,
      thumbnail_url: storedImageUrl,
      is_primary: true,
      moderation_status: "pending",
    };

    const { error: imageInsertError } = await supabase.from("artwork_images").insert(imageInsert as never);

    if (imageInsertError) {
      if (storedImagePath) {
        await supabase.storage.from(bucket).remove([storedImagePath]);
      }

      redirectWithMessage("/upload", "error", imageInsertError.message);
    }
  }

  redirectWithMessage("/upload", "message", "Spot submitted to moderation.");
}
