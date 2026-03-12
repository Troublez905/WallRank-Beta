import Link from "next/link";

import { signInAction } from "@/app/(auth)/actions";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="panel w-full max-w-md rounded-[32px] p-8">
        <div className="eyebrow">Authentication</div>
        <h1 className="display mt-3 text-5xl">Sign In</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Use your Supabase email and password to access uploads, your profile, settings, and any staff-only moderation surfaces.
        </p>

        {params.message ? (
          <div className="mt-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">
            {params.message}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        <form action={signInAction} className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={params.next ?? "/profile"} />
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Email</span>
            <input
              required
              type="email"
              name="email"
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="you@wallrank.com"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Password</span>
            <input
              required
              type="password"
              name="password"
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="mt-2 rounded-full bg-accent px-4 py-3 font-medium text-black">
            Sign In
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <Link href="/sign-up" className="text-foreground">
            Need an account? Join free
          </Link>
          <Link href="/" className="hover:text-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
