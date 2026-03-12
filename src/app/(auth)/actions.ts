"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

function authRedirect(path: string, key: "message" | "error", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/profile");

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(authRedirect("/sign-in", "message", "Add Supabase env vars to enable real authentication."));
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(authRedirect("/sign-in", "error", error.message));
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

  if (data.user) {
    const userRecord: Database["public"]["Tables"]["users"]["Insert"] = {
      id: data.user.id,
      email,
      username,
      display_name: displayName || username,
    };

    await supabase.from("users").upsert(userRecord as never);
  }

  redirect(authRedirect("/sign-in", "message", "Account created. Sign in to continue."));
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
