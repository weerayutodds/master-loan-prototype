import { Card } from "@/components/molecules/Card";
import type { FollowUpEntry } from "@/types/lead-content";

type LeadFollowUpTimelineProps = {
  entries: FollowUpEntry[];
};

export function LeadFollowUpTimeline({ entries }: LeadFollowUpTimelineProps) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-divider pb-3">
        <h3 className="text-lg font-semibold text-primary-to">ประวัติการติดตาม</h3>
        <button
          type="button"
          className="rounded-lg bg-surface-muted px-4 py-2 text-sm font-medium text-muted-foreground"
        >
          บันทึกผลติดตาม
        </button>
      </div>

      <ul className="space-y-4 border-l border-divider pl-4">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute top-1.5 -left-[21px] size-2 rounded-full border border-surface bg-muted-foreground" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{entry.timestamp}</span>
              {entry.statusBadge ? (
                <span className="rounded-full border border-primary-to px-2 py-0.5 text-xs font-medium text-primary-to">
                  {entry.statusBadge}
                </span>
              ) : null}
              {entry.actionBadge ? (
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  {entry.actionBadge}
                </span>
              ) : null}
              <span className="text-muted-foreground">{entry.actor}</span>
            </div>
            {entry.note ? (
              <p className="mt-1 rounded-md bg-surface-muted px-3 py-2 text-xs whitespace-pre-line text-foreground">
                {entry.note}
              </p>
            ) : null}
            {entry.highlight ? (
              <p className="mt-1 rounded-md bg-surface-muted px-3 py-2 text-xs font-medium text-primary-to">
                {entry.highlight}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
