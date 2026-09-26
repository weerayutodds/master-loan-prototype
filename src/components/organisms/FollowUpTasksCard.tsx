import { Icon } from "@/components/atoms/Icon";
import { Card } from "@/components/molecules/Card";
import { TaskListItem } from "@/components/molecules/TaskListItem";
import type { FollowUpTask } from "@/types/dashboard";

type FollowUpTasksCardProps = {
  tasks: FollowUpTask[];
};

export function FollowUpTasksCard({ tasks }: FollowUpTasksCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <Icon name="calendar-check" className="size-5 text-primary" />
          งานติดตาม
        </h3>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          View All
        </a>
      </div>
      <div className="mt-2">
        {tasks.map((task) => (
          <TaskListItem key={task.id} {...task} />
        ))}
      </div>
    </Card>
  );
}
