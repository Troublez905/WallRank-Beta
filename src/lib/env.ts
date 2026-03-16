const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseStorageBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "artwork-images";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: supabaseUrl!,
    anonKey: supabaseAnonKey!,
  };
}

export function getSupabaseStorageBucket() {
  return supabaseStorageBucket;
}

export function hasSupabaseServiceRoleEnv() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getSupabaseServiceRoleEnv() {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error(
      "Missing Supabase service role environment variable. Set SUPABASE_SERVICE_ROLE_KEY for server-side signed URL generation.",
    );
  }

  return {
    url: supabaseUrl!,
    serviceRoleKey: supabaseServiceRoleKey!,
  };
}
