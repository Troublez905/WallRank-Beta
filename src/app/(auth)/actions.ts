"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

function authRedirect(path: string, key: "message" | "error", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

function deriveUsername(email: string, fallbackId: string) {
  const localPart = email.split("@")[0] || "member";
  const safe = localPart.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18) || "member";
  return `${safe}_${fallbackId.slice(0, 6)}`;
}

async function ensureOwnProfileRow(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
) {
  const { data: existingProfile } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return;
  }

  const email = user.email ?? `${user.id}@wallrank.local`;
  const metadata = user.user_metadata ?? {};
  const metadataUsername =
    typeof metadata.username === "string" && metadata.username.trim().length > 0
      ? metadata.username.trim()
      : null;
  const metadataDisplayName =
    typeof metadata.display_name === "string" && metadata.display_name.trim().length > 0
      ? metadata.display_name.trim()
      : null;

  const userRecord: Database["public"]["Tables"]["users"]["Insert"] = {
    id: user.id,
    email,
    username: metadataUsername ?? deriveUsername(email, user.id),
    display_name: metadataDisplayName ?? metadataUsername ?? email.split("@")[0],
    role: "user",
    supporter_points: 0,
    is_banned: false,
  };

  const { error } = await supabase.from("users").insert(userRecord as never);

  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw error;
  }
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/profile");

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(authRedirect("/sign-in", "message", "Add Supabase env vars to enable real authentication."));
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(authRedirect("/sign-in", "error", error.message));
  }

  if (data.user) {
    await ensureOwnProfileRow(supabase, data.user);
  }

  redirect(next.startsWith("/") ? next : "/profile");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(authRedirect("/sign-up", "message", "Add Supabase env vars to enable real sign-up."));
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName || username,
      },
    },
  });

  if (error) {
    redirect(authRedirect("/sign-up", "error", error.message));
  }

  if (data.session && data.user) {
    await ensureOwnProfileRow(supabase, {
      ...data.user,
      user_metadata: {
        ...data.user.user_metadata,
        username,
        display_name: displayName || username,
      },
    });
  }

  redirect(
    authRedirect(
      "/sign-in",
      "message",
      data.session
        ? "Account created. Sign in to continue."
        : "Account created. Check your email confirmation flow, then sign in to continue.",
    ),
  );
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
