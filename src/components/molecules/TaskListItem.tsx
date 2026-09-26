import { Badge } from "@/components/atoms/Badge";
import type { FollowUpTask } from "@/types/dashboard";

export function TaskListItem({ title, dueLabel, priority }: FollowUpTask) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">Due: {dueLabel}</p>
      </div>
      <Badge tone={priority === "High" ? "danger" : "neutral"}>{priority}</Badge>
    </div>
  );
}
