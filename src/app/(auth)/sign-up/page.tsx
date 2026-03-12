import Link from "next/link";

import { signUpAction } from "@/app/(auth)/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="panel w-full max-w-lg rounded-[32px] p-8">
        <div className="eyebrow">Join WallRank</div>
        <h1 className="display mt-3 text-5xl">Create your account</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Register as a supporter first, then claim an artist profile later if you need ownership, stats, and ranking visibility tied to your tag.
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

        <form action={signUpAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Username</span>
            <input
              required
              type="text"
              name="username"
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="wallscout"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Display name</span>
            <input
              type="text"
              name="displayName"
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Wall Scout"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-muted">Email</span>
            <input
              required
              type="email"
              name="email"
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="you@wallrank.com"
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-muted">Password</span>
            <input
              required
              type="password"
              name="password"
              minLength={8}
              className="rounded-[18px] border border-line bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
              placeholder="Minimum 8 characters"
            />
          </label>
          <button type="submit" className="mt-2 rounded-full bg-accent px-4 py-3 font-medium text-black md:col-span-2">
            Create account
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <Link href="/sign-in" className="text-foreground">
            Already have an account? Sign in
          </Link>
          <Link href="/" className="hover:text-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
