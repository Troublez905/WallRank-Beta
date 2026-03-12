import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SiteFrame } from "@/components/app-shell/site-frame";
import { getAuthContext } from "@/server/auth/context";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthContext();

  if (auth.isConfigured && !auth.user) {
    redirect("/sign-in?next=/admin");
  }

  if (auth.isConfigured && (!auth.profile || (auth.profile.role !== "admin" && auth.profile.role !== "moderator"))) {
    redirect("/");
  }

  return <SiteFrame>{children}</SiteFrame>;
}
