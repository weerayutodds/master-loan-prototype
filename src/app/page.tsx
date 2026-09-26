import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { QuickActionsSection } from "@/components/organisms/QuickActionsSection";
import { FollowUpTasksCard } from "@/components/organisms/FollowUpTasksCard";
import { BranchPerformanceCard } from "@/components/organisms/BranchPerformanceCard";
import { followUpTasks, performanceStats, quickActions } from "@/lib/mock";

export default function Home() {
  return (
    <>
      <DashboardHeader
        title="Master Loan Dashboard"
        subtitle="Track leads, manage applications, and check your metrics today."
        ctaLabel="ตรวจสอบข้อมูลลูกค้า"
      />
      <QuickActionsSection actions={quickActions} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FollowUpTasksCard tasks={followUpTasks} />
        <BranchPerformanceCard stats={performanceStats} />
      </div>
    </>
  );
}
