import { Icon } from "@/components/atoms/Icon";
import type { PerformanceStat } from "@/types/dashboard";

export function StatTile({ label, value, changeLabel, trend }: PerformanceStat) {
  const trendColor = trend === "up" ? "text-success" : "text-danger";

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-sm ${trendColor}`}>
        <Icon name={trend === "up" ? "arrow-up" : "arrow-down"} className="size-3.5" />
        <span className="font-medium">{changeLabel}</span>
        <span className="text-muted-foreground">vs last month</span>
      </p>
    </div>
  );
}
