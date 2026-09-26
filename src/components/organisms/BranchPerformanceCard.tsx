import { Card } from "@/components/molecules/Card";
import { StatTile } from "@/components/molecules/StatTile";
import type { PerformanceStat } from "@/types/dashboard";

type BranchPerformanceCardProps = {
  stats: PerformanceStat[];
};

export function BranchPerformanceCard({ stats }: BranchPerformanceCardProps) {
  return (
    <Card>
      <h3 className="font-semibold text-foreground">Branch Performance</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>
    </Card>
  );
}
