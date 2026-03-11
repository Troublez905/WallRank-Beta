import Link from "next/link";
import type { ReactNode } from "react";

import { navigation } from "@/lib/site-data";

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.2),transparent_55%)]" />
      <header className="sticky top-0 z-30 border-b border-line/70 bg-background/80 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="display text-3xl leading-none text-accent">WR</div>
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.3em] text-sand">Concrete Culture</div>
              <div className="display text-2xl leading-none">WallRank</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/sign-in" className="rounded-full border border-line px-4 py-2 text-muted transition hover:text-foreground">
              Sign In
            </Link>
            <Link href="/upload" className="rounded-full bg-accent px-4 py-2 font-medium text-black transition hover:bg-[#ff812e]">
              Join Free
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-line/70 bg-black/30">
        <div className="section-shell flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <div>
            <div className="display text-2xl text-foreground">Street archives with a scoreboard.</div>
            <div className="mt-2 max-w-xl">
              Concrete Culture&apos;s discovery layer for murals, graffiti, and supporter energy across Hamilton, Toronto, and Niagara.
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/magazine">About</Link>
            <Link href="/settings">Rules</Link>
            <Link href="/settings">Privacy</Link>
            <Link href="/settings">Terms</Link>
            <Link href="/admin/reports">Report</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
