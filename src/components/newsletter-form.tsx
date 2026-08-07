"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const payload = (await response.json()) as { message: string };
    setMessage(payload.message);
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3" aria-label="Join The Weekly Wall">
      <label htmlFor="newsletter-email" className="text-xs font-bold uppercase tracking-[.18em] text-accent">Email address</label>
      <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="border border-white bg-black px-4 py-4 text-lg text-white outline-none transition focus:border-red focus:shadow-[5px_5px_0_var(--red)]" />
      <button type="submit" disabled={status === "submitting"} className="street-button street-button--red disabled:cursor-wait disabled:opacity-70">
        {status === "submitting" ? "Joining..." : "Join the list →"}
      </button>
      <p className="text-xs leading-5 text-muted">Weekly staff updates about events, new walls, artist stories, and rankings. Unsubscribe anytime.</p>
      <p aria-live="polite" className={status === "error" ? "text-sm text-red" : "text-sm text-accent-neon"}>{message}</p>
    </form>
  );
}

