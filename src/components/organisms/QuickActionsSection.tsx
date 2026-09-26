import { QuickActionCard } from "@/components/molecules/QuickActionCard";
import type { QuickAction } from "@/types/dashboard";

type QuickActionsSectionProps = {
  actions: QuickAction[];
};

export function QuickActionsSection({ actions }: QuickActionsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">
        Quick Actions & Shortcuts
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}
