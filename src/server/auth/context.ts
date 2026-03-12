import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthContext = {
  isConfigured: boolean;
  user: {
    id: string;
    email: string | null;
  } | null;
  profile: {
    username: string;
    displayName: string | null;
    role: "user" | "artist" | "admin" | "moderator";
  } | null;
};

type ProfileRow = {
  username: string;
  display_name: string | null;
  role: "user" | "artist" | "admin" | "moderator";
};

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      isConfigured: false,
      user: null,
      profile: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isConfigured: true,
      user: null,
      profile: null,
    };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("username, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const typedProfile = profile as ProfileRow | null;

  return {
    isConfigured: true,
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    profile: typedProfile
      ? {
          username: typedProfile.username,
          displayName: typedProfile.display_name,
          role: typedProfile.role,
        }
      : null,
  };
}
