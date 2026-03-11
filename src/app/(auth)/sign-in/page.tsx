import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="panel w-full max-w-md rounded-[32px] p-8">
        <div className="eyebrow">Authentication</div>
        <h1 className="display mt-3 text-5xl">Sign In</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Supabase Auth wiring can land here next. For now this route gives the app a real auth entry point instead of the starter placeholder.
        </p>
        <div className="mt-8 grid gap-3">
          <button className="rounded-full bg-accent px-4 py-3 font-medium text-black">Continue with email</button>
          <Link href="/" className="rounded-full border border-line px-4 py-3 text-center text-muted">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
