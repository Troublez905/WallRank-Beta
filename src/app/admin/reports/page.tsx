import { PageHeader } from "@/components/app-shell/page-header";
import { getModerationReports } from "@/server/queries/admin";
import { updateReportAction } from "@/app/admin/actions";

type AdminReportsPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const [params, reports] = await Promise.all([searchParams, getModerationReports()]);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Admin reports"
        title="Reports and moderation outcomes."
        description="This queue now supports the full report triage flow: mark for review, resolve, or dismiss."
      />

      <section className="section-shell">
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-line bg-accent-soft px-4 py-3 text-sm text-foreground">{params.message}</div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{params.error}</div>
        ) : null}

        <div className="panel overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1fr_1fr_1.4fr_auto] gap-3 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div>Target</div>
            <div>Reported by</div>
            <div>Reason</div>
            <div>Actions</div>
          </div>

          {reports.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted">No active reports right now.</div>
          ) : null}

          {reports.map((report) => (
            <div key={report.id} className="grid grid-cols-[1fr_1fr_1.4fr_auto] gap-3 border-t border-line px-5 py-5 text-sm">
              <div>
                <div className="font-medium">{report.targetType}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{report.targetId}</div>
              </div>
              <div className="text-muted">{report.reportedBy}</div>
              <div>
                <div className="text-foreground">{report.reason}</div>
                <div className="mt-2 text-muted">{report.notes ?? "No extra notes provided."}</div>
              </div>
              <form action={updateReportAction} className="flex min-w-[260px] gap-2">
                <input type="hidden" name="reportId" value={report.id} />
                <button type="submit" name="status" value="reviewing" className="rounded-full border border-line px-4 py-2 text-xs text-foreground">
                  Review
                </button>
                <button type="submit" name="status" value="resolved" className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-black">
                  Resolve
                </button>
                <button type="submit" name="status" value="dismissed" className="rounded-full border border-line px-4 py-2 text-xs text-foreground">
                  Dismiss
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
