import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SiteFrame } from "@/components/app-shell/site-frame";
import { getAuthContext } from "@/server/auth/context";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();

  if (auth.isConfigured && !auth.user) {
    redirect("/sign-in");
  }

  return <SiteFrame>{children}</SiteFrame>;
}
