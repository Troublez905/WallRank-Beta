"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/server/auth/context";

function bounce(key: "message" | "error", value: string): never {
  redirect(`/admin/spots?${key}=${encodeURIComponent(value)}`);
}

export async function moderateSpotAction(formData: FormData) {
  const auth = await getAuthContext();
  const supabase = await createSupabaseServerClient();

  if (!auth.isConfigured || !supabase || !auth.user) {
    bounce("message", "Demo mode is active. Moderation was simulated.");
  }

  if (!auth.profile || (auth.profile.role !== "admin" && auth.profile.role !== "moderator")) {
    bounce("error", "You do not have permission to moderate spots.");
  }

  const artworkId = String(formData.get("artworkId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const featured = formData.get("isFeatured") === "on";

  if (!artworkId || !["approved", "rejected"].includes(decision)) {
    bounce("error", "Invalid moderation payload.");
  }

  const { error } = await supabase
    .from("artworks")
    .update({
      status: decision,
      is_featured: decision === "approved" ? featured : false,
      featured_month: decision === "approved" && featured ? new Date().toISOString().slice(0, 10) : null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", artworkId);

  if (error) {
    bounce("error", error.message);
  }

  bounce("message", `Spot ${decision}.`);
}
