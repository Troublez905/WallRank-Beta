import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/app/(auth)/actions";
import { navigation } from "@/lib/site-data";
import { getAuthContext } from "@/server/auth/context";

export async function SiteFrame({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();
  const identity = auth.profile?.displayName || auth.profile?.username || auth.user?.email || "Profile";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />
      <header className="sticky top-0 z-30 border-b border-white/60 bg-black/95 backdrop-blur-md">
        <div className="section-shell flex items-center justify-between gap-5 py-4">
          <Link href="/" className="flex items-center gap-4" aria-label="WallRank home">
            <div className="display border-2 border-black bg-accent px-2 py-1 text-3xl leading-none text-black shadow-[4px_4px_0_var(--red)]">WR</div>
            <div><div className="text-xs font-bold uppercase tracking-[.25em] text-accent-neon">Concrete Culture</div><div className="display text-3xl leading-none">WallRank</div></div>
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[.1em] text-white lg:flex" aria-label="Primary navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} className="border-b-2 border-transparent py-2 transition hover:border-accent hover:text-accent">{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2 text-xs">
            {auth.user ? <><Link href="/profile" className="street-button !px-3 !py-2">{identity}</Link><form action={signOutAction}><button className="street-button street-button--yellow !px-3 !py-2">Sign Out</button></form></> : <><Link href="/sign-in" className="street-button !px-3 !py-2">Sign In</Link><Link href="/sign-up" className="street-button street-button--yellow !px-3 !py-2">Join Free</Link></>}
          </div>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 border-t border-black bg-[#d1d1ce] text-black">
        <div className="section-shell flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
          <div><div className="display text-4xl">Respect the wall. Support the culture.</div><p className="mt-2 max-w-2xl text-sm">A community archive for murals, graffiti, artists, and the people keeping Hamilton’s street culture visible.</p></div>
          <div className="flex flex-wrap gap-5 text-xs font-bold uppercase tracking-[.1em]"><Link href="/magazine">About</Link><Link href="/settings">Rules</Link><Link href="/settings">Privacy</Link><Link href="/settings">Terms</Link><Link href="/admin/reports">Report</Link></div>
        </div>
      </footer>
    </div>
  );
}
