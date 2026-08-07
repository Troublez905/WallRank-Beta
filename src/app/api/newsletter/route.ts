import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Signup is temporarily unavailable." }, { status: 503 });
  }

  const subscriber: Database["public"]["Tables"]["newsletter_subscribers"]["Insert"] = {
    email,
    source: "weekly-wall",
    status: "active",
  };
  const { error } = await supabase.from("newsletter_subscribers").insert(subscriber as never);
  if (error?.code === "23505") {
    return NextResponse.json({ message: "You’re already on The Weekly Wall list." });
  }
  if (error) {
    console.error(JSON.stringify({ event: "newsletter_signup_failed", code: error.code, message: error.message }));
    return NextResponse.json({ message: "We couldn’t save your signup. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "You’re on the list. Watch your inbox." }, { status: 201 });
}
